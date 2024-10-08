package utils

import (
	rand "crypto/rand"
	"fmt"
	"io"
	"log"
	random "math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	db "github.com/kutaui/url-shortener/db/sqlc"
)

func GenerateUniqueBase62(q *db.Queries, r *http.Request, length int) (string, error) {
	// to scale this up we also need to handle the case where every 5 character code is taken, find a way to programmatically increase the length or find a different way to generate unique codes

	var code string
	for {
		code = GenerateBase62(length)
		_, err := q.GetUrlByCode(r.Context(), code)
		if err != nil {
			break
		}
	}
	return code, nil
}

const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

func GenerateBase62(length int) string {
	b := make([]byte, length)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		log.Fatal(err)
	}
	random.NewSource(time.Now().UnixNano())
	var result strings.Builder
	for i := 0; i < length; i++ {
		result.WriteByte(base62Chars[random.Intn(62)])
	}
	return result.String()
}

func FetchPreviewImage(url string) (string, error) {
	fmt.Printf("Fetching preview image for URL: %s\n", url)

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	// Set a more common User-Agent
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.5")
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Upgrade-Insecure-Requests", "1")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error fetching URL: %v\n", err)
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Failed to fetch URL: %d %s\n", resp.StatusCode, resp.Status)
		return "", fmt.Errorf("failed to fetch URL: %d %s", resp.StatusCode, resp.Status)
	}
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		fmt.Printf("Error parsing document: %v\n", err) // Debug print
		return "", err
	}

	ogImage, _ := doc.Find(`meta[property="og:image"]`).Attr("content")
	twitterImage, _ := doc.Find(`meta[name="twitter:image"]`).Attr("content")

	if ogImage != "" {
		fmt.Printf("Found Open Graph image: %s\n", ogImage) // Debug print
		return ogImage, nil
	} else if twitterImage != "" {
		fmt.Printf("Found Twitter image: %s\n", twitterImage) // Debug print
		return twitterImage, nil
	}

	fmt.Println("No preview image found.") // Debug print
	return "", nil
}
