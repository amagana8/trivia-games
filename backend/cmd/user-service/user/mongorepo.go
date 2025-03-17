package user

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

func (r *Repository) GetByUsername(ctx context.Context, username string) (*model.User, error) {
	user := model.User{}
	err := r.Collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *Repository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	user := model.User{}
	err := r.Collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *Repository) GetById(ctx context.Context, id string) (*model.User, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	user := model.User{}
	err = r.Collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *Repository) Insert(ctx context.Context, user model.User) (*primitive.ObjectID, error) {
	insertResult, err := r.Collection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}

	id := insertResult.InsertedID.(primitive.ObjectID)
	return &id, nil
}

func (r *Repository) UpdateById(ctx context.Context, id string, updates map[string]interface{}) (*model.User, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	after := options.After
	opts := &options.FindOneAndUpdateOptions{
		ReturnDocument: &after,
	}

	user := model.User{}
	err = r.Collection.FindOneAndUpdate(ctx, bson.M{"_id": objectId}, bson.M{"$set": updates}, opts).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
