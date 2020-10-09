package configs

import "time"

const (
	// ServerAddr - 서버가 요청을 받을 주소입니다.
	ServerAddr = ":7080"

	// TokenSecret -
	TokenSecret   = "secret"
	TokenLifetime = 24 * time.Hour

	// DatabaseURI - 데이터베이스에 연결하기 위해 사용할 URI입니다.
	DatabaseURI = "root:1q2w3e4r!@tcp(localhost:3306)/mindpill_test?parseTime=true"
)
