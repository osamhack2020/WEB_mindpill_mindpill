package backend

import (
	"mindpill/backend/handlers"
	"mindpill/backend/handlers/api"

	"github.com/fasthttp/router"
)

func CreateRouter() *router.Router {
	r := router.New()

	// General APIs
	r.GET("/api/health", api.CheckHealth)

	// Authorization APIs
	r.POST("/api/create_token", api.CreateToken)
	r.GET("/api/describe_token", api.DescribeToken)

	// User APIs
	r.POST("/api/create_user", api.CreateUser)
	r.GET("/api/describe_user", api.DescribeUser)
	r.GET("/api/update_user", api.UpdateUser)

	r.POST("/api/list_rank", api.ListRank)

	// Group APIs
	r.POST("/api/create_group", api.CreateGroup)
	r.GET("/api/list_my_group", api.ListMyGroup)
	r.GET("/api/describe_group", api.DescribeGroup)
	r.GET("/api/search_group", api.SearchGroup)

	r.POST("/api/create_manager", api.CreateManager)
	r.POST("/api/delete_manager", api.DeleteManager)

	r.POST("/api/create_counselor", api.CreateCounselor)
	r.POST("/api/delete_counselor", api.DeleteCounselor)

	// Chat APIs
	r.POST("/api/create_room", api.CreateRoom)
	r.POST("/api/list_my_room", api.ListMyRoom)
	r.POST("/api/describe_room", api.DescribeRoom)
	r.POST("/api/close_room", api.CloseRoom)
	r.GET("/api/connect_room", api.ConnectRoom)

	// Note APIs
	r.POST("/api/create_note", api.CreateNote)
	r.POST("/api/list_notes_from_counselor", api.ListNotesFromCounselor)

	// Frontend
	r.NotFound = handlers.FrontendHandler()

	return r
}
