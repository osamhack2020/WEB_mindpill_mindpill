package api

import (
	"mindpill/backend/internal/database"
	"mindpill/ent/counselor"

	"github.com/valyala/fasthttp"
)

type CreateRoomRequest struct {
	GroupID     int `json:"group_id"`
	CounselorID int `json:"counselor_id"`
}

type CreateRoomResponse struct {
	RoomID int `json:"room_id"`
}

func CreateRoom(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	var req CreateRoomRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	counselorRecord, err := database.Ent().
		Counselor.Query().
		Where(
			counselor.IDEQ(req.CounselorID),
		).
		Only(ctx)
	if err != nil {
		BadRequest(ctx, err, "requested counselor is not exists")
		return
	}

	roomRecord, err := database.Ent().
		Room.Create().
		SetGroupID(req.GroupID).
		AddUserIDs(
			counselorRecord.Edges.Group.ID,
			token.UserID,
		).
		Save(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to create room")
		return
	}

	SendResponse(ctx, &CreateRoomResponse{
		RoomID: roomRecord.ID,
	})
}
