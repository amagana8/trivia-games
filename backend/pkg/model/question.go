package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MediaType int

const (
	Undefined MediaType = iota
	Image
	Video
	Audio
)

type Media struct {
	Url  string    `bson:"url"`
	Type MediaType `bson:"type"`
}

type Question struct {
	Id        primitive.ObjectID `bson:"_id,omitempty"`
	AuthorId  primitive.ObjectID `bson:"authorId"`
	Query     string             `bson:"query"`
	Answer    string             `bson:"answer"`
	Embed     *Media             `bson:"embed"`
	CreatedAt *time.Time         `bson:"createdAt"`
	UpdatedAt *time.Time         `bson:"updatedAt"`
}
