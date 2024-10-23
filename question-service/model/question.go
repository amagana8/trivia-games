package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	ID        primitive.ObjectID `bson:"_id"`
	AuthorID  primitive.ObjectID `bson:"author_id"`
	query     string             `bson:"query"`
	Answer    string             `bson:"answer"`
	CreatedAt *time.Time         `bson:"createdAt"`
	UpdatedAt *time.Time         `bson:"updatedAt"`
}
