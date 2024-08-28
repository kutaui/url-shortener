package tests

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/handlers"
)

func TestLogin(t *testing.T) {
	// Load the environment variables from the .env file in the backend directory
    if err := godotenv.Load("../.env"); err != nil {
		t.Fatalf("Error loading .env file: %v", err)
	}

	t.Run("successful login returns user details and sets a cookie", func(t *testing.T) {
		databaseURL := os.Getenv("DATABASE_URL")
		if databaseURL == "" {
			t.Fatalf("DATABASE_URL not set")
		}

		conn, err := pgx.Connect(context.Background(), databaseURL)
		if err != nil {
			t.Fatalf("Unable to connect to database: %v", err)
		}
		defer conn.Close(context.Background())

		q := db.New(conn)

		loginPayload := handlers.AuthRequest{
			Email:    "a@a",
			Password: "123",
		}
		payloadBytes, err := json.Marshal(loginPayload)
		if err != nil {
			t.Fatalf("Failed to marshal payload: %v", err)
		}
		requestBody := bytes.NewReader(payloadBytes)

		request, _ := http.NewRequest(http.MethodPost, "/login", requestBody)
		request.Header.Set("Content-Type", "application/json")
		response := httptest.NewRecorder()

		handler := handlers.Login(q)
		handler.ServeHTTP(response, request)

		if response.Code != http.StatusOK {
			t.Errorf("expected status %v; got %v", http.StatusOK, response.Code)
		}

		var responseBody handlers.Response
		err = json.Unmarshal(response.Body.Bytes(), &responseBody)
		if err != nil {
			t.Fatalf("Failed to unmarshal response body: %v", err)
		}
		if responseBody.Status != "ok" {
			t.Errorf("expected status 'ok'; got %v", responseBody.Status)
		}
	})
}
