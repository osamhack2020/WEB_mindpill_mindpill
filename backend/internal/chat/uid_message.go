package chat

import (
	"encoding/binary"
	"io"
)

type UserMessage struct {
	id uint64
}

var _ Message = (*UserMessage)(nil)

func (m *UserMessage) EncodeMessage(w io.Writer) {
	p := make([]byte, 9)
	p[0] = 0xE0
	binary.BigEndian.PutUint64(p[1:], m.id)
	w.Write(p)
}

func (m *UserMessage) DecodeMessage(r io.ReadSeeker, _ byte) error {
	buf := readBytes(r, 8)
	m.id = binary.BigEndian.Uint64(buf)
	return nil
}
