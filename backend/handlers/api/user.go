package api

import (
	"bytes"
	"encoding/json"
	"mindpill/backend/internal/database"
	"mindpill/ent/user"
	"strconv"
	"time"

	"github.com/valyala/fasthttp"
	"golang.org/x/crypto/bcrypt"
)

type CreateUserRequest struct {
	Email       string      `json:"email"`
	Password    string      `json:"password"`
	Name        string      `json:"name"`
	SvNumber    string      `json:"sv_number"`
	Gender      user.Gender `json:"gender"`
	PhoneNumber string      `json:"phone_number"`

	// Edges

	RankID  int `json:"rank_id"`
	GroupID int `json:"group_id"`
}

type CreateUserResponse struct {
	UserID int `json:"user_id"`
}

func CreateUser(ctx *fasthttp.RequestCtx) {
	var req CreateUserRequest

	body := ctx.PostBody()
	err := json.Unmarshal(body, &req)
	if err != nil {
		Error(400, err).Write(ctx)
		return
	}

	hash, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		Error(500, err).Write(ctx)
		return
	}

	user, err := database.Ent().
		User.
		Create().
		SetEmail(req.Email).
		SetPasswordHash(hash).
		SetName(req.Name).
		SetSvNumber(req.SvNumber).
		SetGender(req.Gender).
		SetPhoneNumber(req.PhoneNumber).
		AddGroupIDs(req.GroupID).
		SetRankID(req.RankID).
		Save(ctx)
	if err != nil {
		Error(500, err).Write(ctx)
		return
	}

	var buf = bytes.NewBuffer(make([]byte, 0))
	err = json.NewEncoder(buf).Encode(&CreateUserResponse{
		UserID: user.ID,
	})
	if err != nil {
		Error(500, err).Write(ctx)
		return
	}
	ctx.Write(buf.Bytes())
}

type DescribeUserResponse struct {
	SvNumber    string      `json:"sv_number"`
	Email       string      `json:"email"`
	Name        string      `json:"name"`
	Gender      user.Gender `json:"gender"`
	PhoneNumber *string     `json:"phone_number"`
	Rank        string      `json:"rank"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

func DescribeUser(ctx *fasthttp.RequestCtx) {
	var queries = ctx.QueryArgs()
	userID, err := strconv.ParseInt(string(queries.Peek("user_id")), 10, 64)
	if err != nil {
		BadRequest(ctx, err, "user_id must be int")
		return
	}

	userRecord, err := database.Ent().
		User.Query().
		Where(user.IDEQ(int(userID))).
		WithRank().
		Only(ctx)
	if err != nil {
		NotFound(ctx, err, "user not found")
		return
	}

	SendResponse(ctx, &DescribeUserResponse{
		SvNumber:    userRecord.SvNumber,
		Email:       userRecord.Email,
		Name:        userRecord.Name,
		Gender:      userRecord.Gender,
		PhoneNumber: userRecord.PhoneNumber,
		Rank:        userRecord.Edges.Rank.Name,
		CreatedAt:   userRecord.CreatedAt,
		UpdatedAt:   userRecord.UpdatedAt,
	})
}

type UpdateUserRequest struct {
	UserID      int     `json:"user_id"`
	SvNumber    *string `json:"sv_number"`
	Name        *string `json:"name"`
	PhoneNumber *string `json:"phone_number"`
}

func UpdateUser(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "token is not valid")
		return
	}

	var req UpdateUserRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	if token.UserID != req.UserID && !token.IsAdmin {
		Forbidden(ctx, nil, "you can not modify this user")
		return
	}

	query := database.Ent().
		User.Update().
		Where(user.IDEQ(token.UserID))

	if req.Name != nil {
		query.SetName(*req.Name)
	}
	if req.PhoneNumber != nil {
		query.SetPhoneNumber(*req.PhoneNumber)
	}
	if req.SvNumber != nil {
		query.SetSvNumber(*req.SvNumber)
	}

	if err := query.Exec(ctx); err != nil {
		InternalServerError(ctx, err, "update failed")
		return
	}

	SendResponse(ctx, map[string]string{"status": "ok"})
}
