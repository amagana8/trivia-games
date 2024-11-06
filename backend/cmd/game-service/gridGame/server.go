package gridGame

import (
	"context"
	"errors"
	"time"

	"github.com/amagana8/trivia-games/backend/cmd/question-service/question"
	"github.com/amagana8/trivia-games/backend/pkg/model"
	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Server struct {
	Service *Service
	pb.UnimplementedGridGameServiceServer
}

func NewServer(service *Service) *Server {
	return &Server{
		Service: service,
	}
}

func gridGameToResponse(g *model.GridGame) *pb.GridGame {
	grid := make([]*pb.Column, len(g.Grid))
	for x := range g.Grid {
		grid[x].Category = g.Grid[x].Category
		for y := range g.Grid[x].Questions {
			grid[x].Questions[y] = question.QuestionToResponse(&g.Grid[x].Questions[y])
		}
	}

	return &pb.GridGame{
		Id:        g.Id.Hex(),
		Grid:      grid,
		CreatedAt: g.CreatedAt.String(),
		UpdatedAt: g.UpdatedAt.String(),
	}
}

func responseGridToModelGrid(responseGrid []*pb.Column) ([]model.Column, error) {
	modelGrid := make([]model.Column, len(responseGrid))
	for x := range responseGrid {
		modelGrid[x].Category = responseGrid[x].Category
		for y, question := range responseGrid[x].Questions {
			questionId, err := primitive.ObjectIDFromHex(question.Id)
			if err != nil {
				return nil, err
			}
			authorId, err := primitive.ObjectIDFromHex(question.AuthorId)
			if err != nil {
				return nil, err
			}
			createdAt, err := time.Parse("2006-01-02 15:04:05.999999999 -0700 MS", question.CreatedAt)
			if err != nil {
				return nil, err
			}
			updatedAt, err := time.Parse("2006-01-02 15:04:05.999999999 -0700 MS", question.UpdatedAt)
			if err != nil {
				return nil, err
			}

			modelGrid[x].Questions[y] = model.Question{
				Id:        questionId,
				Query:     question.Query,
				Answer:    question.Answer,
				AuthorId:  authorId,
				CreatedAt: &createdAt,
				UpdatedAt: &updatedAt,
			}

		}
	}
	return modelGrid, nil
}

func (s *Server) CreateGridGame(ctx context.Context, in *pb.CreateGridGameRequest) (*pb.GridGame, error) {
	input, err := responseGridToModelGrid(in.Grid)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "invalid grid")
	}

	gridGame, err := s.Service.CreateGridGame(ctx, in.AuthorId, input)
	if errors.Is(err, primitive.ErrInvalidHex) {
		return nil, status.Error(codes.InvalidArgument, "invalid author id")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to create grid game")
	}

	return gridGameToResponse(gridGame), nil
}

func (s *Server) GetAllGridGames(ctx context.Context, in *pb.GetAllGridGamesRequest) (*pb.GetAllGridGamesResponse, error) {
	gridGames, err := s.Service.GetAllGridGames(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get all gridGames")
	}

	res := &pb.GetAllGridGamesResponse{}
	res.GridGames = make([]*pb.GridGame, len(*gridGames))
	for i, gridGame := range *gridGames {
		res.GridGames[i] = gridGameToResponse(&gridGame)
	}

	return res, nil
}

func (s *Server) GetGridGame(ctx context.Context, in *pb.GridGameId) (*pb.GridGame, error) {
	gridGame, err := s.Service.GetGridGameById(ctx, in.Id)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, status.Error(codes.NotFound, "gridGame not found")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to get gridGame")
	}

	return gridGameToResponse(gridGame), nil
}

func (s *Server) UpdateGridGame(ctx context.Context, in *pb.UpdateGridGameRequest) (*pb.GridGame, error) {
	input, err := responseGridToModelGrid(in.Grid)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "invalid grid")
	}
	gridGame, err := s.Service.UpdateGridGameById(ctx, in.Id, input)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to update gridGame")

	}

	return gridGameToResponse(gridGame), nil
}

func (s *Server) DeleteGridGame(ctx context.Context, in *pb.GridGameId) (*pb.DeleteGridGameResponse, error) {
	err := s.Service.DeleteGridGameById(ctx, in.Id)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, status.Error(codes.NotFound, "gridGame not found")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to delete gridGame")
	}

	return &pb.DeleteGridGameResponse{}, nil
}
