#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Get environment variables with defaults
REGISTRY=${DOCKER_REGISTRY:-}
USERNAME=${DOCKER_USERNAME:-}
TAG=${DOCKER_TAG:-latest}

# Build the image name
IMAGE_NAME="ntfy-emergency-app"

if [ -n "$REGISTRY" ] && [ -n "$USERNAME" ]; then
    IMAGE_NAME="$REGISTRY/$USERNAME/$IMAGE_NAME"
elif [ -n "$REGISTRY" ]; then
    IMAGE_NAME="$REGISTRY/$IMAGE_NAME"
elif [ -n "$USERNAME" ]; then
    IMAGE_NAME="$USERNAME/$IMAGE_NAME"
fi

IMAGE_NAME="$IMAGE_NAME:$TAG"

# Execute docker tag command
COMMAND="docker tag ntfy-emergency-app $IMAGE_NAME"

echo "Tagging image: $COMMAND"
if $COMMAND; then
    echo "✅ Successfully tagged as: $IMAGE_NAME"
else
    echo "❌ Failed to tag image"
    exit 1
fi
