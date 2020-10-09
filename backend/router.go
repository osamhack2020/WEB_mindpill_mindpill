package backend

import (
	"mindpill/backend/handlers"
	"mindpill/backend/handlers/api"

	"github.com/fasthttp/router"
)

var r = func() *router.Router {
	r := router.New()

	// General APIs
	r.GET("/api/health", handlers.HealthHandler)

	// Authorization APIs
	r.POST("/api/create_token", api.CreateToken)
	r.GET("/api/describe_token", api.DescribeToken)

	// User APIs
	r.POST("/api/create_user", api.CreateUser)
	r.GET("/api/describe_user", api.DescribeUser)

	// Frontend
	r.NotFound = handlers.FrontendHandler

	return r
}()
