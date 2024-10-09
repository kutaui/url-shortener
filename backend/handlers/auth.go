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
		fmt.Println("Register function called.")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			fmt.Println("Failed to read request body:", err)
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		var authRequest AuthRequest
		err = json.Unmarshal(body, &authRequest)
		if err != nil {
			fmt.Println("Failed to decode JSON:", err)
			http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
			return
		}

		fmt.Printf("Registering user with email: %s\n", authRequest.Email)

		_, err = mail.ParseAddress(authRequest.Email)
		if err != nil {
			fmt.Println("Invalid email address:", err)
			http.Error(w, "Invalid email address", http.StatusBadRequest)
			return
		}

		_, err = q.GetUserByEmail(r.Context(), authRequest.Email)
		if err == nil {
			fmt.Println("Email already exists:", authRequest.Email)
			http.Error(w, "Email already exists", http.StatusBadRequest)
			return
		}

		hashedPassword, err := utils.HashPassword(authRequest.Password)
		if err != nil {
			fmt.Println("Failed to hash password:", err)
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		authRequest.Password = string(hashedPassword)

		var user db.CreateUserRow
		user, err = q.CreateUser(r.Context(), db.CreateUserParams{Name: authRequest.Name, Email: authRequest.Email, Password: authRequest.Password})
		if err != nil {
			fmt.Println("Failed to create user:", err)
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		fmt.Printf("User created successfully with ID: %d\n", user.ID)

		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			fmt.Println("Failed to generate JWT:", err)
			http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
			return
		}

		response := Response{
			Status: "ok",
			User: UserResponse{
				ID:    user.ID,
				Email: user.Email,
				Name:  user.Name,
			},
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			fmt.Println("Failed to marshal response:", err)
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
		fmt.Println("Registration successful, response sent.")
	}
}

func Login(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Login function called.")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			fmt.Println("Failed to read request body:", err)
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		var authRequest AuthRequest
		err = json.Unmarshal(body, &authRequest)
		if err != nil {
			fmt.Println("Failed to decode JSON:", err)
			http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
			return
		}

		fmt.Printf("Logging in user with email: %s\n", authRequest.Email)

		_, err = mail.ParseAddress(authRequest.Email)
		if err != nil {
			fmt.Println("Invalid email address:", err)
			http.Error(w, "Invalid email address", http.StatusBadRequest)
			return
		}

		var user db.GetUserByEmailRow
		user, err = q.GetUserByEmail(r.Context(), authRequest.Email)
		if err != nil {
			fmt.Println("User not found:", err)
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		if !utils.CheckPasswordHash(authRequest.Password, user.Password) {
			fmt.Println("Invalid credentials for email:", authRequest.Email)
			http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
			return
		}

		token, err := utils.GenerateJWT(user.ID)
		if err != nil {
			fmt.Println("Failed to generate JWT:", err)
			http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
			return
		}

		response := Response{
			Status: "ok",
			User: UserResponse{
				ID:    user.ID,
				Email: user.Email,
				Name:  user.Name,
			},
		}

		responseJSON, err := json.Marshal(response)
		if err != nil {
			fmt.Println("Failed to marshal response:", err)
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
		fmt.Println("Login successful, response sent.")
	}
}

func Logout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Logout function called.")

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
			fmt.Println("Failed to marshal response:", err)
			http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(responseJSON)
		fmt.Println("Logout successful, response sent.")
	}
}
