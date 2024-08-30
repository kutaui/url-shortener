package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
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
		userID := r.Context().Value("userID").(int64)

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
		w.Header().Set("Access-Control-Allow-Origin", "*")

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

		// Send an initial message to confirm the connection
		fmt.Fprintf(w, "data: {\"connected\": true}\n\n")
		flusher.Flush()

		for {
			select {
			case event, ok := <-client.events:
				if !ok {
					return
				}
				if err := writeEvent(w, flusher, event); err != nil {
					log.Printf("Error writing event: %v", err)
					return
				}
			case <-r.Context().Done():
				return
			case <-time.After(30 * time.Second):
				// Send a keep-alive message every 30 seconds
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
