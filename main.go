package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/handlers"
	"github.com/kutaui/url-shortener/utils"
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

	router.HandleFunc("POST /link/create", utils.AuthMiddleware(handlers.CreateShortenedLink(q)))
	router.HandleFunc("POST /register", handlers.Register(q))
	router.HandleFunc("POST /login", handlers.Login(q))

	router.HandleFunc("GET /ping", utils.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		userID := fmt.Sprintf("%v", r.Context().Value("userID"))
		fmt.Fprintf(w, "pong, userID: %s", userID)

	}))

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("Server is running on port 8080")
	server.ListenAndServe()
}
