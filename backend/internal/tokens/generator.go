package tokens

import (
	"context"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/ids"
	"mindpill/ent"
	"mindpill/ent/admin"
	"mindpill/ent/counselor"
	"mindpill/ent/group"
	"mindpill/ent/manager"
	"mindpill/ent/token"
	"mindpill/ent/user"
	"os"
	"strconv"

	"go.uber.org/zap"
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

func (g *TokenGenerator) claim(ctx context.Context, userID int) (*Token, *Token, error) {
	var (
		userPred      = user.IDEQ(userID)
		counselorPred = counselor.HasUserWith(userPred)
		managerPred   = manager.HasUserWith(userPred)
		adminPred     = admin.HasUserWith(userPred)
	)

	groupRecords, err := database.Ent().
		Group.Query().
		WithUsers(func(uq *ent.UserQuery) {
			uq.Where(userPred)
		}).
		WithCounselors(func(cq *ent.CounselorQuery) {
			cq.Where(counselorPred)
		}).
		WithManagers(func(mq *ent.ManagerQuery) {
			mq.Where(managerPred)
		}).
		Where(
			group.Or(
				group.HasUsersWith(userPred),
				group.HasCounselorsWith(counselorPred),
				group.HasManagersWith(managerPred),
			),
		).
		All(ctx)
	if err != nil {
		return nil, nil, err
	}

	isAdmin, err := database.Ent().
		Admin.Query().
		Where(adminPred).
		Exist(ctx)
	if err != nil {
		return nil, nil, err
	}

	tokenID := g.idgen.Generate()
	record, err := database.Ent().Token.
		Create().
		SetTokenID(tokenID).
		SetUserID(userID).
		Save(ctx)
	if err != nil {
		return nil, nil, err
	}

	groups := GroupMapFromRecords(groupRecords...)

	accessToken := &Token{
		ID:        tokenID,
		UserID:    userID,
		Groups:    groups,
		IsAdmin:   isAdmin,
		IsRefresh: false,
		CreatedAt: record.CreatedAt,
	}
	refreshToken := &Token{
		ID:        tokenID,
		UserID:    userID,
		Groups:    groups,
		IsAdmin:   isAdmin,
		IsRefresh: true,
		CreatedAt: record.CreatedAt,
	}
	return accessToken, refreshToken, nil

}

func (g *TokenGenerator) Claim(ctx context.Context, userRecord *ent.User) (*Token, *Token, error) {
	return g.claim(ctx, userRecord.ID)
}

func (g *TokenGenerator) ClaimFromUserID(ctx context.Context, userID int) (*Token, *Token, error) {
	return g.claim(ctx, userID)
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

	_, err = database.Ent().
		Token.Delete().
		Where(token.TokenIDEQ(t.ID)).
		Exec(ctx)
	if err != nil {
		return nil, nil, err
	}

	accessToken := &Token{
		ID:        tokenID,
		UserID:    t.UserID,
		Groups:    t.Groups,
		IsAdmin:   t.IsAdmin,
		IsRefresh: false,
		CreatedAt: record.CreatedAt,
	}
	refreshToken := &Token{
		ID:        tokenID,
		UserID:    t.UserID,
		Groups:    t.Groups,
		IsAdmin:   t.IsAdmin,
		IsRefresh: true,
		CreatedAt: record.CreatedAt,
	}
	return accessToken, refreshToken, nil
}
