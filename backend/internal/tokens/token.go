package tokens

import (
	"context"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/ids"
	"os"
	"strconv"
	"strings"
	"time"

	"go.uber.org/zap"
)

const TokenLifetime = 24 * time.Hour

var b64encode = base64.RawURLEncoding.EncodeToString

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
}

func ClaimToken(ctx context.Context, uid int) (*Token, *Token, error) {
	id := tid.Generate()
	record, err := database.Ent().Token.
		Create().
		SetUserID(uid).
		Save(ctx)
	if err != nil {
		return nil, nil, err
	}
	accessToken := &Token{id, uid, false, record.CreatedAt}
	refreshToken := &Token{id, uid, true, record.CreatedAt}
	return accessToken, refreshToken, nil
}

func (t *Token) Sign() (string, error) {
	var buf strings.Builder

	payload, err := json.Marshal(t)
	if err != nil {
		return "", err
	}

	buf.WriteString(b64encode(payload))
	buf.WriteByte('.')

	hasher := sha512.New512_256()
	hasher.Write(payload)

	signature := hasher.Sum(nil)
	buf.WriteString(b64encode(signature))

	return buf.String(), nil
}
