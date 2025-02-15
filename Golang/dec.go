package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/url"
)

func encrypt(input, secretOrKey string) (string, error) {
	hasher := sha256.New()
	hasher.Write([]byte(secretOrKey))
	key256 := hasher.Sum(nil)

	block, err := aes.NewCipher(key256)
	if err != nil {
		return "", fmt.Errorf("failed to create cipher: %w", err)
	}

	iv := make([]byte, aes.BlockSize)
	stream := cipher.NewCTR(block, iv)

	escapedInput := url.QueryEscape(input)
	encryptedBytes := make([]byte, len(escapedInput))
	stream.XORKeyStream(encryptedBytes, []byte(escapedInput))

	encryptedHex := hex.EncodeToString(encryptedBytes)
	return encryptedHex, nil
}

func decrypt(encryptedHex, secretOrKey string) (string, error) {
	hasher := sha256.New()
	hasher.Write([]byte(secretOrKey))
	key256 := hasher.Sum(nil)

	encryptedBytes, err := hex.DecodeString(encryptedHex)
	if err != nil {
		return "", fmt.Errorf("failed to decode hex string: %w", err)
	}

	block, err := aes.NewCipher(key256)
	if err != nil {
		return "", fmt.Errorf("failed to create cipher: %w", err)
	}

	iv := make([]byte, aes.BlockSize)
	stream := cipher.NewCTR(block, iv)

	decryptedBytes := make([]byte, len(encryptedBytes))
	stream.XORKeyStream(decryptedBytes, encryptedBytes)

	unescaped, err := url.QueryUnescape(string(decryptedBytes))
	if err != nil {
		return "", fmt.Errorf("failed to unescape URL: %w", err)
	}

	return unescaped, nil
}

func decrypt2(encryptedHex string, secretOrKey string) (string, error) {
	key := sha256.Sum256([]byte(secretOrKey))

	encryptedBytes, err := hex.DecodeString(encryptedHex)
	if err != nil {
		return "", fmt.Errorf("failed to decode hex: %v", err)
	}

	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	iv := make([]byte, aes.BlockSize)
	stream := cipher.NewCTR(block, iv)

	decryptedBytes := make([]byte, len(encryptedBytes))
	stream.XORKeyStream(decryptedBytes, encryptedBytes)

	decryptedStr, err := url.QueryUnescape(string(decryptedBytes))
	if err != nil {
		return "", fmt.Errorf("failed to decode URL-encoded string: %v", err)
	}

	return decryptedStr, nil
}

func main() {
	input := "Hello, world!"
	secretOrKey := "secret123"

	encryptedHex, err := encrypt(input, secretOrKey)
	if err != nil {
		fmt.Println("Error encrypting:", err)
		return
	}
	fmt.Println("Encrypted hex string:", encryptedHex)

	decryptedString, err := decrypt2("1e32d6b1c5e8e4a950295b8f535698c99a283ba01f9f5c897c653eda9f3a316f3d334c5fe531089e60ee57c5313daa65609ef7f3550bf17bd824c3d916c441eca09ba755c11d0cb7f97d08e0cd3a2842c3168b05a737806daacabd73791aa0967cd71442bea29d9ac538860ee402e2afb3a407966c0f54e7650511e3408228d583c320077bae8baf8b61287965d708e8758288ca3df9e21ea3774997fefefba310a5e65e53c2facfd9877d7bbbfc424629e520eed24052a6b325db5f9e787aea13366b0e16fb731a4c06d34c3ec4b44ea814a25963c9d45e573ab710d2b027c239e1be2b95db5999aa2e35a21ec2a4be969393336ce3a8fbb591b10420be98b83fc790aed91d7caf9a3a5c3899c0f4ab3fe9f30aa347dd865d1051ed0237a79830c68393e94bfe79bb5dd57ff0ce6cde68ad403cd7912a02a238b6d4ef8e0905af5a5c91fcd548f4503f22fb454a47f779711d9da1f3aa4dc41cfb100bbd5ba44b00a9f51ceb4b15a7b02100419b7a8754014f4419b97bba35131f4475f90a2d48e3c87729e9263b1999f5c0928517fa3ef63484f09d2223e6310519ff28352187c640fb6f8292de009039d2ae72a0e1173b5eaf07db2d9035e91304ca6f7302a59c21c83088aecadef0ec15b62278f106a117b8316f4bbe6b50dc9cac5aa3bf9fad8c1ff0c73b808691258097704cf0523f0da22d0d749112bb767de6c5b2038c634cd5d9819a9b5fc09aac5a83b334e0080521d526dbf08bcc3dd3b699187095e7ab09e6dbc6b0c2bdd2412f87fef13e8750878d7bfae6a054b6fce9341762546c9e1957a6939c72bd879474b60d83ef87d03834882ba0dbb5b8f7249adc44e92dff3b83c027442808faf18df78d3823e4e61ec7509c3c0888db8d2f52216c2eb59f86465319087be482f94e6303d2a6ad88f9cf97021c83de360a3e8d983df4f6e5e6baaf8be0249a7ea5e47309667d2339628770c1e1233846cfd55c948d7447754f891c018aed3e65320cedb8b9fce77fe7b4500f7425520129f02d7749f146414f43eeab267112cf2c4be27e5c71b0334ace0ffa43c706b8a9f05d904f5db60622adf6fe36ab820daffcaab81c8ccc0ce0318cc18d01667c81f321e249a3d04d26d3eb17180b4bd6d9c0d483327d9c821c41517b54d0651629d8c3c6d3f99289a60e55bd0a6e453fec59ad05d5c2ec8c5827a96a3b6b62354c9d77d34e52da636c8b9c58af8329633cb66d912c2b061b4119f14ea3c7a4efce476287762eb4547c9b2ea8b72b235a72561fa348272a853f712594e3c3eeecac2e68e2aa65971eeca8af2eeb12d6f13b932529bfb4dd5acba144ee3b8116170dd6b16a35ad02e4be90a09661673a2c644d7b8f72b83397d864e1d02074dcd3226487e55b34f2e1e4ecfcb393ab6799bc194965b858b11bba6116df79faa6b2b8b0261452e0cea295878d343260eb76fe4a565ac704817e1be27692641dffa7934a1a15724f694786ce3bc8e2a3503af85efeef13be0af532eb103fc028ed6024eebc78e6b5fe2c32ee387b33711f332058f8bbda0778eb4ff57e9afafaefcb31f089893aa078744ffd483b5d8a833aa905839627877e44b2f4bb8cdaa4aff0377e5c89355ead0961b85a5a777c24903a765f946b773842e59b8b79c149513df1361d3872392af7e2ef3f06dfdcd8c128074076c5856811432a4ebc8a9bc0517aaee17a90aecfa6655e953dfc47495d1bb8478aa08c8f061782face2a00d18fad884f984a0f3b7a93d3b21c6dc218824d53680e5b53c4b62af2046f998cc4f5b8116b24efa3ca0b0b57567452441eb202404886dcac3b9ac5bb9c13c7152d754e5368a82694f96a293e8ac1ed91bee207586a", "aD0tkNF2Fx9OKSYdTsooVKTTUQTbzSinlNowBxP6ok7FLcox2PnsN0DFeRs0X4bAaxLwcnq7uIjIDt28bS5vZK6Ks7LJqo6Kd7o3LslW46aWPlZGZu6T3h8Y4z7nr3Hx")
	if err != nil {
		fmt.Println("Error decrypting:", err)
		return
	}
	fmt.Println("Decrypted string:", decryptedString)
}
