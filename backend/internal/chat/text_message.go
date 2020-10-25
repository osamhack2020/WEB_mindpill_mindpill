package chat

import (
	"encoding/binary"
	"io"
	"math"
)

type TextMessage string

var _ Message = (*TextMessage)(nil)

func (m *TextMessage) EncodeMessage(w io.Writer) {
	l := len(*m)
	switch {
	case l <= 0x7F: //fixstr
		w.Write([]byte{byte(l)})
	case l <= math.MaxUint8: // str8
		w.Write([]byte{
			0x80,
			byte(l),
		})
	case l <= math.MaxUint16: // str16
		w.Write([]byte{
			0x81,
			byte(l >> 8),
			byte(l),
		})
	case l <= math.MaxUint32: // str32
		w.Write([]byte{
			0x81,
			byte(l >> 24),
			byte(l >> 16),
			byte(l >> 8),
			byte(l),
		})
	}
	io.WriteString(w, string(*m))
}

func (m *TextMessage) DecodeMessage(r io.ReadSeeker, header byte) error {
	var buf []byte
	switch {
	case header <= 0x7F: // fixstr
		buf = make([]byte, header)
	case header == 0x80: // str8
		buf = readBytes(r, 1)
		buf = make([]byte, buf[0])
	case header == 0x81: // str16
		buf = readBytes(r, 2)
		buf = make([]byte, binary.BigEndian.Uint16(buf))
	case header == 0x82: // str32
		buf = readBytes(r, 4)
		buf = make([]byte, binary.BigEndian.Uint32(buf))
	}

	_, err := r.Read(buf)
	if err != nil {
		return err
	}

	*m = TextMessage(buf)
	return nil
}
