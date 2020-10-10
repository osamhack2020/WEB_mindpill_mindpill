package tokens

import (
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"errors"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/ids"
	"mindpill/ent"
	"mindpill/ent/group"
	"mindpill/ent/manager"
	"mindpill/ent/user"
	"os"
	"strconv"
	"time"

	"go.uber.org/zap"
)

var ErrNotRefresh = errors.New("tokens: provided token is not refresh token")

var (
	b64           = base64.RawURLEncoding
	hashAlgorithm = sha512.New512_256
)

type TokenGenerator struct {
	idgen *ids.Node
}

func NewGenerator() *TokenGenerator {
	nodeID, err := strconv.ParseUint(os.Getenv("NODE_ID"), 10, 32)
	if err != nil {
		nodeID = 0
		logger.Warn("Invalid or empty node id is provided; using 0 instead")
	}
	logger.Info(
		"Token id generater is initialized",
		zap.Uint64("node id", nodeID),
	)
	return &TokenGenerator{
		idgen: ids.NewNode(nodeID),
	}
}

type Token struct {
	ID        uint64    `json:"tid"`
	UserID    int       `json:"uid"`
	GroupID   int       `json:"gid"`
	IsAdmin   bool      `json:"isadm"`
	IsManager bool      `json:"isman"`
	IsRefresh bool      `json:"refresh"`
	CreatedAt time.Time `json:"cat"`

	signature []byte
}

func (g *TokenGenerator) Claim(ctx context.Context, userRecord *ent.User) (*Token, *Token, error) {
	groupRecord, err := userRecord.QueryGroup().
		Only(ctx)
	if err != nil {
		return nil, nil, err
	}

	isAdmin, err := userRecord.QueryAdmin().
		Exist(ctx)
	if err != nil {
		return nil, nil, err
	}

	isManager, err := database.Ent().
		Manager.Query().
		Where(
			manager.HasUserWith(
				user.IDEQ(userRecord.ID),
			),
			manager.HasGroupWith(
				group.IDEQ(groupRecord.ID),
			),
		).
		Exist(ctx)
	if err != nil {
		return nil, nil, err
	}

	tokenID := g.idgen.Generate()
	record, err := database.Ent().Token.
		Create().
		SetTokenID(tokenID).
		SetUserID(userRecord.ID).
		Save(ctx)
	if err != nil {
		return nil, nil, err
	}

	accessToken := &Token{
		ID:        tokenID,
		UserID:    userRecord.ID,
		GroupID:   groupRecord.ID,
		IsAdmin:   isAdmin,
		IsManager: isManager,
		IsRefresh: false,
		CreatedAt: record.CreatedAt,
	}
	refreshToken := &Token{
		ID:        tokenID,
		UserID:    userRecord.ID,
		GroupID:   groupRecord.ID,
		IsAdmin:   isAdmin,
		IsManager: isManager,
		IsRefresh: true,
		CreatedAt: record.CreatedAt,
	}
	return accessToken, refreshToken, nil
}

func (g *TokenGenerator) ClaimFromRefresh(ctx context.Context, t *Token) (*Token, *Token, error) {
	if !t.IsRefresh {
		return nil, nil, ErrNotRefresh
	}

	tokenID := g.idgen.Generate()
	record, err := database.Ent().Token.
		Create().
		SetTokenID(tokenID).
		SetUserID(t.UserID).
		Save(ctx)
	if err != nil {
		return nil, nil, err
	}

	accessToken := &Token{
		ID:        tokenID,
		UserID:    t.UserID,
		GroupID:   t.GroupID,
		IsAdmin:   t.IsAdmin,
		IsManager: t.IsManager,
		IsRefresh: false,
		CreatedAt: record.CreatedAt,
	}
	refreshToken := &Token{
		ID:        tokenID,
		UserID:    t.UserID,
		GroupID:   t.GroupID,
		IsAdmin:   t.IsAdmin,
		IsManager: t.IsManager,
		IsRefresh: true,
		CreatedAt: record.CreatedAt,
	}
	return accessToken, refreshToken, nil
}

func Parse(src []byte) (*Token, error) {
	var token Token
	if err := token.parse(src, false); err != nil {
		return nil, err
	}
	return &token, nil
}

func Validate(src []byte) (*Token, error) {
	var token Token
	if err := token.parse(src, true); err != nil {
		return nil, err
	}
	return &token, nil
}

func (t *Token) parse(src []byte, validate bool) error {
	payloadSrc, signatureSrc, err := splitToken(src)
	if err != nil {
		return err
	}

	payload, err := b64decode(payloadSrc)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(payload, t); err != nil {
		return err
	}

	signature, err := b64decode(signatureSrc)
	if err != nil {
		return err
	}
	t.signature = signature

	if validate {
		if err := t.validate(payload); err != nil {
			return err
		}
	}
	return nil
}

func (t *Token) Sign() ([]byte, error) {
	payload, err := json.Marshal(t)
	if err != nil {
		return nil, err
	}
	signature := hashData(hashAlgorithm, payload)

	var (
		payloadLen   = b64.EncodedLen(len(payload))
		signatureLen = b64.EncodedLen(len(signature))
		buf          = make(
			[]byte,
			payloadLen+signatureLen+1,
		)
	)
	b64.Encode(buf[:payloadLen], payload)
	buf[payloadLen] = '.'
	b64.Encode(buf[payloadLen+1:], signature)
	return buf, nil
}

func (t *Token) Validate() error {
	if t.signature == nil {
		return nil
	}
	payload, err := json.Marshal(t)
	if err != nil {
		return err
	}
	return t.validate(payload)
}

func (t *Token) validate(payload []byte) error {
	if t.signature == nil {
		return nil
	}
	signature := hashData(hashAlgorithm, payload)
	if !hmac.Equal(signature, t.signature) {
		return errors.New("invalid token")
	}
	return nil
}