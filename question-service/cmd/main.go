package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"

	"github.com/amagana8/trivia-games/question-service/cmd/application"
	"github.com/amagana8/trivia-games/question-service/cmd/question"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := flag.String("mongoURI", "mongodb://localhost:27017", "Database hostname url")
	mongoDatabase := flag.String("mongoDatabase", "triviaGames", "Database name")
	serverPort := flag.String("serverPort", ":3001", "HTTP server network port")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(*mongoURI))
	if err != nil {
		fmt.Println("failed to connect to mongodb: %w", err)
	}

	questions := &question.Repository{
		Collection: client.Database(*mongoDatabase).Collection("questions"),
	}

	app := application.New(*serverPort, client, questions)

	err = app.Run(ctx)
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
