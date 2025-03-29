package question

import (
	"context"
	"fmt"
	"time"

	"github.com/amagana8/trivia-games/backend/pkg/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (s *Service) CreateQuestion(ctx context.Context, authorId string, query string, answer string, embedUrl string, embedType model.MediaType) (*model.Question, error) {
	authorObjectId, err := primitive.ObjectIDFromHex(authorId)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()

	question := model.Question{
		AuthorId: authorObjectId,
		Query:    query,
		Answer:   answer,
		Embed: &model.Media{
			Url:  embedUrl,
			Type: embedType,
		},
		CreatedAt: &now,
		UpdatedAt: &now,
	}

	questionId, err := s.Repository.Insert(ctx, question)
	if err != nil {
		fmt.Println("failed to insert question:", err)
		return nil, err
	}
	question.Id = *questionId

	return &question, nil
}

func (s *Service) GetAllQuestions(ctx context.Context) (*[]model.Question, error) {
	questions, err := s.Repository.FindAll(ctx)
	if err != nil {
		fmt.Println("failed to get all questions:", err)
		return nil, err
	}

	return &questions, nil
}

func (s *Service) GetQuestionById(ctx context.Context, id string) (*model.Question, error) {
	question, err := s.Repository.FindById(ctx, id)
	if err != nil {
		fmt.Println("failed to find question by id:", err)
		return nil, err
	}

	return question, nil
}

func (s *Service) UpdateQuestionById(ctx context.Context, id string, query string, answer string, embedLink string, embedType model.MediaType) (*model.Question, error) {
	now := time.Now().UTC()

	updates := map[string]interface{}{
		"updatedAt": now,
	}

	if query != "" {
		updates["query"] = query
	}

	if answer != "" {
		updates["answer"] = answer
	}

	if embedLink != "" {
		updates["embed.url"] = embedLink
	}

	if embedType != model.Undefined {
		updates["embed.type"] = embedType
	}

	question, err := s.Repository.UpdateById(ctx, id, updates)
	if err != nil {
		fmt.Println("failed to update question by id:", err)
		return nil, err
	}

	return question, nil
}

func (s *Service) DeleteQuestionById(ctx context.Context, id string) error {
	deleteResult, err := s.Repository.DeleteById(ctx, id)
	if err != nil {
		fmt.Println("failed to delete question by id:", err)
		return err
	}

	if deleteResult.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
