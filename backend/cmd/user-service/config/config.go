package config

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
)

type Config struct {
	AccessTokenPrivateKey *rsa.PrivateKey
	RefreshTokenKey       []byte
}

func InitConfig() *Config {
	privateKeyPEM := []byte(os.Getenv("ACCESS_TOKEN_KEY"))

	block, _ := pem.Decode(privateKeyPEM)
	if block == nil {
		panic("failed to decode PEM block")
	}

	privateKey, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		fmt.Println("failed to parse private key:", err)
		panic("failed to parse private key")
	}

	config := &Config{
		AccessTokenPrivateKey: privateKey.(*rsa.PrivateKey),
		RefreshTokenKey:       []byte(os.Getenv("REFRESH_TOKEN_KEY")),
	}

	return config
}

var Envs = InitConfig()
