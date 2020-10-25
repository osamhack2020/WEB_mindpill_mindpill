package chat

import (
	"bytes"
	"sync"
	"time"
)

type clientMessage struct {
	userID    int
	timestamp time.Time
	data      []byte
}

type Session struct {
	sync.Mutex

	clients map[*Client]struct{}

	lastUserID    int
	lastTimestamp time.Time

	input      chan clientMessage
	register   chan *Client
	unregister chan *Client
}

func newSession() *Session {
	return &Session{
		clients: make(map[*Client]struct{}),

		input:      make(chan clientMessage, sessionSize),
		register:   make(chan *Client, sessionSize),
		unregister: make(chan *Client, sessionSize),
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

func (s *Session) SendMessage(c *Client, msg []byte) {
	s.input <- clientMessage{c.userID, time.Now(), msg}
}

func (s *Session) do() {
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

			for client := range s.clients {
				select {
				case client.send <- buf.Bytes():
				default:
					close(client.send)
					delete(s.clients, client)
				}
			}
		}
	}

	for client := range s.clients {
		close(client.send)
	}
}
