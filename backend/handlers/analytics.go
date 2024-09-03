package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	db "github.com/kutaui/url-shortener/db/sqlc"
)

type ClickCountByMonth struct {
	Month      string `json:"month"`
	ClickCount int64  `json:"clickCount"`
}

type MostClickedUrl struct {
	ID         int64  `json:"id"`
	LongUrl    string `json:"longUrl"`
	Code       string `json:"code"`
	ClickCount int64  `json:"clickCount"`
}

func GetMostClickedUrls(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(int64)

		urls, err := q.GetMostClickedUrls(r.Context(), userID)
		if err != nil {
			fmt.Println("Error in GetMostClickedUrls:", err)
			http.Error(w, "Failed to get most clicked URLs", http.StatusInternalServerError)
			return
		}

		// Map the data to the camelCase struct
		var response []MostClickedUrl
		for _, url := range urls {
			response = append(response, MostClickedUrl{
				ID:         url.ID,
				LongUrl:    url.LongUrl,
				Code:       url.Code,
				ClickCount: url.ClickCount,
			})
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal URLs", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseJSON)
	}
}

func GetClicksGroupedByMonth(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(int64)

		currentYear := time.Now().Year()
		clickCounts, err := q.GetClicksByUserGroupedByMonth(r.Context(), userID)
		if err != nil {
			fmt.Println("Error in GetClicksByUserGroupedByMonth:", err)
			http.Error(w, "Failed to get clicks grouped by month", http.StatusInternalServerError)
			return
		}

		var formattedClickCounts []ClickCountByMonth
		for _, cc := range clickCounts {
			monthTime := cc.Month.Time
			if monthTime.Year() == currentYear {
				formattedClickCounts = append(formattedClickCounts, ClickCountByMonth{
					Month:      monthTime.Format("2006-01"),
					ClickCount: cc.ClickCount,
				})
			}
		}

		responseJSON, err := json.Marshal(formattedClickCounts)
		if err != nil {
			http.Error(w, "Failed to marshal click counts", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseJSON)
	}
}

func GetTotalClicks(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(int64)

		totalClicks, err := q.GetClicksByUser(r.Context(), userID)
		if err != nil {
			fmt.Println("Error in GetClicksByUser:", err)
			http.Error(w, "Failed to get total clicks", http.StatusInternalServerError)
			return
		}

		response := map[string]int64{"totalClicks": totalClicks}
		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal total clicks", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseJSON)
	}
}
