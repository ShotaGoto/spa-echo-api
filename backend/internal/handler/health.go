package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/shotagoto/spa-echo-api/backend/internal/response"
)

// Health godoc
// @Summary     ヘルスチェック
// @Tags        system
// @Success     200 {object} response.Response
// @Router      /health [get]
func Health(c echo.Context) error {
	return c.JSON(http.StatusOK, response.OK(map[string]string{"status": "ok"}))
}
