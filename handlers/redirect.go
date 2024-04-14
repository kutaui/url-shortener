package handlers

import (
	"fmt"
	"net/http"
	"strings"

	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/utils"
	"github.com/redis/go-redis/v9"
)

func Redirect(q *db.Queries, rdb *redis.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		utils.EnableCORS(w, r)
		code := r.PathValue("code")
		if code == "" {
			fmt.Println("Missing code")
			http.Error(w, "Missing code", http.StatusBadRequest)
			return
		}

		url, err := q.GetUrlByCode(r.Context(), code)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Failed to get URL", http.StatusInternalServerError)
			return
		}

		err = q.RecordClick(r.Context(), url.ID)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Failed to record click", http.StatusInternalServerError)
			return
		}

		urlStr := url.LongUrl
		if !strings.HasPrefix(urlStr, "http://") && !strings.HasPrefix(urlStr, "https://") {
			urlStr = "http://" + urlStr
		}
		http.Redirect(w, r, urlStr, http.StatusSeeOther)
	}
}
