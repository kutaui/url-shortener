package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"time"

	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/utils"
)

type LinkRequest struct {
	Link       string `json:"link"`
	CustomCode string `json:"customCode"`
}

type DeleteLinkRequest struct {
	Id int64 `json:"id"`
}

type LinkResponse struct {
	ID           int64  `json:"id"`
	LongUrl      string `json:"longUrl"`
	CreatedAt    string `json:"createdAt"`
	Code         string `json:"code"`
	ClickCount   int64  `json:"clickCount"`
	PreviewImage string `json:"previewImage"`
}

func GetLinks(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("userID").(int64)

		links, err := q.GetUserUrls(r.Context(), userID)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "Failed to get links", http.StatusInternalServerError)
			return
		}

		var linkResponses []LinkResponse
		for _, link := range links {
			linkResponses = append(linkResponses, LinkResponse{
				ID:           link.ID,
				LongUrl:      link.LongUrl,
				CreatedAt:    link.CreatedAt.Time.Format(time.RFC3339),
				Code:         link.Code,
				ClickCount:   link.ClickCount,
				PreviewImage: link.PreviewImage.String,
			})
		}

		linksJSON, err := json.Marshal(linkResponses)
		if err != nil {
			http.Error(w, "Failed to marshal links", http.StatusInternalServerError)
			return
		}

		_, _ = w.Write(linksJSON)
	}
}

func GetLink(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.URL.Query().Get("id")

		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		link, err := q.GetUrlById(r.Context(), id)
		if err != nil {
			if err.Error() == "no rows in result set" {
				http.Error(w, "Link not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Failed to get link", http.StatusInternalServerError)
			return
		}

		linkJSON, err := json.Marshal(link)
		if err != nil {
			http.Error(w, "Failed to marshal link", http.StatusInternalServerError)
			return
		}

		_, _ = w.Write(linkJSON)
	}
}

func DeleteLink(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := r.URL.Query().Get("id")

		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		_, err = q.GetUrlById(r.Context(), id)
		if err != nil {
			// maybe a better way to check if the URL doesn't exist ?
			if err.Error() == "no rows in result set" {
				http.Error(w, "Link not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Failed to get link", http.StatusInternalServerError)
			return
		}

		err = q.DeleteUrl(r.Context(), id)
		if err != nil {
			http.Error(w, "Failed to delete link", http.StatusInternalServerError)
			return
		}

		response := Response{
			Status:  "ok",
			Message: "Link deleted successfully",
		}

		responseJSON, err := json.Marshal(response)

		if err != nil {
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}
		_, _ = w.Write(responseJSON)
	}
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

		// Check if link already exists for the user
		asd, err := q.GetUserUrlByLongUrl(r.Context(), db.GetUserUrlByLongUrlParams{
			LongUrl: linkReq.Link,
			UserID:  userID,
		})

		if err == nil {
			fmt.Println(asd)
			http.Error(w, "Link already exists", http.StatusBadRequest)
			return
		}

		var code string

		if linkReq.CustomCode != "" {
			if len(linkReq.CustomCode) > 16 {
				http.Error(w, "Maximum length for custom code is 16", http.StatusBadRequest)
				return
			}

			_, err = q.GetUrlByCode(r.Context(), linkReq.CustomCode)
			if err == nil {
				http.Error(w, "Custom code already exists", http.StatusBadRequest)
				return
			}
			code = linkReq.CustomCode
		} else {
			code, err = utils.GenerateUniqueBase62(q, r, 5)
			if err != nil {
				http.Error(w, "Failed to generate unique code", http.StatusInternalServerError)
				return
			}
		}

		// Fetch the preview image metadata
		previewImage, err := utils.FetchPreviewImage(linkReq.Link)
		if err != nil {
			fmt.Println("Failed to fetch preview image:", err)
			previewImage = "" // Set to empty string if fetching fails
		}

		// Save the shortened link with the preview image
		_, err = q.CreateUrl(r.Context(), db.CreateUrlParams{
			Code:         code,
			LongUrl:      linkReq.Link,
			UserID:       userID,
			PreviewImage: pgtype.Text{String: previewImage, Valid: true},
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

		fmt.Printf("Link created successfully. Code: %s, LongUrl: %s, PreviewImage: %s, UserID: %d\n", code, linkReq.Link, previewImage, userID)

		_, _ = w.Write(responseJSON)
	}
}
