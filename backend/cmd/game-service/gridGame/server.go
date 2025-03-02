package gridGame

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
	pb.UnimplementedGridGameServiceServer
}

func NewServer(service *Service) *Server {
	return &Server{
		Service: service,
	}
}

func gridGameToResponse(g *model.GridGame) *pb.GridGame {
	grid := make([]*pb.Column, len(g.Grid))
	for x, modelColumn := range g.Grid {
		grid[x] = &pb.Column{
			Category:  modelColumn.Category,
			Questions: make([]string, len(modelColumn.Questions)),
		}
		for y, questionId := range modelColumn.Questions {
			grid[x].Questions[y] = questionId.Hex()
		}
	}

	return &pb.GridGame{
		Id:        g.Id.Hex(),
		AuthorId:  g.AuthorId.Hex(),
		Grid:      grid,
		Title:     g.Title,
		CreatedAt: g.CreatedAt.String(),
		UpdatedAt: g.UpdatedAt.String(),
	}
}

func responseGridToModelGrid(responseGrid []*pb.Column) ([]model.Column, error) {
	modelGrid := make([]model.Column, len(responseGrid))
	for x, responseColumn := range responseGrid {
		modelGrid[x].Category = responseColumn.Category
		modelGrid[x].Questions = make([]primitive.ObjectID, len(responseColumn.Questions))
		for y, questionIdHex := range responseColumn.Questions {
			questionId, err := primitive.ObjectIDFromHex(questionIdHex)
			if err != nil {
				return nil, err
			}

			modelGrid[x].Questions[y] = questionId
		}
	}
	return modelGrid, nil
}

func (s *Server) CreateGridGame(ctx context.Context, in *pb.CreateGridGameRequest) (*pb.GridGame, error) {
	input, err := responseGridToModelGrid(in.Grid)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "invalid grid")
	}

	gridGame, err := s.Service.CreateGridGame(ctx, in.AuthorId, in.Title, input)
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
	gridGame, err := s.Service.UpdateGridGameById(ctx, in.Id, in.Title, input)
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
