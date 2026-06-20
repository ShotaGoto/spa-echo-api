package response

// Response は全APIレスポンスの共通ラップ形式
type Response struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Error   *Error `json:"error,omitempty"`
}

type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func OK(data any) Response {
	return Response{Success: true, Data: data}
}

func Err(code, message string) Response {
	return Response{Success: false, Error: &Error{Code: code, Message: message}}
}
