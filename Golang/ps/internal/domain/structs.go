package domain

import (
	"encoding/json"
	"fmt"
)

type MessagePayload struct {
	User    string `json:"user"`
	Message string `json:"message"`
}

func (mp MessagePayload) ToString() string {
	data, err := json.Marshal(mp)
	if err != nil {
		fmt.Println("Error marshaling MessagePayload:", err)
		return ""
	}
	return string(data)
}

// PayloadFromString converts a JSON string representation to a MessagePayload struct.
func PayloadFromString(jsonStr string) (MessagePayload, error) {
	var mp MessagePayload
	err := json.Unmarshal([]byte(jsonStr), &mp)
	if err != nil {
		// Log the error and return an empty MessagePayload struct
		fmt.Println("Error unmarshaling JSON string:", err)
		return MessagePayload{}, err
	}
	return mp, nil
}

type Method string

const (
	Read  Method = "READ"
	Write Method = "WRITE"
)

type KeyRequest struct {
	Key       string `json:"key"`
	Method    Method `json:"method"`
	Data      string `json:"data"`
	RequestID string `json:"request_id"`
}

// ToString converts KeyRequest to its JSON string representation.
func (kr KeyRequest) ToString() string {
	data, err := json.Marshal(kr)
	if err != nil {
		// Log the error and return an empty string
		fmt.Println("Error marshaling KeyRequest:", err)
		return ""
	}
	return string(data)
}

// FromString converts a JSON string representation to a KeyRequest struct.
func KRFromString(jsonStr string) (KeyRequest, error) {
	var kr KeyRequest
	err := json.Unmarshal([]byte(jsonStr), &kr)
	if err != nil {
		// Log the error and return an empty KeyRequest struct
		fmt.Println("Error unmarshaling JSON string:", err)
		return KeyRequest{}, err
	}
	return kr, nil
}

type KeyResponse struct {
	Key       string `json:"key"`
	Data      string `json:"data"`
	RequestID string `json:"request_id"`
}

// ToString converts KeyResponse to its JSON string representation.
func (kr KeyResponse) ToString() string {
	data, err := json.Marshal(kr)
	if err != nil {
		// Log the error and return an empty string
		fmt.Println("Error marshaling KeyResponse:", err)
		return ""
	}
	return string(data)
}

// FromString converts a JSON string representation to a KeyResponse struct.
func KResponseFromString(jsonStr string) (KeyResponse, error) {
	var kr KeyResponse
	err := json.Unmarshal([]byte(jsonStr), &kr)
	if err != nil {
		// Log the error and return an empty KeyResponse struct
		fmt.Println("Error unmarshaling JSON string:", err)
		return KeyResponse{}, err
	}
	return kr, nil
}
