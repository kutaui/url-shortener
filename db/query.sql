-- name: GetUserUrlsByUser :many
SELECT u.id, u.long_url, u.short_url, u.created_at
FROM user_urls AS uu
         JOIN urls AS u ON uu.url_id = u.id
WHERE uu.user_id = $1;

-- name: GetUserUrlById :one
SELECT uu.url_id, uu.user_id
FROM user_urls AS uu
WHERE uu.url_id = $1;

-- name: GetUrlById :one
SELECT id, long_url, short_url, created_at
FROM urls
WHERE id = $1;


-- name: CreateUrl :one
WITH new_url AS (
    INSERT INTO urls (long_url, short_url)
        VALUES ($1, $2)
        RETURNING id
)
INSERT INTO user_urls (user_id, url_id)
SELECT $3, id FROM new_url
RETURNING url_id;

WITH new_click AS (
    INSERT INTO clicks (url_id)
        SELECT url_id FROM user_urls
        WHERE user_id = $3 AND url_id = (SELECT id FROM new_url)
        RETURNING id
)
SELECT u.id, u.long_url, u.short_url, u.created_at, c.id AS click_id
FROM urls AS u
         JOIN user_urls AS uu ON u.id = uu.url_id
         JOIN clicks AS c ON u.id = c.url_id
WHERE uu.user_id = $3 AND u.id = (SELECT id FROM new_url);
