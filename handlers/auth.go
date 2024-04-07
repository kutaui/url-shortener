package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/utils"
)

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		var RegisterRequest RegisterRequest
		err = json.Unmarshal(body, &RegisterRequest)
		if err != nil {
			http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
			return
		}

		fmt.Println(RegisterRequest.Email)
		fmt.Println(RegisterRequest.Password)
		fmt.Println(utils.GenerateJWT(1))
		fmt.Println(utils.VerifyJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTI0OTk1NTksInVzZXJJZCI6MX0.-wV7dbMD6miXfNsfTQ0NHdLYvsJA1a2sJMsLdRQ-VY8"))
	}
}
