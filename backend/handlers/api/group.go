package api

import (
	"mindpill/backend/internal/database"
	"mindpill/ent/group"
	"strconv"
	"time"

	"github.com/valyala/fasthttp"
)

type CreateGroupRequest struct {
	Name string `json:"name"`
}

type CreateGroupResponse struct {
	GroupID int `json:"group_id"`
}

func CreateGroup(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	if !token.IsAdmin {
		Unauthorized(ctx, err, "admin permission is required")
		return
	}

	var req CreateGroupRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	group, err := database.Ent().
		Group.Create().
		SetName(req.Name).
		Save(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to write record on database")
	}

	SendResponse(ctx, &CreateGroupResponse{
		GroupID: group.ID,
	})
}

type DescribeGroupResponse struct {
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func DescribeGroup(ctx *fasthttp.RequestCtx) {
	var queries = ctx.QueryArgs()
	groupID, err := strconv.ParseInt(string(queries.Peek("group_id")), 10, 64)
	if err != nil {
		BadRequest(ctx, err, "invalid group id")
		return
	}

	groupRecord, err := database.Ent().
		Group.Query().
		Where(group.IDEQ(int(groupID))).
		Only(ctx)
	if err != nil {
		NotFound(ctx, err, "group not found")
		return
	}

	SendResponse(ctx, &DescribeGroupResponse{
		Name:      groupRecord.Name,
		CreatedAt: groupRecord.CreatedAt,
		UpdatedAt: groupRecord.UpdatedAt,
	})
}
