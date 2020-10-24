package chat

import (
	"time"

	"github.com/fasthttp/websocket"
	"go.uber.org/zap"
)

const (
	sessionSize = 512
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
		c.conn.Close()
	}()
	for {
		_, msg, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logger.Warn("session closed", zap.Error(err))
			}
			break
		}
		logger.Debug("websocket: message received", zap.Binary("data", msg))
		c.sess.input <- clientMessage{
			data:      msg,
			userID:    c.userID,
			timestamp: time.Now(),
		}
	}
}

func (c *Client) writePump() {
	for {
		select {
		case msg, ok := <-c.send:
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
		}
	}
}
