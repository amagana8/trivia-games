package gameroom

import (
	"context"
	"errors"
	"fmt"

	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

type Server struct {
	Service *Service
	pb.UnimplementedGameRoomServiceServer
}

func NewServer(service *Service) *Server {
	return &Server{
		Service: service,
	}
}

func (s *Server) CreateGameRoom(ctx context.Context, in *pb.CreateGameRoomRequest) (*pb.GameRoomState, error) {
	gameRoomState := s.Service.CreateGameRoom(in.HostId)

	return gameRoomState, nil
}

func (s *Server) JoinGameRoom(in *pb.JoinGameRoomRequest, stream pb.GameRoomService_JoinGameRoomServer) error {
	gameRoom, err := s.Service.JoinGameRoom(in.UserId, in.GameRoomId)
	if errors.Is(err, ErrRoomNotFound) {
		return status.Error(codes.NotFound, "room not found")
	} else if err != nil {
		return status.Error(codes.Internal, "failed to create or join game room")
	}

	ctx := stream.Context()
	gameOverChannel := make(chan bool, 1)
	go func() {
		for {
			select {
			case gameRoomStateUpdate := <-gameRoom.Channels[in.UserId]:
				err := stream.SendMsg(gameRoomStateUpdate)
				if err != nil {
					fmt.Println("failed to send gameRoom state:", err)
					return
				}
				if gameRoomStateUpdate.Status == pb.GameStatus_GAME_OVER {
					gameOverChannel <- true
					return
				}
			case <-ctx.Done():
				return
			}
		}
	}()
	BroadcastRoomUpdate(gameRoom)

	select {
	case <-ctx.Done():
		return nil
	case <-gameOverChannel:
		return nil
	}
}

func (s *Server) StartGame(ctx context.Context, in *pb.StartGameRequest) (*emptypb.Empty, error) {
	err := s.Service.StartGame(ctx, in.GameRoomId, in.HostId, in.GameId, in.QuestionMap)
	if errors.Is(err, ErrRoomNotFound) {
		return nil, status.Error(codes.NotFound, "room not found")
	} else if errors.Is(err, ErrNotHost) {
		return nil, status.Error(codes.PermissionDenied, "not the host")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to start game")
	}

	return nil, nil
}

func (s *Server) SelectQuestion(ctx context.Context, in *pb.SelectQuestionRequest) (*emptypb.Empty, error) {
	err := s.Service.SelectQuestion(ctx, in.GameRoomId, in.HostId, in.QuestionId)
	if errors.Is(err, ErrRoomNotFound) {
		return nil, status.Error(codes.NotFound, "room not found")
	} else if errors.Is(err, ErrNotHost) {
		return nil, status.Error(codes.PermissionDenied, "not the host")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to set question")
	}

	return nil, nil
}

func (s *Server) StartBuzzer(ctx context.Context, in *pb.StartBuzzerRequest) (*emptypb.Empty, error) {
	err := s.Service.StartBuzzer(ctx, in.GameRoomId, in.HostId)
	if errors.Is(err, ErrRoomNotFound) {
		return nil, status.Error(codes.NotFound, "room not found")
	} else if errors.Is(err, ErrNotHost) {
		return nil, status.Error(codes.PermissionDenied, "not the host")
	} else if err != nil {
		return nil, status.Error(codes.Internal, "failed to start buzzer")
	}

	return nil, nil
}

func (s *Server) PlayerBuzzer(stream pb.GameRoomService_PlayerBuzzerServer) error {
	ctx := stream.Context()

	initalBuzzerUpdate, err := stream.Recv()
	if err != nil {
		return status.Error(codes.Internal, "failed to receive initial buzzer update")
	}

	room, err := s.Service.GetGameRoom(initalBuzzerUpdate.GameRoomId)
	if err != nil {
		return status.Error(codes.NotFound, err.Error())
	}

	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				buzzerUpdate, err := stream.Recv()
				if err != nil {
					fmt.Println("failed to receive player buzzer:", err)
					return
				}
				room.BuzzerChannel <- buzzerUpdate
			}
		}
	}()

	err = s.Service.DetermineBuzzerWinner(room.BuzzerChannel)
	if err != nil {
		return status.Error(codes.Internal, "failed to determine buzzer winner")
	}

	err = stream.SendAndClose(nil)
	if err != nil {
		return status.Error(codes.Internal, "failed to close stream")
	}
	return nil
}
