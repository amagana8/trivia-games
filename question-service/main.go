package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"

	"github.com/amagana8/trivia-games/question-service/application"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := flag.String("mongoURI", "mongodb://localhost:27017", "Database hostname url")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(*mongoURI))
	if err != nil {
		fmt.Println("failed to connect to mongodb: %w", err)
	}

	app := application.New(":3001", client)

	err = app.Run(ctx)
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
