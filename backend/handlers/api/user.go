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
		SetGroupID(req.GroupID).
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
	Name string `json:"name"`
}

type FullDescribeUserResponse struct {
	SvNumber    string      `json:"sv_number,omitempty"`
	Email       string      `json:"email,omitempty"`
	Name        string      `json:"name,omitempty"`
	Gender      user.Gender `json:"gender,omitempty"`
	PhoneNumber *string     `json:"phone_number,omitempty"`
	CreatedAt   time.Time   `json:"created_at,omitempty"`
	UpdatedAt   time.Time   `json:"updated_at,omitempty"`
}

func DescribeUser(ctx *fasthttp.RequestCtx) {
	var queries = ctx.QueryArgs()
	userID, err := strconv.ParseInt(string(queries.Peek("user_id")), 10, 64)
	if err != nil {
		BadRequest(ctx, err, "user_id must be int")
		return
	}

	u, err := database.Ent().
		User.Query().
		Where(user.IDEQ(int(userID))).
		Only(ctx)
	if err != nil {
		NotFound(ctx, err, "user not found")
		return
	}

	var resp interface{}

	// Check user permission
	token, _ := ParseAuthorization(ctx)
	if token == nil || (u.ID != token.UserID && !IsAdmin(ctx, token.UserID)) {
		resp = &DescribeUserResponse{
			Name: u.Name,
		}
	} else {
		resp = &FullDescribeUserResponse{
			SvNumber:    u.SvNumber,
			Email:       u.Email,
			Name:        u.Name,
			Gender:      u.Gender,
			PhoneNumber: u.PhoneNumber,
			CreatedAt:   u.CreatedAt,
			UpdatedAt:   u.UpdatedAt,
		}
	}

	// Remove the hashed password for security reason.
	SendResponse(ctx, resp)
}

type UpdateUserRequest struct {
	SvNumber    *string `json:"sv_number,omitempty"`
	Name        *string `json:"name,omitempty"`
	PhoneNumber *string `json:"phone_number,omitempty"`
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
		InternalServerError(ctx, err, "update filed")
		return
	}

	SendResponse(ctx, map[string]string{"status": "ok"})
}
