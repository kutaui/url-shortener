package handlers

import (
	"encoding/json"
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

		clicksJSON, err := json.Marshal(clicks)
		if err != nil {
			http.Error(w, "Failed to marshal clicks", http.StatusInternalServerError)
			return
		}

		_, _ = w.Write(clicksJSON)
	}
}
