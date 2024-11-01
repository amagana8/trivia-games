package main

import (
	"net/http"

	"github.com/amagana8/trivia-games/backend/cmd/game-service/gridGame"
	"github.com/amagana8/trivia-games/backend/pkg/middleware"
)

func CreateRouter(gridGameHandler *gridGame.Handler) http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Handle("/gridGame/", http.StripPrefix("/gridGame", loadGridGameRoutes(gridGameHandler)))

	return middleware.Logger(router)
}

func loadGridGameRoutes(gridGameHandler *gridGame.Handler) *http.ServeMux {
	gridGameRouter := http.NewServeMux()

	gridGameRouter.HandleFunc("POST /", gridGameHandler.Create)
	gridGameRouter.HandleFunc("GET /", gridGameHandler.GetAll)
	gridGameRouter.HandleFunc("GET /{id}", gridGameHandler.GetById)
	gridGameRouter.HandleFunc("PUT /{id}", gridGameHandler.UpdateById)
	gridGameRouter.HandleFunc("DELETE /{id}", gridGameHandler.DeleteById)

	return gridGameRouter
}
