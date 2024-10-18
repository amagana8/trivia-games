package application

import (
	"net/http"

	"github.com/amagana8/trivia-games/question-service/handler"
)

func loadRoutes() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Handle("/question", loadQuestionRoutes())

	return router
}

func loadQuestionRoutes() *http.ServeMux {
	questionRouter := http.NewServeMux()
	questionHandler := &handler.Question{}

	questionRouter.HandleFunc("POST /", questionHandler.Create)
	questionRouter.HandleFunc("GET /", questionHandler.GetAll)
	questionRouter.HandleFunc("GET /{id}", questionHandler.GetById)
	questionRouter.HandleFunc("PUT /{id}", questionHandler.UpdateById)
	questionRouter.HandleFunc("DELETE /{id}", questionHandler.DeleteById)

	return questionRouter
}
