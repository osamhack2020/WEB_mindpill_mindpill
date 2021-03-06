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

	if token.UserID == req.CounselorID {
		BadRequest(ctx, nil, "you can not create room without anyone else")
		return
	}

	groupExists, err := database.Ent().
		Group.Query().
		Where(group.And(
			group.IDEQ(req.GroupID),
			group.HasUsersWith(user.Or(
				user.IDEQ(token.UserID),
				user.IDEQ(req.CounselorID),
			)),
		)).
		Exist(ctx)
	if err != nil {
		InternalServerError(ctx, err, "Database Error")
		return
	}

	if !groupExists {
		InternalServerError(ctx, nil, "permission denied")
		return
	}

	roomRecord, err := database.Ent().
		Room.Create().
		SetGroupID(req.GroupID).
		AddUserIDs(token.UserID, req.CounselorID).
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
			room.IsClosed(false),
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

type DescribeRoomRequest struct {
	RoomID int `json:"room_id"`
}

type DescribeRoomResponseUser struct {
	ID   int    `json:"id"`
	Rank string `json:"rank"`
	Name string `json:"name"`
}

type DescribeRoomResponse struct {
	GroupID     int                        `json:"group_id"`
	IsCounselor bool                       `json:"is_counselor"`
	Users       []DescribeRoomResponseUser `json:"users"`
}

func DescribeRoom(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
		return
	}

	var req DescribeRoomRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	roomRecord, err := database.Ent().
		Room.Query().
		Where(room.And(
			room.IDEQ(req.RoomID),
			room.HasUsersWith(user.IDEQ(token.UserID)),
		)).
		WithUsers(func(uq *ent.UserQuery) {
			uq.WithRank()
		}).
		WithGroup().
		Only(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
	}

	users := make([]DescribeRoomResponseUser, len(roomRecord.Edges.Users))
	for i, user := range roomRecord.Edges.Users {
		users[i] = DescribeRoomResponseUser{
			ID:   user.ID,
			Rank: user.Edges.Rank.Name,
			Name: user.Name,
		}
	}

	isCounselor, err := database.Ent().
		Counselor.Query().
		Where(counselor.And(
			counselor.HasUserWith(user.IDEQ(token.UserID)),
			counselor.HasGroupWith(group.IDEQ(roomRecord.Edges.Group.ID)),
		)).Exist(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
	}

	SendResponse(ctx, &DescribeRoomResponse{
		GroupID:     roomRecord.Edges.Group.ID,
		Users:       users,
		IsCounselor: isCounselor,
	})
}

type CloseRoomRequest struct {
	RoomID int `json:"room_id"`
}

func CloseRoom(ctx *fasthttp.RequestCtx) {
	token, err := ParseAuthorization(ctx)
	if err != nil {
		Unauthorized(ctx, err, "unauthorized")
	}

	var req CloseRoomRequest
	if err := ParseRequestBody(ctx, &req); err != nil {
		BadRequest(ctx, err, "failed to parse request body")
		return
	}

	err = database.Ent().
		Room.Update().
		Where(room.And(
			room.IDEQ(req.RoomID),
			room.HasUsersWith(user.IDEQ(token.UserID)),
		)).
		SetIsClosed(true).
		Exec(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
	}

	SendResponse(ctx, respOK)
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
	RoomID    int    `json:"room_id"`
	Timestamp string `json:"timestamp"` // Web browser does not supports int64...
}

type LoadMessageResponse struct {
	Message   []byte `json:"message"`
	Timestamp string `json:"timestamp"`
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

	reqTimestamp, err := strconv.ParseInt(req.Timestamp, 10, 64)
	if err != nil {
		BadRequest(ctx, err, "timestamp must be number expressed as a string")
	}

	logger.Debug("loadMessage", zap.Int64("timestamp", reqTimestamp))

	roomExists, err := database.Ent().
		Room.Query().
		Where(
			room.IDEQ(req.RoomID),
			room.HasUsersWith(user.IDEQ(token.UserID)),
			room.IsClosed(false),
		).
		Exist(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
	}
	if !roomExists {
		Forbidden(ctx, nil, "permission denied")
	}

	messageRecords, err := database.Ent().
		Message.Query().
		Where(
			message.HasRoomWith(room.IDEQ(req.RoomID)),
			message.CreatedAtLT(time.Unix(reqTimestamp, 0)),
		).
		Order(ent.Asc(message.FieldCreatedAt)).
		All(ctx)
	if err != nil {
		InternalServerError(ctx, err, "database error")
		return
	}

	var (
		buf       = make([]byte, 0, 2*chat.MessageSetSize+1024)
		timestamp = time.Unix(0, 0)
	)
	var n int
	for _, record := range messageRecords {
		buf = append(buf, record.Content...)
		timestamp = record.CreatedAt
		if len(record.Content)+n < chat.MessageSetSize {
			n += len(record.Content)
			continue
		}
		break
	}

	sess := sessPool.GetSession(req.RoomID, true)
	if sess != nil {
		msg := sess.Messages()
		buf = append(buf, msg...)
	}

	SendResponse(ctx, &LoadMessageResponse{
		Message:   buf,
		Timestamp: strconv.FormatInt(timestamp.Unix(), 10),
	})
}
