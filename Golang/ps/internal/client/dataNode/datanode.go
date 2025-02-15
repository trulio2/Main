package datanode

import (
	"fmt"
	"time"

	"github.com/afa7789/nirvana/internal/domain"
	"github.com/afa7789/nirvana/internal/uuid"
	"github.com/afa7789/nirvana/pkg/pubsub"
	"golang.org/x/exp/rand"
)

// Client represents a data node client.
type Client struct {
	broker *pubsub.Broker
}

// Create creates a new data node client.
func Create(
	brokerAddress,
	listenAddress string,
) *Client {
	// Add your initialization code here
	return &Client{
		broker: pubsub.NewBroker(brokerAddress, listenAddress),
	}
}

// startTCPServer starts the TCP server for receiving messages.
func (c *Client) startTCPServer() {
	if err := c.broker.StartTCPServerWithHandler(c.handleMessage); err != nil {
		fmt.Println("Error starting TCP server:", err)
	}
}

// subscribeToCacheManager subscribes to messages from the cache manager.
func (c *Client) subscribeToCacheManager() {
	// err := c.broker.SubscribeToTopic("data", c.handleMessage)
	err := c.broker.SubscribeToTopic("data")
	if err != nil {
		fmt.Println("Failed to subscribe to Cache Manager:", err)
	}
}

// handleMessage handles incoming messages.
func (c *Client) handleMessage(msg string) {
	msgPayload, err := domain.PayloadFromString(msg)
	if err != nil {
		fmt.Println("Error on reading payload:", err)
		return
	}

	if msgPayload.User != "Data Node" {
		fmt.Println("Data Node received:", msg)

		KeyResponse, err := domain.KResponseFromString(msgPayload.Message)
		if err != nil {
			fmt.Println("Error on reading KeyRequest:", err)
			return
		}

		fmt.Println("Response ID:", KeyResponse.RequestID)
		fmt.Println("Response Key:", KeyResponse.Key)
		fmt.Println("Response Data:", KeyResponse.Data)
	}
}

// startPublishing periodically publishes messages based on random `READ` or `WRITE` requests.
func (c *Client) startPublishing() {
	go func() {
		for {
			// Generate UUID for request ID as string
			requestID, err := uuid.GenerateUUID()
			if err != nil {
				fmt.Println("Failed to generate UUID:", err)
				continue
			}

			// Generate a random number to decide READ or WRITE
			if rand.Intn(2) == 0 { // If the number is even
				// Create a READ key request
				request := domain.KeyRequest{
					Key:       "some_key",
					Method:    "READ",
					RequestID: requestID,
				}
				// c.handleReadRequest(request)
				c.publishRequest(request)
			} else { // If the number is odd
				// Create a WRITE key request
				request := domain.KeyRequest{
					Key:       "some_key",
					Method:    "WRITE",
					Data:      "New data available", // Data to be written
					RequestID: requestID,
				}
				c.publishRequest(request)
			}

			// Sleep for 5 seconds before the next iteration
			time.Sleep(5 * time.Second)
		}
	}()
}

func (c *Client) publishRequest(request domain.KeyRequest) {
	payload := domain.MessagePayload{
		User:    "Data Node",
		Message: request.ToString(),
	}
	err := c.broker.PublishMessage("data", payload.ToString())
	if err != nil {
		fmt.Println("Failed to publish message:", err)
	}
}

// Serve starts serving the data node client.
func (c *Client) Serve() {
	// Add your serve logic here
	fmt.Println("Data node client is serving...")

	// Start TCP server for receiving messages
	go c.startTCPServer()
	go c.subscribeToCacheManager() // subscribe to cache manager
	go c.startPublishing()         // start publishing messages every 5 seconds.

	// Keep the program running
	select {}
}
