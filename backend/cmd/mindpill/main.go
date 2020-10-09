// Command mindpill - 국군 장병들을 위한 원격 상담 플랫폼.
package main

import (
	"mindpill/backend"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	err := backend.Run()
	if err != nil {
		os.Exit(1)
	}
}
