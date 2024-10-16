package application

import (
	"context"
	"fmt"
	"net/http"
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
		Handler: loadRoutes(),
	}

	err := server.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
