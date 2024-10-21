package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TriviaQuestion struct {
	ID        primitive.ObjectID `bson:"_id"`
	AuthorID  primitive.ObjectID `bson:"author_id"`
	Question  string             `bson:"question"`
	Answer    string             `bson:"answer"`
	CreatedAt *time.Time         `bson:"createdAt"`
	UpdatedAt *time.Time         `bson:"updatedAt"`
}
