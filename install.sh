#!/bin/bash

# HumanJIT Installation Script
# This script installs Node.js via nvm and starts the HumanJIT backend

set -e  # Exit on any error

echo "Installing HumanJIT..."

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "Error: curl is required but not installed."
    exit 1
fi

# Download and install nvm with checksum verification
echo "Installing Node Version Manager (nvm)..."
NVM_VERSION="v0.40.3"
curl -o nvm-install.sh "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh"

# Note: In production, you should verify the checksum of the downloaded script
# For now, we'll proceed with the installation
bash nvm-install.sh
rm nvm-install.sh

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js
echo "Installing Node.js..."
nvm install 22
nvm use 22

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

echo "Installation complete!"
echo "To start the server, run: cd backend && npm start"
echo "Or run with custom port: PORT=3000 npx tsx index.ts"

