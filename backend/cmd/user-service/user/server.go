package user

import (
	"context"
	"errors"

	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Server struct {
	Service *Service
	pb.UnimplementedUserServiceServer
}

func NewServer(service *Service) *Server {
	return &Server{
		Service: service,
	}
}

func (s *Server) SignUp(ctx context.Context, in *pb.SignUpRequest) (*pb.SignInResponse, error) {
	tokens, err := s.Service.CreateUser(ctx, in.Username, in.Email, in.Password)
	if errors.Is(err, ErrInvalidUsername) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if errors.Is(err, ErrInvalidEmail) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if errors.Is(err, ErrInvalidPassword) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if errors.Is(err, ErrEmailExists) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if errors.Is(err, ErrUsernameExists) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to create user")
	}

	return &pb.SignInResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *Server) SignIn(ctx context.Context, in *pb.SignInRequest) (*pb.SignInResponse, error) {
	tokens, err := s.Service.AuthenticateUser(ctx, in.Username, in.Password)
	if errors.Is(err, ErrUserDoesNotExist) {
		return nil, status.Error(codes.NotFound, err.Error())
	} else if errors.Is(err, ErrIncorrectPassword) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to authenticate user")
	}

	return &pb.SignInResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *Server) ChangePassword(ctx context.Context, in *pb.ChangePasswordRequest) (*pb.SignInResponse, error) {
	tokens, err := s.Service.ChangePassword(ctx, in.UserId, in.NewPassword)
	if errors.Is(err, ErrUserDoesNotExist) {
		return nil, status.Error(codes.NotFound, err.Error())
	} else if errors.Is(err, ErrInvalidPassword) {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to change password")
	}

	return &pb.SignInResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *Server) RefreshToken(ctx context.Context, in *pb.RefreshTokenRequest) (*pb.SignInResponse, error) {
	tokens, err := s.Service.RefreshToken(ctx, in.RefreshToken)
	if errors.Is(err, ErrInvalidRefreshToken) {
		return nil, status.Error(codes.Unauthenticated, err.Error())
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to refresh token")
	}

	return &pb.SignInResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
	}, nil
}

func (s *Server) GetMe(ctx context.Context, in *pb.GetMeRequest) (*pb.GetMeResponse, error) {
	user, err := s.Service.GetMe(ctx, in.UserId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get user")
	}

	userQuestions := make([]string, len(user.Questions))
	for i, question := range user.Questions {
		userQuestions[i] = question.Hex()
	}

	userGames := make([]string, len(user.Games))
	for i, game := range user.Games {
		userGames[i] = game.Hex()
	}

	return &pb.GetMeResponse{
		UserId:    user.Id.Hex(),
		Username:  user.Username,
		Email:     user.Email,
		Questions: userQuestions,
		Games:     userGames,
	}, nil
}
