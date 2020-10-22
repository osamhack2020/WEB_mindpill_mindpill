package chat

import (
	"io"
	"mindpill/backend/internal/log"
)

var logger = log.Logger()

func readBytes(r io.Reader, l int) []byte {
	buf := make([]byte, l)
	r.Read(buf)
	return buf
}
