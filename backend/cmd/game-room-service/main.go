package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"

	gameroom "github.com/amagana8/trivia-games/backend/cmd/game-room-service/game-room"
	"github.com/amagana8/trivia-games/backend/pkg/application"
	"github.com/amagana8/trivia-games/backend/pkg/interceptors"
	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"google.golang.org/grpc"
)

func main() {
	serverPort := flag.String("serverPort", ":3005", "HTTP server network port")
	flag.Parse()

	logger := log.New(os.Stderr, "", log.Ldate|log.Ltime|log.Lshortfile)

	gameRoomService := gameroom.NewService()
	gameRoomServer := gameroom.NewServer(gameRoomService)

	server := grpc.NewServer(
		grpc.ChainUnaryInterceptor(interceptors.UnaryServerLogging(logger)),
		grpc.ChainStreamInterceptor(interceptors.StreamServerLogging(logger)),
	)
	pb.RegisterGameRoomServiceServer(server, gameRoomServer)

	app := application.New(*serverPort, nil, server)

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	err := app.Run(ctx)
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
