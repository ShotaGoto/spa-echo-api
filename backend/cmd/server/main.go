package main

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/shotagoto/spa-echo-api/backend/internal/handler"
	"github.com/shotagoto/spa-echo-api/backend/internal/middleware"
)

func main() {
	_ = godotenv.Load()

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	e := echo.New()
	e.HideBanner = true

	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
	}))
	e.Use(middleware.Logger())

	e.GET("/health", handler.Health)

	api := e.Group("/api/v1")
	api.POST("/echo", handler.EchoMessage)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Info().Str("port", port).Msg("starting server")
	if err := e.Start(":" + port); err != nil {
		log.Fatal().Err(err).Msg("server stopped")
	}
}
