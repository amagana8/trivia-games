package question

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/amagana8/trivia-games/backend/pkg/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	Repo *Repository
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
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

	id, err := h.Repo.Insert(r.Context(), question)
	if err != nil {
		fmt.Println("failed to insert:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	question.ID = *id

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

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	questions, err := h.Repo.FindAll(r.Context())
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

func (h *Handler) GetById(w http.ResponseWriter, r *http.Request) {
	idParam := r.PathValue("id")

	question, err := h.Repo.FindById(r.Context(), idParam)
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

func (h *Handler) UpdateById(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Query  string `json:"query"`
		Answer string `json:"answer"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

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

	question, err := h.Repo.UpdateByID(r.Context(), idParam, updates)
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

func (h *Handler) DeleteById(w http.ResponseWriter, r *http.Request) {
	idParam := r.PathValue("id")

	deleteResult, err := h.Repo.DeleteById(r.Context(), idParam)
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
