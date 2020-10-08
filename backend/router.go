package backend

import (
	"mindpill/backend/handlers"
	"mindpill/backend/handlers/api"

	"github.com/fasthttp/router"
	"github.com/valyala/fasthttp"
)

var r = func() *router.Router {
	r := router.New()

	// General APIs
	r.GET("/api/health", handlers.HealthHandler)

	// Authorization APIs
	r.GET("/api/create_token", api.CreateToken)

	// User APIs
	r.GET("/api/create_user", api.CreateUser)

	// Frontend
	r.NotFound = handlers.FrontendHandler

	return r
}()

func Handler() fasthttp.RequestHandler {
	return r.Handler
}
