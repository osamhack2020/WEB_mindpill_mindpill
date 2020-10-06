package database

import (
	"mindpill/backend/configs"
	"mindpill/ent"
)

var entClient *ent.Client

func Setup() error {
	client, err := ent.Open("mysql", configs.DatabaseURI)
	if err != nil {
		return err
	}
	entClient = client
	return nil
}

func Ent() *ent.Client {
	return entClient
}
