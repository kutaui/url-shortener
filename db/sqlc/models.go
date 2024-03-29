// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package db

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Click struct {
	ID        int64
	UrlID     pgtype.Int8
	CreatedAt pgtype.Timestamp
}

type Url struct {
	ID        int64
	LongUrl   string
	ShortUrl  string
	CreatedAt pgtype.Timestamp
}

type User struct {
	ID        int64
	Email     string
	Password  string
	CreatedAt pgtype.Timestamp
}

type UserUrl struct {
	ID        int64
	UserID    pgtype.Int8
	UrlID     pgtype.Int8
	CreatedAt pgtype.Timestamp
}