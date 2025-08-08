#!/bin/bash

echo "♔ Chesster - Starting Complete Chess Game Environment ♔"
echo "===================================================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first."
    echo "Run: npm install -g pnpm"
    exit 1
fi

# Make the script executable
chmod +x start-chesster.js

# Run the startup script
echo "Starting Chesster..."
node start-chesster.js 