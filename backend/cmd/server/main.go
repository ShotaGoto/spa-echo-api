// @title           spa-echo-api
// @version         1.0
// @description     React SPA + Go Echo のサンプルAPI
// @host            localhost:8080
// @BasePath        /
package main

import (
	"context"
	"errors"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/source/file"
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

func runMigrations(databaseURL string) {
	m, err := migrate.New("file://db/migrations", "pgx5://"+databaseURL[len("postgres://"):])
	if err != nil {
		log.Fatal().Err(err).Msg("failed to initialize migrations")
	}
	defer m.Close()

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Fatal().Err(err).Msg("migration failed")
	}
	log.Info().Msg("migrations applied")
}

func main() {
	_ = godotenv.Load()

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	databaseURL := os.Getenv("DATABASE_URL")

	runMigrations(databaseURL)

	conn, err := pgx.Connect(context.Background(), databaseURL)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer conn.Close(context.Background())

	queries := db.New(conn)

	e := echo.New()
	e.HideBanner = true
	e.Validator = validator.New()
	e.HTTPErrorHandler = middleware.ErrorHandler

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
