package chat

import (
	"encoding/binary"
	"io"
)

type ErrorMessage struct {
	code int32
}

var _ Message = (*ErrorMessage)(nil)

func (m *ErrorMessage) EncodeMessage(w io.Writer) {
	p := make([]byte, 5)
	p[0] = 0xE2
	binary.BigEndian.PutUint32(p[1:], uint32(m.code))
	w.Write(p)
}

func (m *ErrorMessage) DecodeMessage(r io.ReadSeeker, _ byte) error {
	buf := readBytes(r, 4)
	m.code = int32(binary.BigEndian.Uint32(buf))
	return nil
}
