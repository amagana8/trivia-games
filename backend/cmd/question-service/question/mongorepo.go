package question

import (
	"context"

	"github.com/amagana8/trivia-games/backend/pkg/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Repository struct {
	Collection *mongo.Collection
}

func NewRepository(collection *mongo.Collection) *Repository {
	return &Repository{
		Collection: collection,
	}
}

func (r *Repository) Insert(ctx context.Context, question model.Question) (*primitive.ObjectID, error) {
	insertResult, err := r.Collection.InsertOne(ctx, question)
	if err != nil {
		return nil, err
	}
	id := insertResult.InsertedID.(primitive.ObjectID)
	return &id, nil
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

func (r *Repository) FindByIds(ctx context.Context, ids []string) ([]model.Question, error) {
	objectIds := make([]primitive.ObjectID, len(ids))
	for i, id := range ids {
		objectId, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}
		objectIds[i] = objectId
	}

	questions := []model.Question{}
	questionCursor, err := r.Collection.Find(ctx, bson.M{"_id": bson.M{"$in": objectIds}})
	if err != nil {
		return nil, err
	}

	err = questionCursor.All(ctx, &questions)
	if err != nil {
		return nil, err
	}

	return questions, nil
}

func (r *Repository) FindByAuthorId(ctx context.Context, authorId string) ([]model.Question, error) {
	authorObjectId, err := primitive.ObjectIDFromHex(authorId)
	if err != nil {
		return nil, err
	}

	questions := []model.Question{}
	questionCursor, err := r.Collection.Find(ctx, bson.M{"authorId": authorObjectId})
	if err != nil {
		return nil, err
	}

	err = questionCursor.All(ctx, &questions)
	if err != nil {
		return nil, err
	}

	return questions, nil
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

func (r *Repository) UpdateById(ctx context.Context, id string, updates map[string]interface{}) (*model.Question, error) {
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
