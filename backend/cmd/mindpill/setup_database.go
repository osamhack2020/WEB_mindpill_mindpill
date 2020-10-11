package main

import (
	"mindpill/backend/internal/database"

	"github.com/urfave/cli/v2"
)

func SetupDatabase(ctx *cli.Context) error {
	var err error

	err = database.Setup()
	if err != nil {
		return err
	}

	err = database.Ent().Schema.Create(ctx.Context)
	if err != nil {
		return err
	}

	// TODO: insert default data

	return nil
}
