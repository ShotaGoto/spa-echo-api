-- name: ListMessages :many
SELECT * FROM messages ORDER BY created_at DESC;

-- name: CreateMessage :one
INSERT INTO messages (content) VALUES ($1) RETURNING *;

-- name: DeleteMessage :exec
DELETE FROM messages WHERE id = $1;

-- name: GetMessage :one
SELECT * FROM messages WHERE id = $1;
