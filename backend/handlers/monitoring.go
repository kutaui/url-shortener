package handlers

import (
	"encoding/json"
	"net/http"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	jsonResponse := map[string]string{"status": "OK"}
	json.NewEncoder(w).Encode(jsonResponse)
}
