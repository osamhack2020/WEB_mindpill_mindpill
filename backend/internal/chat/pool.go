package chat

import (
	"errors"
	"sync"
)

var (
	ErrSessionExists = errors.New("session exists")
)

type SessionPool struct {
	sync.Mutex
	sessions map[int]*Session // map[room.id]*Session
	clear    chan int
}

func NewPool() *SessionPool {
	return &SessionPool{
		sessions: make(map[int]*Session),
		clear:    make(chan int),
	}
}

func (pool *SessionPool) GetSession(roomID int, doNotCreate ...bool) *Session {
	sess, ok := pool.sessions[roomID]
	if ok {
		return sess
	}
	if len(doNotCreate) > 0 && doNotCreate[0] {
		return nil
	}
	sess, err := pool.createSession(roomID)
	if err != nil {
		panic(err)
	}
	return sess
}

func (pool *SessionPool) createSession(roomID int) (*Session, error) {
	sess := newSession(roomID)
	if err := pool.addSession(roomID, sess); err != nil {
		return nil, err
	}
	go func() {
		sess.do()
		pool.deleteSession(roomID)
	}()
	return sess, nil
}

func (pool *SessionPool) addSession(roomID int, sess *Session) error {
	if _, ok := pool.sessions[roomID]; ok {
		return ErrSessionExists
	}
	pool.Lock()
	defer pool.Unlock()
	pool.sessions[roomID] = sess
	return nil
}

func (pool *SessionPool) deleteSession(roomID int) {
	if _, ok := pool.sessions[roomID]; !ok {
		return
	}
	pool.Lock()
	defer pool.Unlock()
	delete(pool.sessions, roomID)
	return
}
