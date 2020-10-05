package backend

import "mindpill/backend/internal/database"

func Setup() error {
	return database.Setup()
}
