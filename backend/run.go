package backend

import (
	"mindpill/backend/configs"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

var logger = log.Logger()

func Run() error {
	err := database.Setup()
	if err != nil {
		logger.Error(
			"Failed to setup",
			zap.Error(err),
		)
		return err
	}

	server := &fasthttp.Server{
		Handler:      r.Handler,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	errchan := make(chan error, 1)
	go func() {
		logger.Info(
			"server running",
			zap.String("address", configs.ServerAddr),
		)
		errchan <- server.ListenAndServe(
			configs.ServerAddr,
		)
	}()

	// Ctrl+C?
	sigchan := make(chan os.Signal, 1)
	signal.Notify(
		sigchan,
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	for {
		select {
		case sig := <-sigchan:
			logger.Info(
				"signal received, shutting down...",
				zap.String("signal", sig.String()),
			)
			err := server.Shutdown()
			if err != nil {
				logger.Error(
					"failed to shutdown server",
					zap.Error(err),
				)
				return err
			}

		case err := <-errchan:
			if err != nil {
				logger.Error(
					"server throws an error",
					zap.Error(err),
				)
				return err
			}
			return nil
		}
	}
}
