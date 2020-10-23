package handlers

import (
	"mindpill/backend/internal/frontend"
	"os"

	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

func FrontendHandler() fasthttp.RequestHandler {
	f, err := frontend.New("./frontend")
	if err != nil {
		logger.Error("failed to initialize frontend", zap.Error(err))
		os.Exit(1)
	}
	return f.Handler
}
