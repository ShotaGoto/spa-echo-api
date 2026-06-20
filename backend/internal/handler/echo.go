package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/shotagoto/spa-echo-api/backend/internal/response"
)

type EchoRequest struct {
	Message string `json:"message"`
}

// EchoMessage godoc
// @Summary     メッセージをエコーする
// @Tags        echo
// @Accept      json
// @Produce     json
// @Param       body body EchoRequest true "メッセージ"
// @Success     200 {object} response.Response
// @Router      /api/v1/echo [post]
func EchoMessage(c echo.Context) error {
	var req EchoRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, response.Err("BAD_REQUEST", err.Error()))
	}
	if req.Message == "" {
		return c.JSON(http.StatusBadRequest, response.Err("BAD_REQUEST", "message is required"))
	}
	return c.JSON(http.StatusOK, response.OK(map[string]string{"message": req.Message}))
}
