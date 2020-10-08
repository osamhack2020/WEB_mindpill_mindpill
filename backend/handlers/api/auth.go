package api

import (
	"bytes"
	"encoding/json"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/tokens"
	"mindpill/ent"
	"mindpill/ent/user"

	"github.com/valyala/fasthttp"
	"golang.org/x/crypto/bcrypt"
)

type AuthTokenRequest struct {
	Email        string `json:"email,omitempty"`
	Password     string `json:"password,omitempty"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

type AuthTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func CreateToken(ctx *fasthttp.RequestCtx) {
	var (
		queries = ctx.QueryArgs()
		req     AuthTokenRequest
	)

	body := ctx.PostBody()
	err := json.Unmarshal(body, &req)
	if err != nil {
		Error(400, err).Write(ctx)
		return
	}

	var requestType = queries.Peek("request_type")
	switch string(requestType) {
	case "password":
		user, err := database.Ent().
			User.
			Query().
			Where(user.EmailEQ(req.Email)).
			Only(ctx)

		switch err.(type) {
		case nil:
			// Do nothing
		case *ent.NotFoundError:
			ErrorString(404, "email or password is wrong").Write(ctx)
			return
		default:
			Error(500, err).Write(ctx)
			return
		}
		if err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(req.Password)); err != nil {
			ErrorString(401, "email or password is wrong").Write(ctx)
			return
		}
		access, refresh, err := tokens.Claim(ctx, user.ID)
		if err != nil {
			Error(500, err).Write(ctx)
			return
		}
		accessToken, err := access.Sign()
		if err != nil {
			Error(500, err).Write(ctx)
			return
		}
		refreshToken, err := refresh.Sign()
		if err != nil {
			Error(500, err).Write(ctx)
			return
		}
		var buf = bytes.NewBuffer(make([]byte, 0))
		err = json.NewEncoder(buf).Encode(&AuthTokenResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		})
		if err != nil {
			Error(500, err).Write(ctx)
			return
		}
		ctx.Write(buf.Bytes())

	case "refresh":

	default:
		ErrorString(400, "unsupported request type").Write(ctx)
	}
}
