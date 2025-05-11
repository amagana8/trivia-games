package gameroom

import (
	"container/heap"
	"context"
	"errors"
	"slices"

	"github.com/amagana8/trivia-games/backend/pkg/pb"
	"github.com/google/uuid"
)

var ErrRoomNotFound = errors.New("room not found")
var ErrNotHost = errors.New("not the host")

type GameRoom struct {
	State         *pb.GameRoomState
	Channels      []chan *pb.GameRoomState
	BuzzerChannel chan *pb.BuzzerUpdate
	QuestionMap   map[string]int32
}

type Service struct {
	roomMap map[string]*GameRoom
}

func NewService() *Service {
	return &Service{
		roomMap: make(map[string]*GameRoom),
	}
}

func BroadcastRoomUpdate(room *GameRoom) {
	for _, channel := range room.Channels {
		channel <- room.State
	}
}

func ResetAllowedPlayers(room *GameRoom) {
	i := 0
	for playerId := range room.State.PlayerScores {
		room.State.AllowedPlayers[i] = playerId
		i++
	}

}

func (s *Service) CreateGameRoom(hostId string) *GameRoom {
	hostChannel := make(chan *pb.GameRoomState)

	gameRoom := &GameRoom{
		State: &pb.GameRoomState{
			GameRoomId:         uuid.New().String(),
			HostId:             hostId,
			CompletedQuestions: make([]string, 0),
			PlayerScores:       make(map[string]int32),
			Status:             pb.GameStatus_LOBBY,
		},
		Channels:      []chan *pb.GameRoomState{hostChannel},
		BuzzerChannel: make(chan *pb.BuzzerUpdate),
	}
	s.roomMap[gameRoom.State.GameRoomId] = gameRoom

	return gameRoom
}

func (s *Service) JoinGameRoom(playerId string, roomId string) (*GameRoom, error) {
	gameRoom, exists := s.roomMap[roomId]
	if !exists {
		return nil, ErrRoomNotFound
	}
	gameRoom.State.PlayerScores[playerId] = 0

	playerChannel := make(chan *pb.GameRoomState)
	gameRoom.Channels = append(gameRoom.Channels, playerChannel)

	return gameRoom, nil
}

func (s *Service) StartGame(ctx context.Context, roomId string, hostId string, questionMap map[string]int32) error {
	room, exists := s.roomMap[roomId]
	if !exists {
		return ErrRoomNotFound
	}
	if room.State.HostId != hostId {
		return ErrNotHost
	}

	room.State.Status = pb.GameStatus_QUESTION_SELECT
	room.QuestionMap = questionMap
	room.State.AllowedPlayers = make([]string, len(room.State.PlayerScores))
	BroadcastRoomUpdate(room)

	return nil
}

func (s *Service) SelectQuestion(ctx context.Context, roomId string, hostId string, questionId string) error {
	room, exists := s.roomMap[roomId]
	if !exists {
		return ErrRoomNotFound
	}
	if room.State.HostId != hostId {
		return ErrNotHost
	}

	room.State.CurrentQuestion = questionId
	BroadcastRoomUpdate(room)

	return nil
}

func (s *Service) StartBuzzer(ctx context.Context, roomId string, hostId string) error {
	room, exists := s.roomMap[roomId]
	if !exists {
		return ErrRoomNotFound
	}
	if room.State.HostId != hostId {
		return ErrNotHost
	}

	room.State.Status = pb.GameStatus_BUZZING
	ResetAllowedPlayers(room)
	BroadcastRoomUpdate(room)

	return nil
}

func (s *Service) DetermineBuzzerWinner(buzzerChannel chan *pb.BuzzerUpdate) error {
	buzzerMinHeap := &MinHeap{}
	heap.Init(buzzerMinHeap)

	for {
		buzzerState := <-buzzerChannel
		room, err := s.GetGameRoom(buzzerState.GameRoomId)
		if err != nil {
			return err
		}

		buzzerMinHeap.Push(buzzerState)

		if buzzerMinHeap.Peek().IsBuzzed && buzzerMinHeap.Len() == len(room.State.PlayerScores) {
			room.State.Status = pb.GameStatus_ANSWERING
			room.State.CurrentPlayer = buzzerMinHeap.Peek().PlayerId
			BroadcastRoomUpdate(room)
			return nil
		}
	}
}

func (s *Service) GetGameRoom(roomId string) (*GameRoom, error) {
	room, exists := s.roomMap[roomId]
	if !exists {
		return nil, ErrRoomNotFound
	}
	return room, nil
}

func (s *Service) JudgeAnswer(roomId string, hostId string, playerId string, isCorrect bool) error {
	room, err := s.GetGameRoom(roomId)
	if err != nil {
		return err
	}
	if room.State.HostId != hostId {
		return ErrNotHost
	}

	if isCorrect {
		room.State.PlayerScores[playerId] += room.QuestionMap[room.State.CurrentQuestion]
		room.State.CompletedQuestions = append(room.State.CompletedQuestions, room.State.CurrentQuestion)
		room.State.CurrentQuestion = ""
		room.State.Status = pb.GameStatus_QUESTION_SELECT

		BroadcastRoomUpdate(room)
	} else {
		room.State.Status = pb.GameStatus_BUZZING

		if len(room.State.AllowedPlayers) == 0 {
			room.State.CompletedQuestions = append(room.State.CompletedQuestions, room.State.CurrentQuestion)
			room.State.CurrentQuestion = ""
			room.State.Status = pb.GameStatus_QUESTION_SELECT
		} else {
			for i, currentPlayer := range room.State.AllowedPlayers {
				if currentPlayer == playerId {
					room.State.AllowedPlayers = slices.Delete(room.State.AllowedPlayers, i, i+1)
					break
				}
			}
		}
		BroadcastRoomUpdate(room)
	}

	if len(room.State.CompletedQuestions) == len(room.QuestionMap) {
		room.State.Status = pb.GameStatus_GAME_OVER
		BroadcastRoomUpdate(room)
	}

	return nil
}
