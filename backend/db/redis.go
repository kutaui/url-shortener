package db

import (
	"github.com/redis/go-redis/v9"
	"os"
)

func RedisClient() *redis.Client {
	url := os.Getenv("REDIS_URL")
	opts, err := redis.ParseURL(url)
	if err != nil {
		panic(err)
	}

	return redis.NewClient(opts)
}
