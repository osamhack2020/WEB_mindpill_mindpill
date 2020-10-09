package tokens

import (
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"errors"
	"mindpill/backend/configs"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/ids"
	"os"
	"strconv"
	"strings"
	"time"

	"go.uber.org/zap"
)

var (
	b64encode     = base64.RawURLEncoding.EncodeToString
	b64decode     = base64.RawURLEncoding.DecodeString
	hashAlgorithm = sha512.New512_256
)

var tid = func() *ids.Node {
	nodeID, err := strconv.ParseUint(os.Getenv("NODE_ID"), 10, 32)
	if err != nil {
		nodeID = 0
		logger.Warn("Invalid or empty node id is provided; using 0 instead")
	}
	logger.Info(
		"Token id generater is initialized",
		zap.Uint64("node id", nodeID),
	)
	return ids.NewNode(nodeID)
}()

type Token struct {
	ID        uint64    `json:"tid"`
	UserID    int       `json:"uid"`
	IsRefresh bool      `json:"refresh"`
	CreatedAt time.Time `json:"cat"`

	signature []byte
}

func Claim(ctx context.Context, uid int) (*Token, *Token, error) {
	id := tid.Generate()
	record, err := database.Ent().Token.
		Create().
		SetTokenID(id).
		SetUserID(uid).
		Save(ctx)
	if err != nil {
		return nil, nil, err
	}
	accessToken := &Token{
		ID:        id,
		UserID:    uid,
		IsRefresh: false,
		CreatedAt: record.CreatedAt,
	}
	refreshToken := &Token{
		ID:        id,
		UserID:    uid,
		IsRefresh: true,
		CreatedAt: record.CreatedAt,
	}
	return accessToken, refreshToken, nil
}

func Parse(src string) (*Token, error) {
	var token Token
	if err := token.parse(src, false); err != nil {
		return nil, err
	}
	return &token, nil
}

func Validate(src string) (*Token, error) {
	var token Token
	if err := token.parse(src, true); err != nil {
		return nil, err
	}
	return &token, nil
}

func (t *Token) parse(src string, validate bool) error {
	payloadStr, signatureStr, err := splitToken(src)
	if err != nil {
		return err
	}
	payloadRaw, err := b64decode(payloadStr)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(payloadRaw, t); err != nil {
		return err
	}
	signature, err := b64decode(signatureStr)
	if err != nil {
		return err
	}
	t.signature = signature
	if validate {
		if err := t.validate(payloadRaw); err != nil {
			return err
		}
	}
	return nil
}

func (t *Token) Sign() (string, error) {
	var buf strings.Builder
	payload, err := json.Marshal(t)
	if err != nil {
		return "", err
	}
	buf.WriteString(b64encode(payload))
	buf.WriteByte('.')
	hasher := hmac.New(hashAlgorithm, []byte(configs.TokenSecret))
	hasher.Write(payload)
	t.signature = hasher.Sum(nil)
	buf.WriteString(b64encode(t.signature))
	return buf.String(), nil
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
	hasher := hmac.New(hashAlgorithm, []byte(configs.TokenSecret))
	hasher.Write(payload)
	signature := hasher.Sum(nil)
	if !hmac.Equal(signature, t.signature) {
		return errors.New("invalid token")
	}
	return nil
}
