package main

import (
	"context"
	"fmt"

	"github.com/amagana8/trivia-games/application"
)

func main() {
	app := application.New(":3001")

	err := app.Run(context.TODO())
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
