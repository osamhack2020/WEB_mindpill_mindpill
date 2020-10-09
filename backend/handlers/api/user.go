package api

import (
	"bytes"
	"encoding/json"
	"mindpill/backend/internal/database"
	"mindpill/ent/user"

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
