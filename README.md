# ntfy emergency app - Message Webapp

A simple web application that allows users to send emergency messages through an ntfy server.


## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
export NTFY_URL="https://your-ntfy-server.com"
export NTFY_USER="your-username"
export NTFY_PASSWORD="your-password"
export PORT=3000  # optional, defaults to 3000
```

3. Run the application:
```bash
npm start
```

## Environment Variables

- `NTFY_URL`: URL of your ntfy server (required)
- `NTFY_USER`: Username for ntfy authentication (required)
- `NTFY_PASSWORD`: Password for ntfy authentication (required)
- `NTFY_TOPIC`: ntfy topic/channel to send messages to (optional, defaults to "emergencia")
- `PORT`: Port to run the application on (optional, defaults to 3000)

### Docker Registry Variables (Optional)

- `DOCKER_REGISTRY`: Custom registry to publish the image to (optional)
- `DOCKER_USERNAME`: Username/organization in the registry (optional)
- `DOCKER_TAG`: Tag for the Docker image (optional, defaults to "latest")

## Usage

1. Open your browser to `http://localhost:3000` (or the configured port)
2. Fill out the form with your name and message
3. Click "Send Message"
4. You'll receive confirmation if the message was sent successfully

## Deployment

### Option 1: Docker Compose (Recommended)

1. Create a `.env` file with your credentials:
```bash
NTFY_URL=https://your-ntfy-server.com
NTFY_USER=your-username
NTFY_PASSWORD=your-password
NTFY_TOPIC=emergencia
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

### Option 2: Direct Installation

To deploy on a Linux server:

1. Upload files to the server
2. Install Node.js (version 14 or higher)
3. Configure environment variables
4. Run `npm install` to install dependencies
5. Run `npm start` to start the application

### systemd Example (optional)

Create file `/etc/systemd/system/ntfy-emergency-app.service`:

```ini
[Unit]
Description=NTFY Emergency App
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/ntfy-emergency-app
Environment=NTFY_URL=https://your-ntfy-server.com
Environment=NTFY_USER=your-username
Environment=NTFY_PASSWORD=your-password
Environment=NTFY_TOPIC=emergencia
Environment=PORT=3000
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ntfy-emergency-app
sudo systemctl start ntfy-emergency-app
```

## Docker Image Publishing

### Manual Build and Publishing

#### Option 1: Without custom registry (Docker Hub)
```bash
# Build and publish
npm run docker:build-tag-push
```

#### Option 2: With custom registry
```bash
# Configure environment variables
export DOCKER_REGISTRY=your-registry.com
export DOCKER_USERNAME=your-username
export DOCKER_TAG=v1.0.0

# Build and publish
npm run docker:build-tag-push
```

#### Option 3: Manual
```bash
docker build -t ntfy-emergency-app .
docker tag ntfy-emergency-app your-registry/ntfy-emergency-app:latest
docker push your-registry/ntfy-emergency-app:latest
```

### Using with Private Registry

To use the image from a private registry:

```bash
# Authenticate with the registry
docker login your-registry.com

# Run the image
docker run -d \
  --name ntfy-emergency-app \
  -p 3000:3000 \
  -e NTFY_URL=https://your-ntfy-server.com \
  -e NTFY_USER=your-username \
  -e NTFY_PASSWORD=your-password \
  -e NTFY_TOPIC=emergencia \
  your-registry.com/ntfy-emergency-app:latest
```

## Project Structure

```
ntfy-emergency-app/
├── server.js                    # Main Express server
├── package.json                 # Dependencies and scripts
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose orchestration
├── scripts/                     # Helper scripts
│   ├── docker-tag.sh           # Script to tag images
│   └── docker-push.sh          # Script to publish images
├── public/
│   ├── index.html              # Main page
│   └── style.css               # CSS styles
└── README.md                   # This file
```

## Notes

- Messages are sent to the topic configured in `NTFY_TOPIC` (defaults to "emergencia")
- Message format is: "Name: Message"
- The application validates that both fields are complete before sending

