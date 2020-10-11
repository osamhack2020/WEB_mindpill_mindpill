package tokens

import (
	"bytes"
	"crypto/hmac"
	"errors"
	"hash"
	"mindpill/backend/configs"
)

func splitToken(token []byte) (payload []byte, signature []byte, err error) {
	i := bytes.IndexByte(token, '.')
	if i < 0 {
		return nil, nil, errors.New("invalid token")
	}
	return token[:i], token[i+1:], nil
}

func hashData(alg func() hash.Hash, data []byte) []byte {
	hasher := hmac.New(alg, []byte(configs.TokenSecret))
	hasher.Write(data)
	return hasher.Sum(nil)
}

func b64decode(src []byte) ([]byte, error) {
	var dst = make([]byte, b64.DecodedLen(len(src)))
	n, err := b64.Decode(dst, src)
	if err != nil {
		return nil, err
	}
	return dst[:n], nil
}

func b64decodeMust(src []byte) []byte {
	dst, err := b64decode(src)
	if err != nil {
		panic(err)
	}
	return dst
}
