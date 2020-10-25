package chat

import (
	"io"
)

type Message interface {
	EncodeMessage(w io.Writer)
	DecodeMessage(r io.ReadSeeker, header byte) error
}

func WriteMessage(w io.Writer, msg Message) {
	msg.EncodeMessage(w)
}
