package gridGame

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

func (r *Repository) Insert(ctx context.Context, gridGame model.GridGame) (*primitive.ObjectID, error) {
	insertResult, err := r.Collection.InsertOne(ctx, gridGame)
	if err != nil {
		return nil, err
	}
	id := insertResult.InsertedID.(primitive.ObjectID)
	return &id, nil
}

func (r *Repository) FindByIds(ctx context.Context, ids []string) ([]model.GridGame, error) {
	objectIds := make([]primitive.ObjectID, len(ids))
	for i, id := range ids {
		objectId, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return nil, err
		}
		objectIds[i] = objectId
	}

	games := []model.GridGame{}
	gameCursor, err := r.Collection.Find(ctx, bson.M{"_id": bson.M{"$in": objectIds}})
	if err != nil {
		return nil, err
	}

	err = gameCursor.All(ctx, &games)
	if err != nil {
		return nil, err
	}

	return games, nil
}

func (r *Repository) FindAll(ctx context.Context) ([]model.GridGame, error) {
	games := []model.GridGame{}
	gameCursor, err := r.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	err = gameCursor.All(ctx, &games)
	if err != nil {
		return nil, err
	}

	return games, nil
}

func (r *Repository) FindById(ctx context.Context, id string) (*model.GridGame, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	gridGame := model.GridGame{}
	err = r.Collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&gridGame)
	if err != nil {
		return nil, err
	}

	return &gridGame, nil
}

func (r *Repository) UpdateByID(ctx context.Context, id string, updates map[string]interface{}) (*model.GridGame, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	after := options.After
	opts := &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	}
	gridGame := model.GridGame{}
	err = r.Collection.FindOneAndUpdate(ctx, bson.M{"_id": objectId}, bson.M{"$set": updates}, opts).Decode(&gridGame)
	if err != nil {
		return nil, err
	}
	return &gridGame, nil
}

func (r *Repository) DeleteById(ctx context.Context, id string) (*mongo.DeleteResult, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	return r.Collection.DeleteOne(ctx, bson.M{"_id": objectId})
}
