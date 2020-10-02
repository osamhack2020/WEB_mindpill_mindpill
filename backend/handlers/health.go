package handlers

import (
	"fmt"
	"net/http"

	"github.com/valyala/fasthttp"
)

// HealthHandler - 서비스가 살아있는지 여부를 확인할 수 있게 해주는 핸들러입니다.
func HealthHandler(ctx *fasthttp.RequestCtx) {
	ctx.Response.Header.Add("Content-Type", "application/json;charset=utf-8")
	ctx.Response.SetStatusCode(http.StatusOK)
	fmt.Fprintf(ctx, `{"status", "healthy"}`)
}
