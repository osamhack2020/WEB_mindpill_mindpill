package mindpill

import (
	"fmt"
	"net/http"

	"github.com/valyala/fasthttp"
)

func init() {
	r.GET("/health", HealthService)
}

// HealthService - 서비스가 살아있는지 여부를 확인할 수 있게 해주는 서비스입니다.
func HealthService(ctx *fasthttp.RequestCtx) {
	ctx.Response.Header.Add("Content-Type", "application/json;charset=utf-8")
	ctx.Response.SetStatusCode(http.StatusOK)
	fmt.Fprintf(ctx, `{"status", "healthy"}`)
}
