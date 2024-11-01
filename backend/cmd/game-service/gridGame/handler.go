package gridGame

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/amagana8/trivia-games/backend/pkg/model"
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
		Game []model.Column `json:"game"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	gridGame, err := h.Service.CreateGridGame(r.Context(), body.Game)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(gridGame)
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
	gridGames, err := h.Service.GetAllGridGames(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(gridGames)
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

	gridGame, err := h.Service.GetGridGameById(r.Context(), idParam)
	if errors.Is(err, mongo.ErrNoDocuments) {
		w.WriteHeader(http.StatusNotFound)
		return
	} else if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(gridGame)
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
		Game []model.Column `json:"game"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	idParam := r.PathValue("id")

	gridGame, err := h.Service.UpdateGridGameById(r.Context(), idParam, body.Game)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(gridGame)
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

	err := h.Service.DeleteGridGameById(r.Context(), idParam)
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
