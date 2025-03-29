package question

import (
	"context"
	"errors"

	"github.com/amagana8/trivia-games/backend/pkg/model"
	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Server struct {
	Service *Service
	pb.UnimplementedQuestionServiceServer
}

func NewServer(service *Service) *Server {
	return &Server{
		Service: service,
	}
}

func questionToResponse(q *model.Question) *pb.Question {
	return &pb.Question{
		Id:        q.Id.Hex(),
		AuthorId:  q.AuthorId.Hex(),
		Query:     q.Query,
		Answer:    q.Answer,
		CreatedAt: q.CreatedAt.String(),
		UpdatedAt: q.UpdatedAt.String(),
	}
}

func (s *Server) CreateQuestion(ctx context.Context, in *pb.CreateQuestionRequest) (*pb.Question, error) {
	question, err := s.Service.CreateQuestion(ctx, in.AuthorId, in.Query, in.Answer, in.Embed.Url, model.MediaType(in.Embed.Type))
	if errors.Is(err, primitive.ErrInvalidHex) {
		return nil, status.Error(codes.InvalidArgument, "invalid author id")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to create question")
	}

	return questionToResponse(question), nil
}

func (s *Server) GetQuestion(ctx context.Context, in *pb.QuestionId) (*pb.Question, error) {
	question, err := s.Service.GetQuestionById(ctx, in.Id)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, status.Error(codes.NotFound, "question not found")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to get question")
	}

	return questionToResponse(question), nil
}

func (s *Server) GetAllQuestions(ctx context.Context, in *pb.GetAllQuestionsRequest) (*pb.GetAllQuestionsResponse, error) {
	questions, err := s.Service.GetAllQuestions(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get all questions")
	}

	res := &pb.GetAllQuestionsResponse{}
	res.Questions = make([]*pb.Question, len(*questions))
	for i, q := range *questions {
		res.Questions[i] = questionToResponse(&q)
	}

	return res, nil
}

func (s *Server) UpdateQuestion(ctx context.Context, in *pb.UpdateQuestionRequest) (*pb.Question, error) {
	question, err := s.Service.UpdateQuestionById(ctx, in.Id, in.Query, in.Answer, in.Embed.Url, model.MediaType(in.Embed.Type))
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to update question")
	}

	return questionToResponse(question), nil
}

func (s *Server) DeleteQuestion(ctx context.Context, in *pb.QuestionId) (*pb.DeleteQuestionResponse, error) {
	err := s.Service.DeleteQuestionById(ctx, in.Id)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, status.Error(codes.NotFound, "question not found")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to delete question")
	}

	return &pb.DeleteQuestionResponse{}, nil
}
