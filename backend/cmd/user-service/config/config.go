package config

import (
	"os"
)

type Config struct {
	AccessTokenKey  []byte
	RefreshTokenKey []byte
}

func InitConfig() *Config {
	config := &Config{
		AccessTokenKey:  []byte(os.Getenv("ACCESS_TOKEN_KEY")),
		RefreshTokenKey: []byte(os.Getenv("REFRESH_TOKEN_KEY")),
	}

	return config
}

var Envs = InitConfig()
