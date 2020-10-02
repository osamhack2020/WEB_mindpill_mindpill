package mindpill

import (
	"mindpill/backend/handlers"

	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

var r = func() *router.Router {
	r := router.New()

	r.GET("/health", handlers.HealthHandler)

	return r
}()

func Handler() fasthttp.RequestHandler {
	return r.Handler
}
