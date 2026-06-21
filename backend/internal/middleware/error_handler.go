package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
	"github.com/shotagoto/spa-echo-api/backend/internal/response"
)

// ErrorHandler は Echo のカスタムエラーハンドラ。
// 5xx はスタックトレース付きで ERROR ログを出力し、共通レスポンス形式で返す。
func ErrorHandler(err error, c echo.Context) {
	code := http.StatusInternalServerError
	msg := "internal server error"

	var he *echo.HTTPError
	if ok := errorAs(err, &he); ok {
		code = he.Code
		if m, ok := he.Message.(string); ok {
			msg = m
		}
	}

	event := log.Error().Err(err).
		Str("method", c.Request().Method).
		Str("uri", c.Request().RequestURI).
		Int("status", code)

	if code >= 500 {
		event.Stack().Msg("server error")
	} else {
		event.Msg("client error")
	}

	if !c.Response().Committed {
		_ = c.JSON(code, response.Err(http.StatusText(code), msg))
	}
}

func errorAs(err error, target **echo.HTTPError) bool {
	e, ok := err.(*echo.HTTPError)
	if ok {
		*target = e
	}
	return ok
}
