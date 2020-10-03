package handlers

import (
	"mindpill/backend/internal/frontend"
	"os"

	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

// FrontendHandler - 프론트엔드 핸들러입니다.
var FrontendHandler fasthttp.RequestHandler = func() fasthttp.RequestHandler {
	fr, err := frontend.New()
	if err != nil {
		logger.Error(
			"failed to initialize frontend",
			zap.Error(err),
		)
		os.Exit(1)
	}
	return fr.Handler
}()
