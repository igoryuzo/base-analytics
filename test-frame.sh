#!/bin/bash

# Check if URL argument is provided
if [ -z "$1" ]; then
  echo "Usage: ./test-frame.sh <url>"
  echo "Example: ./test-frame.sh https://12345.ngrok.io/api/frame"
  exit 1
fi

URL=$1

# Fetch the frame HTML and extract the metadata
echo "Fetching frame metadata from $URL..."
echo "------------------------------------"
curl -s $URL | grep -o '<meta property="fc:frame[^>]*>' | sed 's/<meta property="//;s/">//'
echo "------------------------------------"

# Simulate a POST request to the frame (to test interaction)
echo "Testing POST interaction..."
echo "------------------------------------"
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{"untrustedData": {"fid": 1, "buttonIndex": 1}}' | grep -o '<meta property="fc:frame[^>]*>' | sed 's/<meta property="//;s/">//'
echo "------------------------------------"

echo "Done! Check the output above to verify your frame metadata."