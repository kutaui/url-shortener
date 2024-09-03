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

	// Group routes with middleware
	authRoutes := map[string]http.HandlerFunc{
		"GET /link":                     handlers.GetLink(q),
		"GET /links":                    handlers.GetLinks(q),
		"POST /link/create":             handlers.CreateShortenedLink(q),
		"DELETE /link/delete":           handlers.DeleteLink(q),
		"GET /analytics/mostClicked":    handlers.GetMostClickedUrls(q),
		"GET /analytics/clickedByMonth": handlers.GetClicksGroupedByMonth(q),
		"GET /analytics/totalClicks":    handlers.GetTotalClicks(q),
		"/api/link-clicked-events":      handlers.LinkClickedNotification(q),
	}

	for route, handler := range authRoutes {
		router.HandleFunc(route, utils.AuthMiddleware(handler))
	}

	// Non-auth routes
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
