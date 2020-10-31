package chat

import (
	"bytes"
	"context"
	"mindpill/backend/internal/database"
	"sync"
	"time"

	"go.uber.org/zap"
)

const MessageSetSize = 10240

type clientMessage struct {
	userID    int
	timestamp time.Time
	data      []byte
}

type Session struct {
	sync.Mutex

	clients  map[*Client]struct{}
	messages []byte

	lastUserID    int
	lastTimestamp time.Time

	input      chan clientMessage
	register   chan *Client
	unregister chan *Client

	roomID int
}

func newSession(roomID int) *Session {
	return &Session{
		clients:  make(map[*Client]struct{}),
		messages: make([]byte, 0, 10240),

		input:      make(chan clientMessage, sessionSize),
		register:   make(chan *Client, sessionSize),
		unregister: make(chan *Client, sessionSize),

		roomID: roomID,
	}
}

func (s *Session) Register(c *Client) {
	s.register <- c
	defer func() {
		c.sess.unregister <- c
	}()
	go c.writePump()
	c.readPump()
}

func (s *Session) Messages() []byte {
	return s.messages
}

func (s *Session) SendMessage(c *Client, msg []byte) {
	s.input <- clientMessage{c.userID, time.Now(), msg}
}

func (s *Session) do() {
	s.Lock()
	defer s.Unlock()

LOOP:
	for {
		select {
		case c := <-s.register:
			s.clients[c] = struct{}{}

		case c := <-s.unregister:
			if _, ok := s.clients[c]; ok {
				close(c.send)
				delete(s.clients, c)
			}
			if len(s.clients) == 0 {
				break LOOP
			}

		case msg := <-s.input:
			buf := bytes.NewBuffer(make([]byte, 0, len(msg.data)+18))

			if s.lastUserID != msg.userID {
				s.lastUserID = msg.userID
				WriteMessage(buf, &UserMessage{uint64(msg.userID)})
			}

			if s.lastTimestamp.Unix()/60 != msg.timestamp.Unix()/60 {
				s.lastTimestamp = msg.timestamp
				WriteMessage(buf, &TimestampMessage{msg.timestamp})
			}

			buf.Write(msg.data)
			s.messages = append(s.messages, buf.Bytes()...)

			for client := range s.clients {
				select {
				case client.send <- buf.Bytes():
				default:
					close(client.send)
					delete(s.clients, client)
				}
			}
		}

		if len(s.messages) > MessageSetSize {
			s.saveMessage()
		}
	}

	for client := range s.clients {
		close(client.send)
	}

	s.saveMessage()
	logger.Debug("Session closed", zap.Int("roomID", s.roomID))
}

func (s *Session) saveMessage() {
	if len(s.messages) == 0 {
		return
	}
	now := time.Now()
	logger.Debug("Saving messages...", zap.Int("roomID", s.roomID), zap.Time("time", now))
	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()
	_, err := database.Ent().
		Message.Create().
		SetRoomID(s.roomID).
		SetContent(s.messages).
		SetCreatedAt(now).
		Save(ctx)
	if err != nil {
		logger.Error("chat/session: Failed to save messages", zap.Error(err))
	} else {
		s.messages = s.messages[:0]
	}
}
