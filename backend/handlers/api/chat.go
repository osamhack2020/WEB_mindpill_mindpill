package api

import (
	"mindpill/backend/internal/chat"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/tokens"
	"mindpill/ent"
	"mindpill/ent/counselor"
	"mindpill/ent/group"
	"mindpill/ent/message"
	"mindpill/ent/room"
	"mindpill/ent/user"
	"strconv"
	"time"

	"github.com/fasthttp/websocket"
	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

var (
	sessPool   = chat.NewPool()
	wsUpgrader = websocket.FastHTTPUpgrader{
		HandshakeTimeout: 10 * time.Second,
		ReadBufferSize:   1024,
		WriteBufferSize:  1024,
	}
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
		WithUser().
		Only(ctx)
	if err != nil {
		BadRequest(ctx, err, "requested counselor is not exists")
		return
	}

	userIDs := make([]int, 1)
	userIDs[0] = counselorRecord.Edges.User.ID
	if token.UserID != counselorRecord.Edges.User.ID {
		userIDs = append(userIDs, token.UserID)
	}

	roomRecord, err := database.Ent().
		Room.Create().
		SetGroupID(req.GroupID).
		AddUserIDs(userIDs...).
		Save(ctx)
	if err != nil {
		InternalServerError(ctx, err, "failed to create room")
		return
	}

	SendResponse(ctx, &CreateRoomResponse{
		RoomID: roomRecord.ID,
	})
}

type ListMyRoomRequest struct {
	GroupID int `json:"group_id"`
}

type ListMyRoomResponseUser struct {
	Rank string `json:"rank"`
	Name string `json:"name"`
}

type ListMyRoomResponseRoom struct {
	ID    int                      `json:"id"`
	Users []ListMyRoomResponseUser `json:"users"`
}

type ListMyRoomResponse struct {
	Rooms []ListMyRoomResponseRoom `json:"rooms"`
}

func ListMyRoom(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	var req ListMyRoomRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	roomRecords, err := database.Ent().
		Room.Query().
		Where(room.And(
			room.HasGroupWith(group.IDEQ(req.GroupID)),
			room.HasUsersWith(user.IDEQ(token.UserID)),
		)).
		WithUsers(func(uq *ent.UserQuery) {
			uq.
				// Where(user.IDNEQ(token.UserID)).
				WithRank()
		}).
		All(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
	}

	rooms := make([]ListMyRoomResponseRoom, len(roomRecords))
	for i, roomRecord := range roomRecords {
		users := make([]ListMyRoomResponseUser, len(roomRecord.Edges.Users))
		for j, userRecord := range roomRecord.Edges.Users {
			users[j] = ListMyRoomResponseUser{
				Name: userRecord.Name,
				Rank: userRecord.Edges.Rank.Name,
			}
		}
		rooms[i] = ListMyRoomResponseRoom{
			ID:    roomRecord.ID,
			Users: users,
		}
	}

	SendResponse(ctx, &ListMyRoomResponse{
		Rooms: rooms,
	})
}

func ConnectRoom(ctx *fasthttp.RequestCtx) {
	var queries = ctx.QueryArgs()
	roomID, err := strconv.ParseInt(string(queries.Peek("room_id")), 10, 64)
	if err != nil {
		BadRequest(ctx, err, "user_id must be int")
		return
	}

	room, err := database.Ent().
		Room.Query().
		Where(
			room.IDEQ(int(roomID)),
		).
		Only(ctx)
	if err != nil {
		BadRequest(ctx, err, "there is no room")
		return
	}

	err = wsUpgrader.Upgrade(ctx, func(conn *websocket.Conn) {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logger.Warn("websocket: validation failed: session closed", zap.Error(err))
			} else {
				logger.Warn("websocket: validation failed", zap.Error(err))
			}
			return
		}

		token, err := tokens.Validate(msg)
		if err != nil {
			w, err := conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}
			chat.WriteMessage(w, chat.ErrMsgInvalidToken)
			w.Close()
			conn.Close()
			return
		}

		logger.Debug("websocket: client validated", zap.Int("user_id", token.UserID))

		sess := sessPool.GetSession(int(room.ID))
		client := chat.NewClient(sess, token.UserID, conn)
		sess.Register(client)
	})
	if err != nil {
		if err, ok := err.(websocket.HandshakeError); ok {
			logger.Warn("websocket: handshake failed", zap.Error(err))
			BadRequest(ctx, err, "websocket: handshake failed")
		} else {
			logger.Warn("websocket: upgrade failed", zap.Error(err))
			InternalServerError(ctx, err, "ws: upgrade failed")
		}
		return
	}
}

type LoadMessageRequest struct {
	RoomID    int   `json:"room_id"`
	Timestamp int64 `json:"timestamp"`
}

type LoadMessageResponse struct {
	Message   []byte    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

func LoadMessage(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	var req LoadMessageRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	isRoomUser, err := database.Ent().
		Room.Query().
		Where(
			room.IDEQ(req.RoomID),
			room.HasUsersWith(user.IDEQ(token.UserID)),
		).
		Exist(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
		return
	}
	if !isRoomUser {
		Forbidden(ctx, nil, "permission denied")
		return
	}

	timestamp := time.Unix(req.Timestamp, 0)

	messageRecord, err := database.Ent().
		Message.Query().
		Where(
			message.HasRoomWith(room.IDEQ(req.RoomID)),
			message.CreatedAtLTE(timestamp),
		).
		Order(ent.Desc(message.FieldCreatedAt)).
		First(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
		return
	}

	SendResponse(ctx, &LoadMessageResponse{
		Message:   messageRecord.Content,
		CreatedAt: messageRecord.CreatedAt,
	})
}
