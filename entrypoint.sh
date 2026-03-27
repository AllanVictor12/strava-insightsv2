#!/bin/sh
set -e

echo "=== Starting Strava Insights ==="
echo "Node version: $(node --version)"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "PORT: $PORT"

# Start API server in background
echo "Starting API server..."
node /app/server/index.js &
API_PID=$!
echo "API started with PID $API_PID"

# Give API a moment to start
sleep 2

# Check if API is running
if kill -0 $API_PID 2>/dev/null; then
  echo "API is running"
else
  echo "ERROR: API failed to start!"
  exit 1
fi

# Start nginx in foreground
echo "Starting nginx..."
exec nginx -g "daemon off;"
