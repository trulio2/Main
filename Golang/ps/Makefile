#!/bin/bash
include .env

# run the cacheManager
run-cacheManager: ## calling the cmd to run the cacheManager.
	@echo "\033[2m→ Running the cacheManager...\033[0m"
	@go run cmd/cacheManager/main.go

# run the dataNode
run-dataNode: ## calling the cmd to run the dataNode.
	@echo "\033[2m→ Running the dataNode...\033[0m"
	@go run cmd/dataNode/main.go

.PHONY: build-datanode build-cachemanager up down

build-datanode:
	@docker build -f deployments/dataNode.Dockerfile -t datanode .

build-cachemanager:
	@docker build -f deployments/cacheManager.Dockerfile -t cachemanager .

up:
	@cd deployments && docker-compose up --build

# detached no build
up-dnb:
	@cd deployments && docker-compose up -d

down:
	@cd deployments && docker-compose down

# Lint is to fix bad code practices
# go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
# export PATH=$PATH:$HOME/go/bin
lint: ## Run linters only.
	@echo "\033[2m→ Running linters...\033[0m"
	@golangci-lint run --config .golangci.yml --fix