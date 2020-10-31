package chat

import (
	"runtime/debug"
	"time"

	"github.com/fasthttp/websocket"
	"go.uber.org/zap"
)

const (
	sessionSize = 512

	writeWait  = 10 * time.Second
	pongWait   = time.Minute
	pingPeriod = pongWait - writeWait
)

type Client struct {
	conn *websocket.Conn
	sess *Session
	send chan []byte

	userID int
}

func NewClient(s *Session, userID int, conn *websocket.Conn) *Client {
	return &Client{
		conn: conn,
		sess: s,
		send: make(chan []byte, sessionSize),

		userID: userID,
	}
}

func (c *Client) readPump() {
	defer func() {
		logger.Debug(
			"websocket: connection closed",
			zap.Int("roomID", c.sess.roomID),
			zap.Int("userID", c.userID),
		)
		c.conn.Close()
	}()
	c.conn.SetReadLimit(512)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(_ string) error {
		logger.Debug(
			"websocket: pong from client",
			zap.Int("room", c.sess.roomID),
			zap.Int("user", c.userID),
		)
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})
	for {
		_, msg, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(
				err,
				websocket.CloseGoingAway,
				websocket.CloseAbnormalClosure,
			) {
				logger.Warn("session closed", zap.Error(err))
			}
			break
		}
		logger.Debug(
			"websocket: message received",
			zap.Binary("data", msg),
		)
		c.sess.input <- clientMessage{
			data:      msg,
			userID:    c.userID,
			timestamp: time.Now(),
		}
	}
}

func (c *Client) writePump() {
	debug.SetPanicOnFault(true)
	defer func() {
		cause := recover()
		if cause != nil {
			logger.Error(
				"websocket: writePump panic",
				zap.Any("cause", cause),
			)
		}
	}()
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case msg, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, nil)
				return
			}

			w, err := c.conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}
			w.Write(msg)

			err = w.Close()
			if err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			err := c.conn.WriteMessage(websocket.PingMessage, nil)
			if err != nil {
				return
			}
		}
	}
}
