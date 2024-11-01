package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	Id        primitive.ObjectID `bson:"_id,omitempty"`
	AuthorId  primitive.ObjectID `bson:"authorId"`
	Query     string             `bson:"query"`
	Answer    string             `bson:"answer"`
	CreatedAt *time.Time         `bson:"createdAt"`
	UpdatedAt *time.Time         `bson:"updatedAt"`
}
