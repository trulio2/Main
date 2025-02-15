package uuid

import (
	"crypto/rand"
	"fmt"
)

// GenerateUUID generates a UUID version 4 as a string.
func GenerateUUID() (string, error) {
	var uuid [16]byte
	_, err := rand.Read(uuid[:])
	if err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %w", err)
	}

	// Set version to 4 and variant to RFC 4122
	uuid[6] = (uuid[6] & 0x0f) | 0x40
	uuid[8] = (uuid[8] & 0x3f) | 0x80

	// Format UUID string
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%12x",
			uuid[0:4],
			uuid[4:6],
			uuid[6:8],
			uuid[8:10],
			uuid[10:]),
		nil
}
