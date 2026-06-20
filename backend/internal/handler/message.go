package handler

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/echo/v4"
	"github.com/shotagoto/spa-echo-api/backend/internal/db"
	"github.com/shotagoto/spa-echo-api/backend/internal/response"
)

type MessageHandler struct {
	q *db.Queries
}

func NewMessageHandler(q *db.Queries) *MessageHandler {
	return &MessageHandler{q: q}
}

type CreateMessageRequest struct {
	Content string `json:"content" validate:"required,min=1,max=500"`
}

// List godoc
// @Summary     メッセージ一覧を取得
// @Tags        messages
// @Produce     json
// @Success     200 {object} response.Response
// @Failure     500 {object} response.Response
// @Router      /api/v1/messages [get]
func (h *MessageHandler) List(c echo.Context) error {
	messages, err := h.q.ListMessages(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.Err("DB_ERROR", err.Error()))
	}
	return c.JSON(http.StatusOK, response.OK(messages))
}

// Create godoc
// @Summary     メッセージを投稿
// @Tags        messages
// @Accept      json
// @Produce     json
// @Param       body body CreateMessageRequest true "メッセージ内容"
// @Success     201 {object} response.Response
// @Failure     400 {object} response.Response
// @Failure     500 {object} response.Response
// @Router      /api/v1/messages [post]
func (h *MessageHandler) Create(c echo.Context) error {
	var req CreateMessageRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, response.Err("BAD_REQUEST", err.Error()))
	}
	if err := c.Validate(&req); err != nil {
		return c.JSON(http.StatusBadRequest, response.Err("VALIDATION_ERROR", err.Error()))
	}
	msg, err := h.q.CreateMessage(c.Request().Context(), req.Content)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.Err("DB_ERROR", err.Error()))
	}
	return c.JSON(http.StatusCreated, response.OK(msg))
}

// Delete godoc
// @Summary     メッセージを削除
// @Tags        messages
// @Produce     json
// @Param       id path string true "メッセージID (UUID)"
// @Success     200 {object} response.Response
// @Failure     400 {object} response.Response
// @Failure     500 {object} response.Response
// @Router      /api/v1/messages/{id} [delete]
func (h *MessageHandler) Delete(c echo.Context) error {
	var id pgtype.UUID
	if err := id.Scan(c.Param("id")); err != nil {
		return c.JSON(http.StatusBadRequest, response.Err("INVALID_ID", "invalid UUID"))
	}
	if err := h.q.DeleteMessage(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, response.Err("DB_ERROR", err.Error()))
	}
	return c.JSON(http.StatusOK, response.OK(nil))
}
