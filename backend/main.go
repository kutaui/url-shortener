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
	"github.com/redis/go-redis/v9"
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

	opts, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		panic(err)
	}

	rdb := redis.NewClient(opts)

	// find a native way for authmiddleware or route grouping

	router.HandleFunc("GET /link", utils.AuthMiddleware(handlers.GetLink(q)))
	router.HandleFunc("GET /links", utils.AuthMiddleware(handlers.GetLinks(q)))
	router.HandleFunc("POST /link/create", utils.AuthMiddleware(handlers.CreateShortenedLink(q)))
	router.HandleFunc("DELETE /link/delete", utils.AuthMiddleware(handlers.DeleteLink(q)))

	router.HandleFunc("GET /analytics", utils.AuthMiddleware(handlers.GetLinkClicks(q)))
	router.HandleFunc("GET /analytics/byDate", utils.AuthMiddleware(handlers.GetLinkClicksGroupedByDate(q)))

	router.HandleFunc("POST /register", handlers.Register(q))
	router.HandleFunc("POST /login", handlers.Login(q))
	router.HandleFunc("GET /{code}", handlers.Redirect(q, rdb))

	server := &http.Server{
		Addr:    ":8080",
		Handler: utils.CorsMiddleware(router),
	}

	log.Println("Server is running on port 8080")
	server.ListenAndServe()
}
