package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/amagana8/trivia-games/backend/cmd/game-service/gridGame"
	"github.com/amagana8/trivia-games/backend/pkg/application"
	"github.com/amagana8/trivia-games/backend/pkg/interceptors"
	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
)

func main() {
	mongoURI := flag.String("mongoURI", "mongodb://localhost:27018", "Database hostname url")
	mongoDatabase := flag.String("mongoDatabase", "gameServiceDB", "Database name")
	serverPort := flag.String("serverPort", ":3002", "HTTP server network port")
	flag.Parse()

	logger := log.New(os.Stderr, "", log.Ldate|log.Ltime|log.Lshortfile)

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(*mongoURI))
	if err != nil {
		fmt.Println("failed to connect to mongodb: %w", err)
	}

	gridGameRepository := gridGame.NewRepository(client.Database(*mongoDatabase).Collection("games"))
	gridGameService := gridGame.NewService(gridGameRepository)
	gridGameServer := gridGame.NewServer(gridGameService)

	server := grpc.NewServer(
		grpc.ChainUnaryInterceptor(interceptors.UnaryServerLogging(logger)),
	)
	pb.RegisterGridGameServiceServer(server, gridGameServer)

	app := application.New(*serverPort, client, server)

	ctx, cancel = signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	err = app.Run(ctx)
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
