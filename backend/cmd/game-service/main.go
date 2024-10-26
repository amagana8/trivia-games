package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"

	"github.com/amagana8/trivia-games/backend/cmd/game-service/gridGame"
	"github.com/amagana8/trivia-games/backend/pkg/application"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := flag.String("mongoURI", "mongodb://localhost:27017", "Database hostname url")
	mongoDatabase := flag.String("mongoDatabase", "triviaGames", "Database name")
	serverPort := flag.String("serverPort", ":3002", "HTTP server network port")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(*mongoURI))
	if err != nil {
		fmt.Println("failed to connect to mongodb: %w", err)
	}

	gamesRepo := &gridGame.Repository{
		Collection: client.Database(*mongoDatabase).Collection("games"),
	}

	router := CreateRouter(gamesRepo)

	app := application.New(*serverPort, client, router)

	err = app.Run(ctx)
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
