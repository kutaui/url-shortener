CREATE TABLE
    urls (
        id BIGSERIAL PRIMARY KEY,
        long_url VARCHAR(2048) NOT NULL UNIQUE,
        code VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    clicks (
        id BIGSERIAL PRIMARY KEY,
        url_id BIGINT NOT NULL REFERENCES urls (id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    users (
        id BIGSERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_clicks_url_id ON clicks (url_id);

CREATE INDEX idx_urls_code ON urls (code);

CREATE INDEX idx_urls_user_id ON urls (user_id);

CREATE INDEX idx_users_email ON users (email);