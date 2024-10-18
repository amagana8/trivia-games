package application

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/amagana8/trivia-games/middleware"
	"go.mongodb.org/mongo-driver/mongo"
)

type App struct {
	addr string
	db   *mongo.Client
}

func New(addr string, dbClient *mongo.Client) *App {
	app := &App{
		addr: addr,
		db:   dbClient,
	}

	return app
}

func (a *App) Run(ctx context.Context) error {
	server := &http.Server{
		Addr:    a.addr,
		Handler: middleware.Logger(loadRoutes()),
	}

	log.Println("Starting server")

	err := server.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
