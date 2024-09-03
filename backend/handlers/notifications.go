package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	db "github.com/kutaui/url-shortener/db/sqlc"
)

type LinkClickedEvent struct {
	LinkID int64  `json:"linkId"`
	Code   string `json:"code"`
}

type Client struct {
	id     int
	userID int64
	events chan LinkClickedEvent
}

var (
	clients    = make(map[int]Client)
	clientsMux sync.RWMutex
	nextID     = 1
)

const (
	writeTimeout      = 10 * time.Second
	channelBufferSize = 100
)

func LinkClickedNotification(q *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDValue := r.Context().Value("userID")
		if userIDValue == nil {
			log.Println("userID not found in context")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userID, ok := userIDValue.(int64)
		if !ok {
			log.Printf("userID has unexpected type: %T", userIDValue)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		clientsMux.Lock()
		clientID := nextID
		nextID++
		client := Client{
			id:     clientID,
			userID: userID,
			events: make(chan LinkClickedEvent, channelBufferSize),
		}
		clients[clientID] = client
		clientsMux.Unlock()

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))

		flusher, ok := w.(http.Flusher)
		if !ok {
			http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
			return
		}

		defer func() {
			clientsMux.Lock()
			delete(clients, clientID)
			clientsMux.Unlock()
			close(client.events)
		}()

		fmt.Fprintf(w, "data: {\"connected\": true}\n\n")
		flusher.Flush()

		for {
			select {
			case event, ok := <-client.events:
				if !ok {
					log.Printf("Client %d's channel is closed", client.id)
					return
				}
				if err := writeEvent(w, flusher, event); err != nil {
					log.Printf("Error writing event: %v", err)
					return
				}
			case <-r.Context().Done():
				return
			case <-time.After(30 * time.Second):
				fmt.Fprintf(w, ": keep-alive\n\n")
				flusher.Flush()
			}
		}
	}
}

func writeEvent(w http.ResponseWriter, flusher http.Flusher, event LinkClickedEvent) error {
	data, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("error marshaling event: %w", err)
	}

	writeTimer := time.NewTimer(writeTimeout)
	defer writeTimer.Stop()

	done := make(chan bool)
	go func() {
		fmt.Fprintf(w, "data: %s\n\n", data)
		flusher.Flush()
		done <- true
	}()

	select {
	case <-done:
		return nil
	case <-writeTimer.C:
		return fmt.Errorf("write timeout")
	}
}

func NotifyLinkClicked(q *db.Queries, linkID int64, code string) {
	event := LinkClickedEvent{
		LinkID: linkID,
		Code:   code,
	}

	clientsMux.RLock()
	defer clientsMux.RUnlock()

	link, err := q.GetUrlById(context.Background(), linkID)
	if err != nil {
		log.Printf("Error querying link: %v", err)
		return
	}

	for _, client := range clients {
		if client.userID == link.UserID {
			select {
			case client.events <- event:
			default:
				log.Printf("Client %d's channel is full, skipping notification", client.id)
			}
		}
	}
}
