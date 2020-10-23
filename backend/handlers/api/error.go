package api

import (
	"errors"
	"mindpill/backend/internal/debug"
	"strconv"
	"strings"

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
	var buf strings.Builder
	if e.err != nil && debug.IsDebug() {
		buf.WriteString(`{"error":`)
		buf.WriteString(strconv.Quote(e.err.Error()))
		buf.WriteString(`,`)
	} else {
		buf.WriteString(`{`)
	}
	buf.WriteString(`"message":`)
	buf.WriteString(strconv.Quote(e.msg))
	buf.WriteString(`}`)

	ctx.SetStatusCode(e.status)
	ctx.WriteString(buf.String())
}
