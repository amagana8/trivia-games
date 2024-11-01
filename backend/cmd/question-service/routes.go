package main

import (
	"net/http"

	"github.com/amagana8/trivia-games/backend/cmd/question-service/question"
	"github.com/amagana8/trivia-games/backend/pkg/middleware"
)

func CreateRouter(questionHandler *question.Handler) http.Handler {
	router := http.NewServeMux()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Handle("/question/", http.StripPrefix("/question", loadQuestionRoutes(questionHandler)))

	return middleware.Logger(router)
}

func loadQuestionRoutes(questionHandler *question.Handler) *http.ServeMux {
	questionRouter := http.NewServeMux()

	questionRouter.HandleFunc("POST /", questionHandler.Create)
	questionRouter.HandleFunc("GET /", questionHandler.GetAll)
	questionRouter.HandleFunc("GET /{id}", questionHandler.GetById)
	questionRouter.HandleFunc("PUT /{id}", questionHandler.UpdateById)
	questionRouter.HandleFunc("DELETE /{id}", questionHandler.DeleteById)

	return questionRouter
}
