package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	db "github.com/kutaui/url-shortener/db/sqlc"
	"github.com/kutaui/url-shortener/handlers"
	"github.com/kutaui/url-shortener/utils"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func main() {
	godotenv.Load()

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	q := db.New(dbpool)

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

	router.HandleFunc("GET /analytics/mostClicked", utils.AuthMiddleware(handlers.GetMostClickedUrls(q)))
	router.HandleFunc("GET /analytics/clickedByMonth", utils.AuthMiddleware(handlers.GetClicksGroupedByMonth(q)))
	router.HandleFunc("GET /analytics/totalClicks", utils.AuthMiddleware(handlers.GetTotalClicks(q)))

	router.HandleFunc("POST /register", handlers.Register(q))
	router.HandleFunc("POST /login", handlers.Login(q))
	router.HandleFunc("GET /{code}", handlers.Redirect(q, rdb))

	router.HandleFunc("/api/link-clicked-events", utils.AuthMiddleware(handlers.LinkClickedNotification(q)))

	server := &http.Server{
		Addr:    ":8080",
		Handler: utils.CorsMiddleware(router),
	}

	log.Println("Server is running on port 8080")
	server.ListenAndServe()
}
