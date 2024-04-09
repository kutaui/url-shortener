package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/kutaui/url-shortener/utils"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/handlers"
)

var ctx = context.Background()

func main() {
	godotenv.Load()

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	defer conn.Close(context.Background())

	q := db.New(conn)
	router := http.NewServeMux()

	router.HandleFunc("POST /link/create", handlers.CreateShortenedLink(q))
	router.HandleFunc("POST /register", handlers.Register(q))
	router.HandleFunc("POST /login", handlers.Login(q))

	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		utils.EnableCORS(w, r)
		w.Header().Set("Content-Type", "application/json")

		jwtToken, err := utils.GenerateJWT(1)
		if err != nil {
			http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
			return
		}
		cookie := http.Cookie{
			Name:     "token",
			Value:    jwtToken,
			Path:     "/",
			MaxAge:   3600,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteLaxMode,
		}

		http.SetCookie(w, &cookie)

	})

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("Server is running on port 8080")
	server.ListenAndServe()
}
