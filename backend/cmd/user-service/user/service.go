package user

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"time"

	"github.com/amagana8/trivia-games/backend/cmd/user-service/config"
	"github.com/amagana8/trivia-games/backend/pkg/model"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidUsername = errors.New("invalid username")
var ErrInvalidEmail = errors.New("invalid email")
var ErrInvalidPassword = errors.New("invalid password")
var ErrUsernameExists = errors.New("username already exists")
var ErrUserDoesNotExist = errors.New("user does not exist")
var ErrIncorrectPassword = errors.New("incorrect password")
var ErrInvalidRefreshToken = errors.New("invalid refresh token")

const passwordRegex = "^\\S{8,256}$"

type AuthTokens struct {
	AccessToken  string
	RefreshToken string
}

func createAccessToken(id string) (string, error) {
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": id,
		"exp": time.Now().Add(time.Minute * 15).Unix(),
	})

	tokenString, err := accessToken.SignedString(config.Envs.AccessTokenKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func createRefreshToken(id string, tokenVersion int) (string, error) {
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":          id,
		"tokenVersion": tokenVersion,
		"exp":          time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	tokenString, err := refreshToken.SignedString(config.Envs.RefreshTokenKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

type Service struct {
	Repository *Repository
}

func NewService(repository *Repository) *Service {
	return &Service{
		Repository: repository,
	}
}

func (s *Service) CreateUser(ctx context.Context, username string, email string, password string) (*AuthTokens, error) {
	matched, err := regexp.MatchString("^[a-zA-Z0-9][a-zA-Z0-9_-]{2,26}[a-zA-Z0-9]$", username)
	if !matched {
		return nil, ErrInvalidUsername
	}
	if err != nil {
		fmt.Println("failed to validate username:", err)
		return nil, err
	}

	matched, err = regexp.MatchString("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$", email)
	if !matched {
		return nil, ErrInvalidEmail
	}
	if err != nil {
		fmt.Println("failed to validate email:", err)
		return nil, err
	}

	matched, err = regexp.MatchString(passwordRegex, password)
	if !matched {
		return nil, ErrInvalidPassword
	}
	if err != nil {
		fmt.Println("failed to validate password:", err)
		return nil, err
	}

	existingUser, err := s.Repository.GetByUsername(ctx, username)
	if existingUser != nil {
		return nil, ErrUsernameExists
	}
	if err != nil {
		fmt.Println("failed checking if username exists:", err)
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("failed to hash password:", err)
		return nil, err
	}

	now := time.Now().UTC()

	user := model.User{
		Email:        email,
		Username:     username,
		Password:     string(hashedPassword),
		TokenVersion: 0,
		CreatedAt:    &now,
		UpdatedAt:    &now,
	}

	userId, err := s.Repository.Insert(ctx, user)
	if err != nil {
		fmt.Println("failed to insert user:", err)
		return nil, err
	}

	accessToken, err := createAccessToken(userId.Hex())
	if err != nil {
		fmt.Println("failed to create access token:", err)
		return nil, err
	}

	refreshToken, err := createRefreshToken(userId.Hex(), 0)
	if err != nil {
		fmt.Println("failed to create refresh token:", err)
		return nil, err
	}

	return &AuthTokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *Service) AuthenticateUser(ctx context.Context, username string, password string) (*AuthTokens, error) {
	user, err := s.Repository.GetByUsername(ctx, username)
	if err != nil {
		return nil, ErrUserDoesNotExist
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, ErrIncorrectPassword
	}

	accessToken, err := createAccessToken(user.Id.Hex())
	if err != nil {
		fmt.Println("failed to create access token:", err)
		return nil, err
	}

	refreshToken, err := createRefreshToken(user.Id.Hex(), user.TokenVersion)
	if err != nil {
		fmt.Println("failed to create refresh token:", err)
		return nil, err
	}

	return &AuthTokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *Service) ChangePassword(ctx context.Context, userId string, newPassword string) (*AuthTokens, error) {
	user, err := s.Repository.GetById(ctx, userId)
	if err != nil {
		return nil, ErrUserDoesNotExist
	}

	matched, err := regexp.MatchString(passwordRegex, newPassword)
	if !matched {
		return nil, ErrInvalidPassword
	}
	if err != nil {
		fmt.Println("failed to validate password:", err)
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("failed to hash password:", err)
		return nil, err
	}

	now := time.Now().UTC()
	user, err = s.Repository.UpdateById(ctx, userId, map[string]interface{}{
		"password":     string(hashedPassword),
		"tokenVersion": user.TokenVersion + 1,
		"updatedAt":    &now,
	})
	if err != nil {
		fmt.Println("failed to update user:", err)
		return nil, err
	}

	accessToken, err := createAccessToken(user.Id.Hex())
	if err != nil {
		fmt.Println("failed to create access token:", err)
		return nil, err
	}

	refreshToken, err := createRefreshToken(user.Id.Hex(), user.TokenVersion)
	if err != nil {
		fmt.Println("failed to create refresh token:", err)
		return nil, err
	}

	return &AuthTokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *Service) RefreshToken(ctx context.Context, refreshToken string) (*AuthTokens, error) {
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return config.Envs.RefreshTokenKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, ErrInvalidRefreshToken
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		userId := claims["sub"].(string)
		tokenVersion := claims["tokenVersion"].(int)

		user, err := s.Repository.GetById(ctx, userId)
		if err != nil {
			return nil, err
		}
		if tokenVersion != user.TokenVersion {
			return nil, ErrInvalidRefreshToken
		}

		accessToken, err := createAccessToken(userId)
		if err != nil {
			return nil, err
		}

		refreshToken, err := createRefreshToken(userId, tokenVersion)
		if err != nil {
			return nil, err
		}

		return &AuthTokens{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		}, nil
	} else {
		return nil, err
	}
}
