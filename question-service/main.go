package main

import (
	"context"
	"flag"
	"fmt"

	"github.com/amagana8/trivia-games/application"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := flag.String("mongoURI", "mongodb://localhost:27017", "Database hostname url")

	client, err := mongo.Connect(context.TODO(), options.Client().
		ApplyURI(*mongoURI))
	if err != nil {
		fmt.Println("failed to connect to mongodb: %w", err)
	}

	app := application.New(":3001", client)

	err = app.Run(context.TODO())
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
