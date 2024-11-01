package application

import (
	"context"
	"fmt"
	"log"
	"net"

	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type App struct {
	addr   string
	db     *mongo.Client
	server *grpc.Server
}

func New(addr string, dbClient *mongo.Client, server *grpc.Server) *App {
	app := &App{
		addr:   addr,
		db:     dbClient,
		server: server,
	}

	return app
}

func (a *App) Run(ctx context.Context) error {
	reflection.Register(a.server)
	// deferring so I don't have to repeat this in every return case
	//  and wrapping in anonymous function since disconnect returns an error
	defer func() {
		err := a.db.Disconnect(ctx)
		if err != nil {
			fmt.Println("failed to close db", err)
		}
	}()

	log.Println("Starting server")

	ch := make(chan error, 1)

	go func() {
		listener, err := net.Listen("tcp", a.addr)
		if err != nil {
			ch <- fmt.Errorf("failed to listen: %w", err)
		}
		err = a.server.Serve(listener)
		if err != nil {
			ch <- fmt.Errorf("failed to start server: %w", err)
		}
		listener.Close()
		close(ch)
	}()

	select {
	case err := <-ch:
		return err
	case <-ctx.Done():
		log.Println("Shutting down server")
		a.server.GracefulStop()
		return nil
	}
}
