package api

import (
	"errors"
	"mindpill/backend/internal/debug"
	"strconv"

	"github.com/valyala/fasthttp"
)

type ErrorResp struct {
	status int
	err    error
	msg    string
}

func Error(status int, err error) *ErrorResp {
	return &ErrorResp{status, err, ""}
}

func ErrorString(status int, err string) *ErrorResp {
	return &ErrorResp{status, errors.New(err), ""}
}

func (e *ErrorResp) Error() string {
	return e.err.Error()
}

func (e *ErrorResp) Unwrap() error {
	return e.err
}

func (e *ErrorResp) Write(ctx *fasthttp.RequestCtx) {
	ctx.SetStatusCode(e.status)
	if e.err != nil && debug.IsDebug() {
		ctx.WriteString(`{"error":`)
		ctx.WriteString(strconv.Quote(e.err.Error()))
		ctx.WriteString(`,`)
	} else {
		ctx.WriteString(`{`)
	}
	ctx.WriteString(`"message":`)
	ctx.WriteString(strconv.Quote(e.msg))
	ctx.WriteString(`}`)
	ctx.Write([]byte{'\n'})
}
