package chat

import (
	"encoding/binary"
	"io"
	"time"
)

type TimestampMessage struct {
	t time.Time
}

var _ Message = (*TimestampMessage)(nil)

func (m *TimestampMessage) EncodeMessage(w io.Writer) {
	p := make([]byte, 9)
	p[0] = 0xE1
	binary.BigEndian.PutUint64(p[1:], uint64(m.t.Unix()))
	w.Write(p)
}

func (m *TimestampMessage) DecodeMessage(r io.ReadSeeker, _ byte) error {
	buf := readBytes(r, 8)
	unixTime := int64(binary.BigEndian.Uint64(buf))
	m.t = time.Unix(unixTime, 0)
	return nil
}
