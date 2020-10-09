package api

import (
	"bytes"
	"errors"

	"github.com/valyala/fasthttp"
)

func ParseAuthorization(ctx fasthttp.RequestCtx) ([]byte, error) {
	header := ctx.Request.Header.Peek("authorization")
	headerParts := bytes.SplitN(header, []byte{' '}, 2)
	if !bytes.Equal(headerParts[0], []byte("bearer")) {
		return nil, errors.New("authorization header must be bearer token")
	}
	return headerParts[1], nil
}
