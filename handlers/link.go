package handlers

import (
	rand "crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	random "math/rand"
	"net/http"
	"strings"
	"time"

	db "github.com/kutaui/url-shortener/db/sqlc"
)

type LinkRequest struct {
	Link string `json:"link"`
}

func CreateShortenedLink(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		var linkReq LinkRequest
		err = json.Unmarshal(body, &linkReq)
		if err != nil {
			http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
			return
		}

		code := generateBase62(5)

		fmt.Println(r.Host + "/" + code)

		fmt.Println(linkReq.Link)

	}
}

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

func generateBase62(length int) string {
	b := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		log.Fatal(err)
	}
	random.NewSource(time.Now().UnixNano()) // Seed the random number generator
	var result strings.Builder
	for i := 0; i < length; i++ {
		result.WriteByte(base62Chars[random.Intn(62)])
	}
	return result.String()
}
