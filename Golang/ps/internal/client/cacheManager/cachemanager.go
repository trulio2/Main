package cachemanager

import (
	"fmt"
	"time"

	"github.com/afa7789/nirvana/internal/domain"
	"github.com/afa7789/nirvana/pkg/pubsub"
)

// Client represents a cache manager client.
type Client struct {
	broker *pubsub.Broker
	keyMap map[string]string
}

// Create creates a new cache manager client.
func Create(
	brokerAddress,
	listenAddress string,
) *Client {
	// Add your initialization code here
	return &Client{
		broker: pubsub.NewBroker(brokerAddress, listenAddress),
		keyMap: make(map[string]string), // Initialize keyMap here
	}
}

// Serve starts serving the cache manager client.
func (c *Client) Serve() {
	fmt.Println("Cache manager client is serving...")

	go c.startTCPServer()
	go c.subscribeToDataNode()
	// go c.publishMessages() this is just a hello world for testing, can be left commented.

	// Keep the program running
	select {}
}

// startTCPServer starts the TCP server for receiving messages.
func (c *Client) startTCPServer() {
	if err := c.broker.StartTCPServerWithHandler(c.handleMessage); err != nil {
		fmt.Println("Error starting TCP server:", err)
	}
}

// subscribeToDataNode subscribes to messages from the Data Node.
func (c *Client) subscribeToDataNode() {
	// err := c.broker.SubscribeToTopic("data", c.handleMessage)
	err := c.broker.SubscribeToTopic("data")
	if err != nil {
		fmt.Println("Failed to subscribe to Data Node:", err)
	}
}

// handleMessage handles incoming messages from the Data Node.
func (c *Client) handleMessage(msg string) {
	// fmt.Println("Cache Manager received:", msg)

	msgPayload, err := domain.PayloadFromString(msg)
	if err != nil {
		fmt.Println("Error on reading payload:", err)
		return
	}

	if msgPayload.User != "CacheManager" {
		fmt.Println("Cache Manager received:", msg)

		KeyRequest, err := domain.KRFromString(msgPayload.Message)
		if err != nil {
			fmt.Println("Error on reading KeyRequest:", err)
			return
		}

		switch KeyRequest.Method {
		case domain.Read:
			c.handleReadRequest(KeyRequest)
		case domain.Write:
			c.handleWriteRequest(KeyRequest)
		}
	}
}

// handleReadRequest handles read requests from the Data Node.
func (c *Client) handleReadRequest(KeyRequest domain.KeyRequest) {
	response := domain.KeyResponse{
		Key:       KeyRequest.Key,
		Data:      c.keyMap[KeyRequest.Key],
		RequestID: KeyRequest.RequestID,
	}

	payload := domain.MessagePayload{
		User:    "CacheManager",
		Message: response.ToString(),
	}

	// Publish the response (assuming there's a method to publish the response)
	err := c.broker.PublishMessage("data", payload.ToString())
	if err != nil {
		fmt.Println("Failed to publish response:", err)
	}
}

// handleWriteRequest handles write requests from the Data Node.
func (c *Client) handleWriteRequest(KeyRequest domain.KeyRequest) {
	fmt.Println("Cache Manager: Writing data to cache...")
	c.keyMap[KeyRequest.Key] = KeyRequest.Data
}

// publishMessages publishes a message every 5 seconds.
// this is just a HELLO WORLD
func (c *Client) publishMessages() {
	for {
		payload := domain.MessagePayload{
			User:    "CacheManager",
			Message: "Hello, world!",
		}

		err := c.broker.PublishMessage("data", payload.ToString())
		if err != nil {
			fmt.Println("Failed to publish message:", err)
		}
		time.Sleep(5 * time.Second)
	}
}
