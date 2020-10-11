package api

import (
	"fmt"
	"net/http"

	"github.com/valyala/fasthttp"
)

func CheckHealth(ctx *fasthttp.RequestCtx) {
	ctx.Response.Header.Add("Content-Type", "application/json;charset=utf-8")
	ctx.Response.SetStatusCode(http.StatusOK)
	fmt.Fprintf(ctx, `{"status", "healthy"}`)
}
