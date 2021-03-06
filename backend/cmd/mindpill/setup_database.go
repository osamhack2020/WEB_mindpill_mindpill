package main

import (
	"mindpill/backend/internal/database"

	"github.com/facebook/ent/dialect/sql/schema"
	"github.com/urfave/cli/v2"
)

func SetupDatabase(ctx *cli.Context) error {
	var err error

	err = database.Setup()
	if err != nil {
		return err
	}

	err = database.Ent().Schema.Create(
		ctx.Context,
		schema.WithDropColumn(true),
		schema.WithDropIndex(true),
	)
	if err != nil {
		return err
	}

	return nil
}
