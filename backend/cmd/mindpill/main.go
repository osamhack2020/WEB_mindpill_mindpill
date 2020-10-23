// Command mindpill - 국군 장병들을 위한 원격 상담 플랫폼.
package main

import (
	"mindpill/backend"
	"os"

	"mindpill/backend/internal/log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/urfave/cli/v2"
	"go.uber.org/zap"
)

var logger = log.Logger()

func main() {
	app := &cli.App{
		Name:  "mindpill",
		Usage: "starts mindpill server.",
		Action: func(ctx *cli.Context) error {
			return backend.Run()
		},
		Commands: []*cli.Command{{
			Name:   "setup-database",
			Usage:  "setup the database with initial data.",
			Action: SetupDatabase,
		}},
	}

	err := app.Run(os.Args)
	if err != nil {
		logger.Fatal("command throws an error", zap.Error(err))
		os.Exit(1)
	}
}
