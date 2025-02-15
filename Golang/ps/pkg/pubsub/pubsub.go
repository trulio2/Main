// this package doesn't need to be internal, cause it could be reused in other projects
// thus why it is in pkg folder and not internal.
package pubsub

import (
	"bufio"
	"fmt"
	"net"
	"strings"
	"sync"
	"time"
)

// Message represents a pub/sub message.
type Message struct {
	Topic   string
	Payload interface{}
}

// Broker manages pub/sub communication.
type Broker struct {
	address       string
	listenAddress string
	subscribers   map[string][]net.Conn
	mu            sync.RWMutex
}

// NewBroker creates a new Broker.
func NewBroker(
	address,
	listenAddress string,
) *Broker {
	return &Broker{
		address:       address,
		listenAddress: listenAddress,
		subscribers:   make(map[string][]net.Conn),
		mu:            sync.RWMutex{},
	}
}

// Subscribe subscribes to a topic.
func (b *Broker) Subscribe(topic string, conn net.Conn) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.subscribers[topic] = append(b.subscribers[topic], conn)
}

// Unsubscribe unsubscribes from a topic.
func (b *Broker) Unsubscribe(topic string, conn net.Conn) {
	b.mu.Lock()
	defer b.mu.Unlock()
	subs := b.subscribers[topic]
	for i, sub := range subs {
		if sub == conn {
			b.subscribers[topic] = append(subs[:i], subs[i+1:]...)
			break
		}
	}
}

// Publish publishes a message to a topic.
func (b *Broker) Publish(topic string, payload string) {
	b.mu.RLock()
	defer b.mu.RUnlock()
	msg := fmt.Sprintf("%s:%s\n", topic, payload)
	for _, conn := range b.subscribers[topic] {
		_, err := conn.Write([]byte(msg))
		if err != nil {
			fmt.Println("Failed to send message:", err)
		}
	}
}

// HandleConnection handles a TCP connection for pub/sub communication.
func (b *Broker) HandleConnectionWithFunc(
	conn net.Conn,
	handleMessage func(string),
) {
	defer conn.Close()
	fmt.Println("New connection established:", conn.RemoteAddr()) // Log when a new connection is established

	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := scanner.Text()
		// fmt.Println("Received message:", line) // Log every message received
		parts := strings.SplitN(line, ":", 2)
		if len(parts) != 2 {
			fmt.Fprintln(conn, "Invalid command format")
			continue
		}

		cmd := parts[0]
		content := parts[1]

		switch cmd {
		case "SUBSCRIBE":
			// fmt.Println("Subscribe request for topic:", content) // Log subscription request
			topic := content
			b.Subscribe(topic, conn)
		case "UNSUBSCRIBE":
			// fmt.Println("Unsubscribe request for topic:", content) // Log unsubscription request
			topic := content
			b.Unsubscribe(topic, conn)
		case "PUBLISH":
			fmt.Println("Publish request with payload:", content) // Log publish request
			tokens := strings.SplitN(content, ":", 2)
			if len(tokens) != 2 {
				fmt.Fprintln(conn, "Invalid publish format")
				continue
			}
			topic := tokens[0]
			payload := tokens[1]
			b.Publish(topic, payload)
			go handleMessage(payload)
		default:
			// fmt.Println("Unknown command:", cmd) // Log unknown commands
			fmt.Fprintln(conn, "Unknown command")
		}
	}
	// fmt.Println("Connection closed:", conn.RemoteAddr()) // Log when connection closes

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading from connection:", err) // Log connection errors
	}
}

func (b *Broker) StartTCPServerWithHandler(
	handleMessage func(string),
) error {
	listener, err := net.Listen("tcp", b.listenAddress)
	if err != nil {
		return fmt.Errorf("error starting server: %w", err)
	}
	defer listener.Close()

	fmt.Printf("Broker listening on %s...\n", b.address)

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}
		go b.HandleConnectionWithFunc(
			conn,
			handleMessage,
		)
	}
}

// SubscribeToTopic subscribes to a topic on a remote broker with retry mechanism.
func (b *Broker) SubscribeToTopic(topic string,

// handleMessage func(string)
) error {
	fmt.Printf("Hey Subscribing to topic: %s\n", topic)
	retryCount := 0
	maxRetries := 5
	for {
		conn, err := net.Dial("tcp", b.address)
		if err != nil {
			retryCount++
			fmt.Printf("Failed to connect to broker for subscription (attempt %d): %v\n", retryCount, err)
			if retryCount >= maxRetries {
				return fmt.Errorf("failed to subscribe to broker after %d attempts: %w", maxRetries, err)
			}
			time.Sleep(2 * time.Second) // Wait before retrying
			continue
		}
		fmt.Fprintln(conn, "SUBSCRIBE:"+topic)

		return nil // Success
	}
}

// PublishMessage publishes a message to a topic on a remote broker with retry mechanism.
func (b *Broker) PublishMessage(topic, payload string) error {
	retryCount := 0
	maxRetries := 5
	for {
		conn, err := net.Dial("tcp", b.address)
		if err != nil {
			retryCount++
			fmt.Printf("Failed to connect to broker (attempt %d): %v\n", retryCount, err)
			if retryCount >= maxRetries {
				return fmt.Errorf("failed to connect to broker after %d attempts: %w", maxRetries, err)
			}
			time.Sleep(2 * time.Second) // Wait before retrying
			continue
		}
		defer conn.Close()
		message := fmt.Sprintf("PUBLISH:%s:%s\n", topic, payload)
		_, err = fmt.Fprintf(conn, message)
		if err != nil {
			return fmt.Errorf("failed to publish message: %w", err)
		}
		return nil // Success
	}
}
