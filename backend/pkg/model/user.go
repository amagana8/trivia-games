package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id           primitive.ObjectID   `bson:"_id,omitempty"`
	Username     string               `bson:"username"`
	Email        string               `bson:"email"`
	Password     string               `bson:"password"`
	TokenVersion int                  `bson:"tokenVersion"`
	CreatedAt    *time.Time           `bson:"createdAt"`
	UpdatedAt    *time.Time           `bson:"updatedAt"`
	Questions    []primitive.ObjectID `bson:"questions"`
	Games        []primitive.ObjectID `bson:"games"`
}
