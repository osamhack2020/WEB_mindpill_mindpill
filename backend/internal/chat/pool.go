package chat

type SessionPool struct {
	sessions map[int]*Session // map[room.id]*Session
	clear    chan int
}

func NewPool() *SessionPool {
	return &SessionPool{
		sessions: make(map[int]*Session),
		clear:    make(chan int),
	}
}

func (pool *SessionPool) GetSession(roomID int) *Session {
	sess, ok := pool.sessions[roomID]
	if !ok {
		sess = pool.createSession(roomID)
		pool.sessions[roomID] = sess
	}
	return sess
}

func (pool *SessionPool) createSession(roomID int) *Session {
	sess := newSession()
	go func() {
		sess.do()
		pool.clear <- roomID
	}()
	return sess
}
