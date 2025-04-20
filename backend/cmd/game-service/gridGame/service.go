package gridGame

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/amagana8/trivia-games/backend/pkg/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var ErrUnauthorized = errors.New("unauthorized")

type Service struct {
	Repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		Repository: repository,
	}
}

func (s *Service) CreateGridGame(ctx context.Context, authorId string, title string, grid []model.Column) (*model.GridGame, error) {
	authorObjectId, err := primitive.ObjectIDFromHex(authorId)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()

	gridGame := model.GridGame{
		AuthorId:  authorObjectId,
		Grid:      grid,
		Title:     title,
		CreatedAt: &now,
		UpdatedAt: &now,
	}

	id, err := s.Repository.Insert(ctx, gridGame)
	if err != nil {
		fmt.Println("failed to insert gridGame:", err)
		return nil, err
	}
	gridGame.Id = *id

	return &gridGame, nil
}

func (s *Service) GetGridGamesByIds(ctx context.Context, ids []string) (*[]model.GridGame, error) {
	gridGames, err := s.Repository.FindByIds(ctx, ids)
	if err != nil {
		fmt.Println("failed to get gridGames by ids:", err)
		return nil, err
	}

	return &gridGames, nil
}

func (s *Service) GetAllGridGames(ctx context.Context) (*[]model.GridGame, error) {
	gridGames, err := s.Repository.FindAll(ctx)
	if err != nil {
		fmt.Println("failed to get all gridGames:", err)
		return nil, err
	}

	return &gridGames, nil
}

func (s *Service) GetGridGameById(ctx context.Context, id string) (*model.GridGame, error) {
	gridGame, err := s.Repository.FindById(ctx, id)
	if err != nil {
		fmt.Println("failed to get gridGame by id:", err)
		return nil, err
	}

	return gridGame, nil
}

func (s *Service) UpdateGridGameById(ctx context.Context, id string, title string, grid []model.Column, userId string) (*model.GridGame, error) {
	gridGame, err := s.Repository.FindById(ctx, id)
	if err != nil {
		fmt.Println("failed to find gridGame by id:", err)
		return nil, err
	}
	if gridGame.AuthorId.Hex() != userId {
		fmt.Printf("user %s is not the author of gridGame %s\n", userId, id)
		return nil, ErrUnauthorized
	}

	now := time.Now().UTC()

	updates := map[string]interface{}{
		"updatedAt": now,
	}

	if len(grid) != 0 {
		updates["grid"] = grid
	}

	if title != "" {
		updates["title"] = title
	}

	gridGame, err = s.Repository.UpdateByID(ctx, id, updates)
	if err != nil {
		fmt.Println("failed to update gridGame by id:", err)
		return nil, err
	}

	return gridGame, nil
}

func (s *Service) DeleteGridGameById(ctx context.Context, id string, userId string) error {
	gridGame, err := s.Repository.FindById(ctx, id)
	if err != nil {
		fmt.Println("failed to find gridGame by id:", err)
		return err
	}
	if gridGame.AuthorId.Hex() != userId {
		fmt.Printf("user %s is not the author of gridGame %s\n", userId, id)
		return ErrUnauthorized
	}

	deleteResult, err := s.Repository.DeleteById(ctx, id)
	if err != nil {
		fmt.Println("failed to delete gridGame by id:", err)
		return err
	}

	if deleteResult.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
