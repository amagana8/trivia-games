package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Column struct {
	Category  string               `bson:"category"`
	Questions []primitive.ObjectID `bson:"questions"`
}

type GridGame struct {
	Id        primitive.ObjectID `bson:"_id,omitempty"`
	AuthorId  primitive.ObjectID `bson:"authorId"`
	Title     string             `bson:"title"`
	Grid      []Column           `bson:"grid"`
	CreatedAt *time.Time         `bson:"createdAt"`
	UpdatedAt *time.Time         `bson:"updatedAt"`
}
