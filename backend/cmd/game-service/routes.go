package main

import (
	"net/http"

	"github.com/amagana8/trivia-games/backend/cmd/game-service/gridGame"
	"github.com/amagana8/trivia-games/backend/pkg/middleware"
)

func CreateRouter(gamesRepo *gridGame.Repository) http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Handle("/gridGame/", http.StripPrefix("/gridGame", loadGridGameRoutes(gamesRepo)))

	return middleware.Logger(router)
}

func loadGridGameRoutes(gamesRepo *gridGame.Repository) *http.ServeMux {
	gridGameRouter := http.NewServeMux()
	girdGameHandler := &gridGame.Handler{
		Repo: gamesRepo,
	}

	gridGameRouter.HandleFunc("POST /", girdGameHandler.Create)
	gridGameRouter.HandleFunc("GET /", girdGameHandler.GetAll)
	gridGameRouter.HandleFunc("GET /{id}", girdGameHandler.GetById)
	gridGameRouter.HandleFunc("PUT /{id}", girdGameHandler.UpdateById)
	gridGameRouter.HandleFunc("DELETE /{id}", girdGameHandler.DeleteById)

	return gridGameRouter
}
