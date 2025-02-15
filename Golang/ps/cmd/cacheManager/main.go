package main

import (
	"fmt"
	"os"

	cachemanager "github.com/afa7789/nirvana/internal/client/cacheManager"
)

func main() {
	fmt.Println("cacheManager")
	brokerHost := os.Getenv("BROKER_HOST")
	brokerPort := os.Getenv("BROKER_PORT")
	brokerAddress := fmt.Sprintf("%s:%s", brokerHost, brokerPort)
	listenAddress := os.Getenv("LISTEN_ADDRESS")
	client := cachemanager.Create(
		brokerAddress,
		listenAddress,
	)
	client.Serve()
}
