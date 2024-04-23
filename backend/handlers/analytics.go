package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	db "github.com/kutaui/url-shortener/db/sqlc"
)

func GetLinkClicks(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(int64)

		clicks, err := q.GetClicksByUser(r.Context(), userID)
		if err != nil {
			http.Error(w, "Failed to get clicks", http.StatusInternalServerError)
			return
		}

		response := map[string]int64{"totalClicks": clicks}
		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal clicks", http.StatusInternalServerError)
			return
		}

		_, _ = w.Write(responseJSON)
	}
}

func GetLinkClicksGroupedByDate(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(int64)

		clickCounts, err := q.GetClicksByUserGroupedByDate(r.Context(), userID)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Failed to get clicks", http.StatusInternalServerError)
			return
		}

		responseJSON, err := json.Marshal(clickCounts)
		if err != nil {
			http.Error(w, "Failed to marshal clicks", http.StatusInternalServerError)
			return
		}

		_, _ = w.Write(responseJSON)
	}
}
