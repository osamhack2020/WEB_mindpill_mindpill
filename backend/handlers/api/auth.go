package api

import (
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/tokens"
	"mindpill/ent"
	"mindpill/ent/user"
	"time"

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
	var req AuthTokenRequest
	err := ParseRequestBody(ctx, &req)
	if err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	var (
		accessToken, refreshToken *tokens.Token
	)

	switch string(ctx.QueryArgs().Peek("request_type")) {
	case "password":
		user, err := database.Ent().
			User.
			Query().
			Where(user.EmailEQ(req.Email)).
			Only(ctx)
		if err == nil {
			err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(req.Password))
		}
		if _, ok := err.(*ent.NotFoundError); ok ||
			err == bcrypt.ErrMismatchedHashAndPassword {
			BadRequest(ctx, err, "wrong email or password")
			return
		} else if err != nil {
			InternalServerError(ctx, err, "login failed")
			return
		}

		accessToken, refreshToken, err = tokenGenerator.Claim(ctx, user)
		if err != nil {
			InternalServerError(ctx, err, "failed to claim token")
			return
		}

	case "refresh":
		token, err := tokens.Validate([]byte(req.RefreshToken))
		if err != nil {
			Unauthorized(ctx, err, "token is not valid")
			return
		}

		accessToken, refreshToken, err = tokenGenerator.ClaimFromRefresh(ctx, token)
		if err != nil {
			InternalServerError(ctx, err, "failed to claim token")
			return
		}

	default:
		InternalServerError(ctx, nil, "unsupported request type")
		return
	}

	accessTokenBuf, err := accessToken.Sign()
	if err != nil {
		InternalServerError(ctx, err, "failed to sign access token")
		return
	}
	refreshTokenBuf, err := refreshToken.Sign()
	if err != nil {
		InternalServerError(ctx, err, "failed to sign refresh token")
		return
	}

	SendResponse(ctx, &AuthTokenResponse{
		AccessToken:  string(accessTokenBuf),
		RefreshToken: string(refreshTokenBuf),
	})
}

type DescribeTokenResult struct {
	ID        uint64              `json:"tid"`
	UserID    int                 `json:"uid"`
	Groups    []tokens.TokenGroup `json:"groups"`
	IsAdmin   bool                `json:"admin"`
	CreatedAt time.Time           `json:"cat"`

	Email string `json:"email"`
	Name  string `json:"name"`
}

func DescribeToken(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	user, err := database.Ent().
		User.Query().
		Where(user.IDEQ(token.UserID)).
		Only(ctx)
	if err != nil {
		InternalServerError(ctx, err, "user not found")
		return
	}

	groups := make([]tokens.TokenGroup, 0, len(token.Groups))
	for _, group := range token.Groups {
		groups = append(groups, group)
	}

	SendResponse(ctx, &DescribeTokenResult{
		ID:        token.ID,
		UserID:    token.UserID,
		Groups:    groups,
		IsAdmin:   token.IsAdmin,
		CreatedAt: token.CreatedAt,

		Email: user.Email,
		Name:  user.Name,
	})
}
