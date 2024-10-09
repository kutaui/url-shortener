package handlers

import (
	"fmt"
	"net/http"
	"strings"

	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/redis/go-redis/v9"
)

func Redirect(q *db.Queries, rdb *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code := r.PathValue("code")
		fmt.Printf("Redirect function called with code: %s\n", code)

		if code == "" {
			fmt.Println("Missing code")
			http.Error(w, "Missing code", http.StatusBadRequest)
			return
		}

		// Check Redis for the URL associated with the given code
		urlStr, err := rdb.Get(r.Context(), code).Result()
		if err != nil && err != redis.Nil {
			fmt.Println("Error fetching from Redis:", err)
		}

		var url db.GetUrlByCodeRow
		if err == redis.Nil {
			// URL not found in Redis, query the database
			fmt.Println("URL not found in Redis, querying database.")
			url, err = q.GetUrlByCode(r.Context(), code)
			if err != nil {
				fmt.Println("Error fetching URL from database:", err)
				http.Error(w, "Failed to get URL from database", http.StatusInternalServerError)
				return
			}

			urlStr = url.LongUrl

			// Check if the URL has more than 10 clicks
			clicks, err := q.GetClicksByUrlId(r.Context(), url.ID)
			if err != nil {
				fmt.Println("Error fetching clicks for URL:", err)
				http.Error(w, "Failed to get clicks for URL", http.StatusInternalServerError)
				return
			}
			fmt.Printf("URL has %d clicks.\n", clicks)
			if clicks > 10 {
				// Add the URL to Redis
				err = rdb.Set(r.Context(), code, url.LongUrl, 0).Err()
				if err != nil {
					fmt.Println("Error adding URL to Redis:", err)
					http.Error(w, "Failed to add URL to Redis", http.StatusInternalServerError)
					return
				}
				fmt.Println("URL added to Redis successfully.")
			}
		} else {
			// URL found in Redis, convert to db.Url struct
			url = db.GetUrlByCodeRow{
				LongUrl: urlStr,
			}

			// Query the database to get the ID
			url.ID, err = q.GetUrlIdByCode(r.Context(), code)
			if err != nil {
				fmt.Println("Error fetching URL ID from database:", err)
				http.Error(w, "Failed to get URL ID from database", http.StatusInternalServerError)
				return
			}

		}

		err = q.RecordClick(r.Context(), url.ID)
		if err != nil {
			fmt.Println("Error recording click:", err)
		}

		if !strings.HasPrefix(urlStr, "http://") && !strings.HasPrefix(urlStr, "https://") {
			urlStr = "http://" + urlStr
		}
		NotifyLinkClicked(q, url.ID, code)

		http.Redirect(w, r, urlStr, http.StatusSeeOther)
		fmt.Printf("Redirecting to URL: %s\n", urlStr)
	}
}
