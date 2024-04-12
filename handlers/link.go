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
		userID := r.Context().Value("userID").(int64)
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

		_, err = q.GetUserUrlByLongUrl(r.Context(), db.GetUserUrlByLongUrlParams{
			LongUrl: linkReq.Link,
			UserID:  userID,
		})

		if err == nil {
			http.Error(w, "Link already exists", http.StatusBadRequest)
			return
		}

		code, err := generateUniqueBase62(q, r, 5)
		if err != nil {
			http.Error(w, "Failed to generate unique code", http.StatusInternalServerError)
			return
		}

		_, err = q.CreateUrl(r.Context(), db.CreateUrlParams{
			Code:     code,
			LongUrl:  linkReq.Link,
			ShortUrl: r.Host + "/" + code,
			UserID:   userID,
		})

		if err != nil {
			fmt.Println(err)
			http.Error(w, "Failed to create link", http.StatusInternalServerError)
			return
		}

		response := Response{
			Status:  "ok",
			Message: "Link created successfully",
		}

		responseJSON, err := json.Marshal(response)

		if err != nil {
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}
		_, _ = w.Write(responseJSON)
	}
}

func generateUniqueBase62(q *db.Queries, r *http.Request, length int) (string, error) {
	// to scale this up we also need to handle the case where every 5 character code is taken, find a way to programmatically increase the length or find a different way to generate unique codes

	var code string
	for {
		code = generateBase62(length)
		_, err := q.GetUrlByCode(r.Context(), code)
		if err != nil {
			break
		}
	}
	return code, nil
}

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

func generateBase62(length int) string {
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
