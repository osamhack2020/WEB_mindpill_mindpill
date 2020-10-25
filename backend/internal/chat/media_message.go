package chat

import (
	"encoding/binary"
	"io"
)

type MediaType byte

const (
	Image MediaType = 0x90
	Audio MediaType = 0x91
	Video MediaType = 0x92
)

type MediaMessage struct {
	kind byte
	id   uint64
}

var _ Message = (*MediaMessage)(nil)

func (m *MediaMessage) EncodeMessage(w io.Writer) {
	p := make([]byte, 9)
	p[0] = m.kind
	binary.BigEndian.PutUint64(p[1:], m.id)
	w.Write(p)
}

func (m *MediaMessage) DecodeMessage(r io.ReadSeeker, header byte) error {
	buf := readBytes(r, 8)
	m.kind = header
	m.id = binary.BigEndian.Uint64(buf)
	return nil
}
