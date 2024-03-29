CREATE TABLE urls
(
    id         BIGSERIAL PRIMARY KEY,
    long_url   VARCHAR(255) NOT NULL UNIQUE,
    short_url  VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_urls
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES users (id) ON DELETE CASCADE,
    url_id     BIGINT REFERENCES urls (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clicks
(
    id         BIGSERIAL PRIMARY KEY,
    url_id     BIGINT REFERENCES urls (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users
(
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_urls_user_id ON user_urls (user_id);

CREATE INDEX idx_user_urls_url_id ON user_urls (url_id);

CREATE INDEX idx_clicks_url_id ON clicks (url_id);


