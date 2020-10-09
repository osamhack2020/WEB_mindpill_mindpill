package main

import (
	"context"
	"mindpill/backend/internal/database"
	"mindpill/backend/internal/log"
	"os"

	"go.uber.org/zap"

	_ "github.com/go-sql-driver/mysql"
)

var logger = log.Logger()

func main() {
	var err error

	err = database.Setup()
	if err != nil {
		logger.Error("failed to setup database", zap.Error(err))
		os.Exit(1)
	}

	err = database.Ent().Schema.Create(context.Background())
	if err != nil {
		logger.Error("failed to migrate database", zap.Error(err))
		os.Exit(1)
	}
}
