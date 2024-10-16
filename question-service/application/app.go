package application

import (
	"context"
	"fmt"
	"net/http"

	"github.com/amagana8/trivia-games/middleware"
)

type App struct {
	addr string
}

func New(addr string) *App {
	app := &App{
		addr: addr,
	}

	return app
}

func (a *App) Run(ctx context.Context) error {
	server := &http.Server{
		Addr:    a.addr,
		Handler: middleware.Logger(loadRoutes()),
	}

	err := server.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
