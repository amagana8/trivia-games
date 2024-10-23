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

func (m *MongoRepo) Insert(ctx context.Context, question model.Question) (*mongo.InsertOneResult, error) {
	return m.Collection.InsertOne(ctx, question)
}

func (m *MongoRepo) FindById(ctx context.Context, id string) (*model.Question, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	question := model.Question{}
	err = m.Collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&question)
	if err != nil {
		return nil, err
	}

	return &question, nil
}

func (m *MongoRepo) FindAll(ctx context.Context) ([]model.Question, error) {
	questions := []model.Question{}
	questionCursor, err := m.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	err = questionCursor.All(ctx, &questions)
	if err != nil {
		return nil, err
	}

	return questions, nil
}

func (m *MongoRepo) UpdateByID(ctx context.Context, question model.Question) (*mongo.UpdateResult, error) {
	return m.Collection.UpdateByID(ctx, question.ID, question)
}

func (m *MongoRepo) DeleteById(ctx context.Context, id string) (*mongo.DeleteResult, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	return m.Collection.DeleteOne(ctx, bson.M{"_id": objectId})
}
