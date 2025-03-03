#!/bin/bash

# Exit on error
set -e

echo "🔧 Preparing Mac build..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install it first:"
    echo "curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Please install it first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the frontend
echo "🏗️ Building frontend..."
pnpm build

# Build the Tauri app
echo "🚀 Building Tauri app..."
pnpm tauri build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📱 App bundle location: frontend/src-tauri/target/release/bundle/macos"
    
    # Provide instructions for Ollama setup
    echo ""
    echo "🔍 Important: Before distributing the app:"
    echo "1. Ensure Ollama is installed on the target machine"
    echo "2. Run 'ollama serve' to start the Ollama server"
    echo "3. The app will automatically manage model downloads"
else
    echo "❌ Build failed"
    exit 1
fi 