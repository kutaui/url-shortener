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

type UserResponse struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type Response struct {
	Status  string       `json:"status"`
	User    UserResponse `json:"user,omitempty"`
	Message string       `json:"message"`
}

type AuthRequest struct {
	Name     string `json:"name"`
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

		var AuthRequest AuthRequest
		err = json.Unmarshal(body, &AuthRequest)
		if err != nil {
			http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
			return
		}

		_, err = mail.ParseAddress(AuthRequest.Email)
		if err != nil {
			http.Error(w, "Invalid email address", http.StatusBadRequest)
			return
		}

		_, err = q.GetUserByEmail(r.Context(), AuthRequest.Email)
		if err == nil {
			http.Error(w, "Email already exists", http.StatusBadRequest)
			return
		}

		hashedPassword, err := utils.HashPassword(AuthRequest.Password)
		if err != nil {
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		AuthRequest.Password = string(hashedPassword)

		var user db.CreateUserRow
		user, err = q.CreateUser(r.Context(), db.CreateUserParams{Name: AuthRequest.Name, Email: AuthRequest.Email, Password: AuthRequest.Password})
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}

		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
			return
		}

		userResponse := UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		}

		response := Response{
			Status: "ok",
			User:   userResponse,
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

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		var AuthRequest AuthRequest
		err = json.Unmarshal(body, &AuthRequest)
		if err != nil {
			http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
			return
		}

		_, err = mail.ParseAddress(AuthRequest.Email)
		if err != nil {
			http.Error(w, "Invalid email address", http.StatusBadRequest)
			return
		}

		var user db.GetUserByEmailRow
		user, err = q.GetUserByEmail(r.Context(), AuthRequest.Email)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		if !utils.CheckPasswordHash(AuthRequest.Password, user.Password) {
			http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
			return
		}

		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
			return
		}

		userResponse := UserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		}

		response := Response{
			Status: "ok",
			User:   userResponse,
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

func Logout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie := http.Cookie{
			Name:     "token",
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: false,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		}

		http.SetCookie(w, &cookie)

		response := Response{
			Status:  "ok",
			Message: "Logged out successfully",
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(responseJSON)
	}
}
