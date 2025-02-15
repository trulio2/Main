package main

import (
	"fmt"
	"os"

	datanode "github.com/afa7789/nirvana/internal/client/dataNode"
)

func main() {
	fmt.Println("dataNode")
	brokerHost := os.Getenv("BROKER_HOST")
	brokerPort := os.Getenv("BROKER_PORT")
	brokerAddress := fmt.Sprintf("%s:%s", brokerHost, brokerPort)
	listenAddress := os.Getenv("LISTEN_ADDRESS")

	client := datanode.Create(
		brokerAddress,
		listenAddress,
	)
	client.Serve()
}
