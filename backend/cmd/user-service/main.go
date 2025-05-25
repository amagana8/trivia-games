package main

import (
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/amagana8/trivia-games/backend/cmd/user-service/user"
	"github.com/amagana8/trivia-games/backend/pkg/application"
	"github.com/amagana8/trivia-games/backend/pkg/interceptors"

	"github.com/amagana8/trivia-games/backend/pkg/pb"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
)

func main() {
	mongoURI := flag.String("mongoURI", "mongodb://localhost:27019", "Database hostname url")
	mongoDatabase := flag.String("mongoDatabase", "userServiceDB", "Database name")
	serverPort := flag.String("serverPort", ":3004", "HTTP server network port")
	flag.Parse()

	logger := log.New(os.Stderr, "", log.Ldate|log.Ltime|log.Lshortfile)

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(*mongoURI))
	if err != nil {
		logger.Println("failed to connect to mongodb: %w", err)
	}

	userRepository := user.NewRepository(client.Database(*mongoDatabase).Collection("users"))
	userService := user.NewService(userRepository)
	userServer := user.NewServer(userService)

	server := grpc.NewServer(
		grpc.ChainUnaryInterceptor(interceptors.UnaryServerLogging(logger)),
	)
	pb.RegisterUserServiceServer(server, userServer)

	app := application.New(*serverPort, client, server)

	ctx, cancel = signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	err = app.Run(ctx)
	if err != nil {
		logger.Println("failed to start app:", err)
	}
}
