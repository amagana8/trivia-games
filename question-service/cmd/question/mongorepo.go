package question

import (
	"context"

	"github.com/amagana8/trivia-games/question-service/pkg/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Repository struct {
	Collection *mongo.Collection
}

func (r *Repository) Insert(ctx context.Context, question model.Question) (*mongo.InsertOneResult, error) {
	return r.Collection.InsertOne(ctx, question)
}

func (r *Repository) FindById(ctx context.Context, id string) (*model.Question, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	question := model.Question{}
	err = r.Collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&question)
	if err != nil {
		return nil, err
	}

	return &question, nil
}

func (r *Repository) FindAll(ctx context.Context) ([]model.Question, error) {
	questions := []model.Question{}
	questionCursor, err := r.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	err = questionCursor.All(ctx, &questions)
	if err != nil {
		return nil, err
	}

	return questions, nil
}

func (r *Repository) UpdateByID(ctx context.Context, id string, updates map[string]interface{}) (*model.Question, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	after := options.After
	opts := &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	}
	question := model.Question{}
	err = r.Collection.FindOneAndUpdate(ctx, bson.M{"_id": objectId}, bson.M{"$set": updates}, opts).Decode(&question)
	if err != nil {
		return nil, err
	}
	return &question, nil
}

func (r *Repository) DeleteById(ctx context.Context, id string) (*mongo.DeleteResult, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	return r.Collection.DeleteOne(ctx, bson.M{"_id": objectId})
}
