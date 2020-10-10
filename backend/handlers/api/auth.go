package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/tokens"
	"mindpill/ent"
	"mindpill/ent/user"

	"github.com/valyala/fasthttp"
	"golang.org/x/crypto/bcrypt"
)

var tokenGenerator = tokens.NewGenerator()

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
	var queries = ctx.QueryArgs()
	var requestType = queries.Peek("request_type")

	var req AuthTokenRequest
	err := ParseRequestBody(ctx, &req)
	if err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	switch string(requestType) {
	case "password":
		user, err := database.Ent().
			User.
			Query().
			Where(user.EmailEQ(req.Email)).
			Only(ctx)
		if err == nil {
			err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(req.Password))
		}
		switch {
		case err == nil:
		// Do nothing
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword),
			errors.As(err, &ent.NotFoundError{}):
			BadRequest(ctx, err, "email or password is wrong")
			return

		default:
			InternalServerError(ctx, err, "login failed")
			return
		}

		access, refresh, err := tokenGenerator.Claim(ctx, user)
		if err != nil {
			InternalServerError(ctx, err, "failed to claim token")
			return
		}
		accessToken, err := access.Sign()
		if err != nil {
			InternalServerError(ctx, err, "failed to sign access token")
			return
		}
		refreshToken, err := refresh.Sign()
		if err != nil {
			InternalServerError(ctx, err, "failed to sign refresh token")
			return
		}

		SendResponse(ctx, &AuthTokenResponse{
			AccessToken:  string(accessToken),
			RefreshToken: string(refreshToken),
		})

	case "refresh":
		InternalServerError(ctx, nil, "refresh method is not implemented yet")

	default:
		InternalServerError(ctx, nil, "unsupported request type")
	}
}

func DescribeToken(ctx *fasthttp.RequestCtx) {
	tokenParts := bytes.SplitN(
		ctx.Request.Header.Peek("Authorization"),
		[]byte{' '},
		2,
	)
	if len(tokenParts) != 2 || !bytes.Equal(tokenParts[0], []byte("Bearer")) {
		ErrorString(400, "invalid authorization header format").Write(ctx)
		return
	}
	token, err := tokens.Validate(tokenParts[1])
	if err != nil {
		Error(400, err).Write(ctx)
		return
	}
	var buf = bytes.NewBuffer(make([]byte, 0))
	err = json.NewEncoder(buf).Encode(token)
	if err != nil {
		Error(500, err).Write(ctx)
		return
	}
	ctx.Write(buf.Bytes())
}
