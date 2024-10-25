package application

import (
	"net/http"

	"github.com/amagana8/trivia-games/question-service/cmd/middleware"
	"github.com/amagana8/trivia-games/question-service/cmd/question"
)

func (a *App) loadRoutes() {
	router := http.NewServeMux()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	router.Handle("/question/", http.StripPrefix("/question", loadQuestionRoutes(a.questions)))

	a.router = middleware.Logger(router)
}

func loadQuestionRoutes(questionsRepo *question.Repository) *http.ServeMux {
	questionRouter := http.NewServeMux()
	questionHandler := &question.Handler{
		Repo: questionsRepo,
	}

	questionRouter.HandleFunc("POST /", questionHandler.Create)
	questionRouter.HandleFunc("GET /", questionHandler.GetAll)
	questionRouter.HandleFunc("GET /{id}", questionHandler.GetById)
	questionRouter.HandleFunc("PUT /{id}", questionHandler.UpdateById)
	questionRouter.HandleFunc("DELETE /{id}", questionHandler.DeleteById)

	return questionRouter
}
