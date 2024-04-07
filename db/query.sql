-- name: GetUserByEmail :one
SELECT
    id,
    email,
    password,
    created_at
FROM
    users
WHERE
    email = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id;


-- name: GetUserUrlsByUser :one
SELECT
    u.id,
    u.long_url,
    u.short_url,
    u.created_at
FROM
    urls AS u
WHERE
    u.user_id = $1 LIMIT 1;

-- name: GetUrlById :one
SELECT
    id,
    long_url,
    short_url,
    created_at
FROM
    urls
WHERE
    id = $1 LIMIT 1;

-- name: CreateUrl :one
WITH new_url AS (
    INSERT INTO urls (long_url, short_url, user_id)
    VALUES ($1, $2, $3) RETURNING id
)
SELECT id FROM new_url;


-- name: GetClicksByUrlId :one
SELECT COUNT(*) FROM clicks WHERE url_id = $1;


-- name: RecordClick :exec
INSERT INTO
    clicks (url_id)
VALUES
    ($1);