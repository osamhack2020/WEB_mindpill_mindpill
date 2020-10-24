package api

import (
	"mindpill/backend/internal/database"
	"mindpill/ent/counselor"
	"mindpill/ent/group"
	"mindpill/ent/room"
	"mindpill/ent/user"

	"github.com/valyala/fasthttp"
)

type CreateNoteRequest struct {
	GroupID int `json:"group_id"`
	RoomID  int `json:"room_id"`
}

func CreateNote(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	var req CreateNoteRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	counselorRecord, err := database.Ent().
		Counselor.Query().
		Where(
			counselor.HasUserWith(user.IDEQ(token.UserID)),
			counselor.HasGroupWith(group.IDEQ(req.GroupID)),
		).
		Only(ctx)
	if err != nil {
		Forbidden(ctx, err, "you must be counseler of this group")
		return
	}

	roomRecord, err := database.Ent().
		Room.Query().
		Where(
			room.IDEQ(req.RoomID),
			room.HasGroupWith(group.IDEQ(req.GroupID)),
		).
		Only(ctx)
	if err != nil {
		BadRequest(ctx, err, "requested room is not exists")
		return
	}

	database.Ent().
		Note.Create().
		SetRoom(roomRecord).
		SetCounselor(counselorRecord).
		Save(ctx)
}
