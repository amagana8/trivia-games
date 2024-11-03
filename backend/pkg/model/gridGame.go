package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Column struct {
	Category  string      `bson:"category"`
	Questions [5]Question `bson:"questions"`
}

type GridGame struct {
	Id        primitive.ObjectID `bson:"_id,omitempty"`
	Grid      []Column           `bson:"grid"`
	CreatedAt *time.Time         `bson:"createdAt"`
	UpdatedAt *time.Time         `bson:"updatedAt"`
}
