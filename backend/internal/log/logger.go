package log

import (
	"mindpill/backend/internal/debug"

	"go.uber.org/zap"
)

var instance = func() *zap.Logger {
	var (
		log *zap.Logger
		err error
	)
	if debug.IsDebug() {
		log, err = zap.NewDevelopment()
	} else {
		log, err = zap.NewProduction()
	}
	if err != nil {
		panic(err)
	}
	return log
}()

func Logger() *zap.Logger {
	return instance
}
