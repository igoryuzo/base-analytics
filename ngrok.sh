#!/bin/bash

# Start Next.js dev server in the background
yarn dev &
NEXT_PID=$!

# Give Next.js a moment to start
sleep 5

# Start Ngrok tunnel to port 3000
ngrok http 3000

# When Ngrok is closed, also stop the Next.js server
kill $NEXT_PID