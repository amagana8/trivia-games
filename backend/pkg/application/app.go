package application

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

type App struct {
	addr   string
	router http.Handler
	db     *mongo.Client
}

func New(addr string, dbClient *mongo.Client, router http.Handler) *App {
	app := &App{
		addr:   addr,
		db:     dbClient,
		router: router,
	}

	return app
}

func (a *App) Run(ctx context.Context) error {
	server := &http.Server{
		Addr:    a.addr,
		Handler: a.router,
	}

	// deferring so I don't have to repeat this in every return case
	//  and wrapping in anonymous function since disconnect returns an error
	defer func() {
		err := a.db.Disconnect(ctx)
		if err != nil {
			fmt.Println("failed to close redis", err)
		}
	}()

	log.Println("Starting server")

	ch := make(chan error, 1)

	go func() {
		err := server.ListenAndServe()
		if err != nil {
			ch <- fmt.Errorf("failed to start server: %w", err)
		}
		close(ch)
	}()

	select {
	case err := <-ch:
		return err
	case <-ctx.Done():
		// give time for any ongoing requests to finish
		timeout, cancel := context.WithTimeout(context.Background(), time.Second*10)
		defer cancel()

		return server.Shutdown(timeout)
	}
}