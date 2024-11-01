package question

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	Service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		Service: service,
	}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var body struct {
		AuthorId string `json:"authorId"`
		Query    string `json:"query"`
		Answer   string `json:"answer"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	question, err := h.Service.CreateQuestion(r.Context(), body.AuthorId, body.Query, body.Answer)
	if errors.Is(err, primitive.ErrInvalidHex) {
		w.WriteHeader(http.StatusBadRequest)
		return
	} else if err != nil {
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
	w.WriteHeader(http.StatusCreated)
	w.Write(res)
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	questions, err := h.Service.GetAllQuestions(r.Context())
	if err != nil {
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

	question, err := h.Service.GetQuestionById(r.Context(), idParam)
	if errors.Is(err, mongo.ErrNoDocuments) {
		w.WriteHeader(http.StatusNotFound)
		return
	} else if err != nil {
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

	question, err := h.Service.UpdateQuestionById(r.Context(), idParam, body.Query, body.Answer)
	if err != nil {
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

	err := h.Service.DeleteQuestionById(r.Context(), idParam)
	if errors.Is(err, mongo.ErrNoDocuments) {
		w.WriteHeader(http.StatusNotFound)
		return
	} else if err != nil {
		fmt.Println("failed to delete:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
