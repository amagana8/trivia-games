package repository

import (
	"context"

	"github.com/amagana8/trivia-games/question-service/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoRepo struct {
	Collection *mongo.Collection
}

func (m *MongoRepo) Insert(ctx context.Context, triviaQuestion model.TriviaQuestion) (*mongo.InsertOneResult, error) {
	return m.Collection.InsertOne(ctx, triviaQuestion)
}

func (m *MongoRepo) FindById(ctx context.Context, id string) (*model.TriviaQuestion, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	triviaQuestion := model.TriviaQuestion{}
	err = m.Collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&triviaQuestion)
	if err != nil {
		return nil, err
	}

	return &triviaQuestion, nil
}

func (m *MongoRepo) FindAll(ctx context.Context) ([]model.TriviaQuestion, error) {
	triviaQuestions := []model.TriviaQuestion{}
	triviaQuestionCursor, err := m.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	err = triviaQuestionCursor.All(ctx, &triviaQuestions)
	if err != nil {
		return nil, err
	}

	return triviaQuestions, nil
}

func (m *MongoRepo) UpdateByID(ctx context.Context, triviaQuestion model.TriviaQuestion) (*mongo.UpdateResult, error) {
	return m.Collection.UpdateByID(ctx, triviaQuestion.ID, triviaQuestion)
}

func (m *MongoRepo) DeleteById(ctx context.Context, id string) (*mongo.DeleteResult, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	return m.Collection.DeleteOne(ctx, bson.M{"_id": objectId})
}
