package main

import (
	"github.com/kutaui/url-shortener/db"
	"log"
	"net/http"
)

func main() {
	db.RedisClient()

	router := http.NewServeMux()

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("Server is running on port 8080")
	server.ListenAndServe()
}
