package utils

import (
	rand "crypto/rand"
	"io"
	"log"
	random "math/rand"
	"net/http"
	"strings"
	"time"

	db "github.com/kutaui/url-shortener/db/sqlc"
)

func GenerateUniqueBase62(q *db.Queries, r *http.Request, length int) (string, error) {
	// to scale this up we also need to handle the case where every 5 character code is taken, find a way to programmatically increase the length or find a different way to generate unique codes

	var code string
	for {
		code = GenerateBase62(length)
		_, err := q.GetUrlByCode(r.Context(), code)
		if err != nil {
			break
		}
	}
	return code, nil
}

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

func GenerateBase62(length int) string {
	b := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		log.Fatal(err)
	}
	random.NewSource(time.Now().UnixNano())
	var result strings.Builder
	for i := 0; i < length; i++ {
		result.WriteByte(base62Chars[random.Intn(62)])
	}
	return result.String()
}
