package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/mail"

	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/utils"
)

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

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

		_, err = mail.ParseAddress(RegisterRequest.Email)
		if err != nil {
			http.Error(w, "Invalid email address", http.StatusBadRequest)
			return
		}

		_, err = q.GetUserByEmail(r.Context(), RegisterRequest.Email)
		if err == nil {
			http.Error(w, "User already exists", http.StatusBadRequest)
			return
		}

		hashedPassword, err := utils.HashPassword(RegisterRequest.Password)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		RegisterRequest.Password = string(hashedPassword)

		_, err = q.CreateUser(r.Context(), db.CreateUserParams(RegisterRequest))
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		response := Response{
			Status:  "ok",
			Message: "User created successfully",
		}
		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}

		_, _ = w.Write(responseJSON)
	}
}
