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
		utils.EnableCORS(w, r)
		w.Header().Set("Content-Type", "application/json")

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

		var userId int64
		userId, err = q.CreateUser(r.Context(), db.CreateUserParams{Email: RegisterRequest.Email, Password: RegisterRequest.Password})
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}

		token, err := utils.GenerateJWT(userId)
		if err != nil {
			http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
			return
		}

		response := Response{
			Status:  "ok",
			Message: "User created successfully",
		}
		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}

		cookie := http.Cookie{
			Name:     "token",
			Value:    token,
			Path:     "/",
			MaxAge:   3600,
			HttpOnly: false,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		}

		http.SetCookie(w, &cookie)
		_, _ = w.Write(responseJSON)
	}
}

func Login(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		utils.EnableCORS(w, r)
		w.Header().Set("Content-Type", "application/json")
	}
}
