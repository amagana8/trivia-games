package gridGame

import (
	"context"
	"fmt"
	"time"

	"github.com/amagana8/trivia-games/backend/pkg/model"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	Repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		Repository: repository,
	}
}

func (s *Service) CreateGridGame(ctx context.Context, game []model.Column) (*model.GridGame, error) {
	now := time.Now().UTC()

	gridGame := model.GridGame{
		Game:      game,
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

func (s *Service) UpdateGridGameById(ctx context.Context, id string, game []model.Column) (*model.GridGame, error) {
	now := time.Now().UTC()

	updates := map[string]interface{}{
		"updatedAt": now,
	}

	if len(game) != 0 {
		updates["game"] = game
	}

	gridGame, err := s.Repository.UpdateByID(ctx, id, updates)
	if err != nil {
		fmt.Println("failed to update gridGame by id:", err)
		return nil, err
	}

	return gridGame, nil
}

func (s *Service) DeleteGridGameById(ctx context.Context, id string) error {
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
