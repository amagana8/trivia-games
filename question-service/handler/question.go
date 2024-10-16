package handler

import (
	"fmt"
	"net/http"
)

type Question struct{}

func (q *Question) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Create a question")
}

func (q *Question) GetAll(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get all questions")
}

func (q *Question) GetById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get question by Id")
}

func (q *Question) UpdateById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update question by Id")
}

func (q *Question) DeleteById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Delete question by Id")

}
