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

-- name: UpdateUser :exec
UPDATE users SET password = $1 WHERE id = $2;


-- name: GetUserUrls :many
SELECT
    u.id,
    u.long_url,
    u.short_url,
    u.created_at
FROM
    urls AS u
WHERE
    u.user_id = $1;

-- name: GetUserUrlByLongUrl :one
SELECT
    id,
    long_url,
    short_url
FROM
    urls
WHERE
    long_url = $1 AND user_id = $2 LIMIT 1;

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

-- name: GetUrlByCode :one
SELECT
    id,
    long_url,
    short_url,
    created_at
FROM
    urls
WHERE
    code = $1 LIMIT 1;

-- name: GetUrlIdByCode :one
SELECT
    id
FROM
    urls
WHERE
    code = $1 LIMIT 1;


-- name: CreateUrl :one
WITH new_url AS (
    INSERT INTO urls (long_url, short_url, user_id, code)
    VALUES ($1, $2, $3, $4) RETURNING id
)
SELECT id FROM new_url;

-- name: DeleteUrl :exec
DELETE FROM urls WHERE id = $1;


-- name: GetClicksByUrlId :one
SELECT COUNT(*) FROM clicks WHERE url_id = $1 LIMIT 1;

-- name: GetClicksByUser :one
SELECT COUNT(*) FROM clicks WHERE url_id IN (SELECT id FROM urls WHERE user_id = $1);

-- name: GetClicksByUserGroupedByDate :many
SELECT
  DATE(clicks.created_at) AS date,
  COUNT(*)
FROM
  clicks
WHERE
  url_id IN (SELECT id FROM urls WHERE user_id = $1)
GROUP BY
  date
ORDER BY
  date ASC;


-- name: RecordClick :exec
INSERT INTO
    clicks (url_id)
VALUES
    ($1);