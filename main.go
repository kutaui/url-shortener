package main

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/handlers"
	"log"
	"net/http"
	"os"
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

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("Server is running on port 8080")
	server.ListenAndServe()
}
