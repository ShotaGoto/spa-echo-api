// @title           spa-echo-api
// @version         1.0
// @description     React SPA + Go Echo のサンプルAPI
// @host            localhost:8080
// @BasePath        /
package main

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/shotagoto/spa-echo-api/backend/internal/db"
	"github.com/shotagoto/spa-echo-api/backend/internal/handler"
	"github.com/shotagoto/spa-echo-api/backend/internal/middleware"
	"github.com/shotagoto/spa-echo-api/backend/internal/validator"
	echoSwagger "github.com/swaggo/echo-swagger"

	_ "github.com/shotagoto/spa-echo-api/backend/docs"
)

func main() {
	_ = godotenv.Load()

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer conn.Close(context.Background())

	queries := db.New(conn)

	e := echo.New()
	e.HideBanner = true
	e.Validator = validator.New()

	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
	}))
	e.Use(middleware.Logger())

	e.GET("/health", handler.Health)
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	api := e.Group("/api/v1")
	api.POST("/echo", handler.EchoMessage)

	msgHandler := handler.NewMessageHandler(queries)
	api.GET("/messages", msgHandler.List)
	api.POST("/messages", msgHandler.Create)
	api.DELETE("/messages/:id", msgHandler.Delete)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Info().Str("port", port).Msg("starting server")
	if err := e.Start(":" + port); err != nil {
		log.Fatal().Err(err).Msg("server stopped")
	}
}
