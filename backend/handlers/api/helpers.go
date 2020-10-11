package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"mindpill/backend/internal/tokens"

	"mindpill/backend/internal/log"

	"github.com/valyala/fasthttp"
)

var logger = log.Logger()

// Permission

// Token

func ParseAuthorization(ctx *fasthttp.RequestCtx) (*tokens.Token, error) {
	header := ctx.Request.Header.Peek("authorization")
	headerParts := bytes.SplitN(header, []byte{' '}, 2)
	if !bytes.Equal(bytes.ToUpper(headerParts[0]), []byte("BEARER")) {
		return nil, errors.New("authorization header must be bearer token")
	}
	return tokens.Validate(headerParts[1])
}

// Request

func ParseRequestBody(ctx *fasthttp.RequestCtx, dst interface{}) error {
	body := ctx.PostBody()
	err := json.Unmarshal(body, dst)
	if err != nil {
		return err
	}
	return nil
}

// Response

func SendResponse(ctx *fasthttp.RequestCtx, data interface{}) {
	buf, err := json.Marshal(data)
	if err != nil {
		InternalServerError(ctx, err, "failed to marshaling data")
		return
	}
	ctx.Write(buf)
}

func BadRequest(ctx *fasthttp.RequestCtx, err error, msg string) {
	resp := &ErrorResp{fasthttp.StatusBadRequest, err, msg}
	resp.Write(ctx)
}

func Unauthorized(ctx *fasthttp.RequestCtx, err error, msg string) {
	resp := &ErrorResp{fasthttp.StatusUnauthorized, err, msg}
	resp.Write(ctx)
}

func Forbidden(ctx *fasthttp.RequestCtx, err error, msg string) {
	resp := &ErrorResp{fasthttp.StatusForbidden, err, msg}
	resp.Write(ctx)
}

func NotFound(ctx *fasthttp.RequestCtx, err error, msg string) {
	resp := &ErrorResp{fasthttp.StatusNotFound, err, msg}
	resp.Write(ctx)
}

func MethodNotAllowed(ctx *fasthttp.RequestCtx, err error, msg string) {
	resp := &ErrorResp{fasthttp.StatusMethodNotAllowed, err, msg}
	resp.Write(ctx)
}

func InternalServerError(ctx *fasthttp.RequestCtx, err error, msg string) {
	resp := &ErrorResp{fasthttp.StatusInternalServerError, err, msg}
	resp.Write(ctx)
}
