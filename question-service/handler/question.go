package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/amagana8/trivia-games/question-service/model"
	"github.com/amagana8/trivia-games/question-service/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Question struct {
	Repo *repository.QuestionModel
}

func (q *Question) Create(w http.ResponseWriter, r *http.Request) {
	var body struct {
		AuthorID string `json:"authorId"`
		Query    string `json:"query"`
		Answer   string `json:"answer"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	authorId, err := primitive.ObjectIDFromHex(body.AuthorID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	now := time.Now().UTC()

	question := model.Question{
		AuthorID:  authorId,
		Query:     body.Query,
		Answer:    body.Answer,
		CreatedAt: &now,
		UpdatedAt: &now,
	}

	insertResult, err := q.Repo.Insert(r.Context(), question)
	if err != nil {
		fmt.Println("failed to insert:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	question.ID = insertResult.InsertedID.(primitive.ObjectID)

	res, err := json.Marshal(question)
	if err != nil {
		fmt.Println("failed to marshal:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(res)
}

func (q *Question) GetAll(w http.ResponseWriter, r *http.Request) {
	questions, err := q.Repo.FindAll(r.Context())
	if err != nil {
		fmt.Println("failed to find all:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(questions)
	if err != nil {
		fmt.Println("failed to marshal:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func (q *Question) GetById(w http.ResponseWriter, r *http.Request) {
	idParam := r.PathValue("id")

	question, err := q.Repo.FindById(r.Context(), idParam)
	if errors.Is(err, mongo.ErrNoDocuments) {
		w.WriteHeader(http.StatusNotFound)
		return
	} else if err != nil {
		fmt.Println("failed to find by id:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(question)
	if err != nil {
		fmt.Println("failed to marshal:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func (q *Question) UpdateById(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Query  string `json:"query"`
		Answer string `json:"answer"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fmt.Println(body.Query)

	idParam := r.PathValue("id")

	now := time.Now().UTC()

	updates := map[string]interface{}{
		"updatedAt": now,
	}

	if body.Query != "" {
		updates["query"] = body.Query
	}

	if body.Answer != "" {
		updates["answer"] = body.Answer
	}

	question, err := q.Repo.UpdateByID(r.Context(), idParam, updates)
	if err != nil {
		fmt.Println("failed to insert:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(question)
	if err != nil {
		fmt.Println("failed to marshal:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(res)
}

func (q *Question) DeleteById(w http.ResponseWriter, r *http.Request) {
	idParam := r.PathValue("id")

	deleteResult, err := q.Repo.DeleteById(r.Context(), idParam)
	if err != nil {
		fmt.Println("failed to delete:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if deleteResult.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}
