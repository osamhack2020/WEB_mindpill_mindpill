package tokens

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"errors"
	"mindpill/ent"
	"time"
)

var ErrNotRefresh = errors.New("tokens: provided token is not refresh token")

var (
	b64           = base64.RawURLEncoding
	hashAlgorithm = sha512.New512_256
)

type TokenGroup struct {
	ID          int  `json:"id"`
	IsManager   bool `json:"manager"`
	IsCounselor bool `json:"counselor"`
}

func GroupMapFromRecords(groupRecords ...*ent.Group) map[int]TokenGroup {
	var result = make(map[int]TokenGroup)
	for _, record := range groupRecords {
		result[record.ID] = TokenGroup{
			ID:          record.ID,
			IsManager:   record.Edges.Managers != nil,
			IsCounselor: record.Edges.Counselors != nil,
		}
	}
	return result
}

type Token struct {
	ID        uint64             `json:"tid"`
	UserID    int                `json:"uid"`
	Groups    map[int]TokenGroup `json:"groups"`
	IsAdmin   bool               `json:"admin"`
	IsRefresh bool               `json:"refresh"`
	CreatedAt time.Time          `json:"cat"`

	signature []byte
}

func Parse(src []byte) (*Token, error) {
	var token Token
	if err := token.parse(src, false); err != nil {
		return nil, err
	}
	return &token, nil
}

func Validate(src []byte) (*Token, error) {
	var token Token
	if err := token.parse(src, true); err != nil {
		return nil, err
	}
	return &token, nil
}

func (t *Token) parse(src []byte, validate bool) error {
	payloadSrc, signatureSrc, err := splitToken(src)
	if err != nil {
		return err
	}

	payload, err := b64decode(payloadSrc)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(payload, t); err != nil {
		return err
	}

	signature, err := b64decode(signatureSrc)
	if err != nil {
		return err
	}
	t.signature = signature

	if validate {
		if err := t.validate(payload); err != nil {
			return err
		}
	}
	return nil
}

func (t *Token) Sign() ([]byte, error) {
	payload, err := json.Marshal(t)
	if err != nil {
		return nil, err
	}
	signature := hashData(hashAlgorithm, payload)

	var (
		payloadLen   = b64.EncodedLen(len(payload))
		signatureLen = b64.EncodedLen(len(signature))
		buf          = make(
			[]byte,
			payloadLen+signatureLen+1,
		)
	)
	b64.Encode(buf[:payloadLen], payload)
	buf[payloadLen] = '.'
	b64.Encode(buf[payloadLen+1:], signature)
	return buf, nil
}

func (t *Token) Validate() error {
	if t.signature == nil {
		return nil
	}
	payload, err := json.Marshal(t)
	if err != nil {
		return err
	}
	return t.validate(payload)
}

func (t *Token) validate(payload []byte) error {
	if t.signature == nil {
		return nil
	}
	signature := hashData(hashAlgorithm, payload)
	if !hmac.Equal(signature, t.signature) {
		return errors.New("invalid token")
	}
	return nil
}

func (t *Token) IsManagerOf(groupIDs ...int) bool {
	for _, groupID := range groupIDs {
		if !t.Groups[groupID].IsManager {
			continue
		}
		return true
	}
	return false
}

func (t *Token) IsCounselerOf(groupIDs ...int) bool {
	for _, groupID := range groupIDs {
		if !t.Groups[groupID].IsCounselor {
			continue
		}
		return true
	}
	return false
}

func (t *Token) IsOwner(userID int) bool {
	return t.UserID == userID
}
