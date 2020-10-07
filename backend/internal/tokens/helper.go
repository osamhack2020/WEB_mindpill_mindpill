package tokens

import (
	"errors"
	"strings"
)

func splitToken(token string) (payload string, signature string, err error) {
	i := strings.IndexByte(token, '.')
	if i < 0 {
		return "", "", errors.New("invalid token")
	}
	return token[:i], token[i+1:], nil
}
