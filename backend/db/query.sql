-- name: GetUserByEmail :one
SELECT
    id,
    name,
    email,
    password,
    created_at
FROM
    users
WHERE
    email = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (name,email, password) VALUES ($1, $2,$3) RETURNING id,name,email,password;

-- name: UpdateUserPassword :exec
UPDATE users SET password = $1 WHERE id = $2;


-- name: GetUserUrls :many
SELECT
    u.id,
    u.long_url,
    u.created_at,
    u.code,
    u.preview_image,
    COUNT(c.id) as click_count
FROM
    urls AS u
LEFT JOIN
    clicks AS c ON u.id = c.url_id
WHERE
    u.user_id = $1
GROUP BY
    u.id;

-- name: GetUserUrlByLongUrl :one
SELECT
    id,
    long_url
FROM
    urls
WHERE
    long_url = $1 AND user_id = $2 LIMIT 1;

-- name: GetUrlById :one
SELECT
    id,
    long_url,
    created_at,
    user_id,
    preview_image
FROM
    urls
WHERE
    id = $1 LIMIT 1;

-- name: GetUrlByCode :one
SELECT
    id,
    long_url,
    created_at,
    preview_image
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
    INSERT INTO urls (long_url,  user_id, code, preview_image)
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


-- name: GetMostClickedUrls :many
SELECT 
    u.id,
    u.long_url,
    u.code,
    u.preview_image,
    COUNT(c.id) as click_count
FROM 
    urls u
JOIN 
    clicks c ON u.id = c.url_id
WHERE 
    u.user_id = $1
GROUP BY 
    u.id
ORDER BY 
    click_count DESC
LIMIT 5;

-- name: GetClicksByUserGroupedByMonth :many
SELECT
    DATE_TRUNC('month', clicks.created_at)::timestamp AS month,
    COUNT(*) as click_count
FROM
    clicks
JOIN
    urls ON clicks.url_id = urls.id
WHERE
    urls.user_id = $1
GROUP BY
    month
ORDER BY
    month ASC;
