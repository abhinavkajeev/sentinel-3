#!/bin/bash

echo "🚀 Starting Sentinel-3 Security System..."
echo

echo "📋 Checking prerequisites..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo
echo "🧪 Testing system components..."
echo

echo "1️⃣ Testing IPFS Integration..."
node test-pinata.js
if [ $? -ne 0 ]; then
    echo "❌ IPFS test failed"
    exit 1
fi

echo
echo "2️⃣ Validating Smart Contract..."
node validate-contract.js
if [ $? -ne 0 ]; then
    echo "❌ Contract validation failed"
    exit 1
fi

echo
echo "3️⃣ Testing Complete Integration..."
node test-integration.js
if [ $? -ne 0 ]; then
    echo "❌ Integration test failed"
    exit 1
fi

echo
echo "🎉 All tests passed! Starting Sentinel-3..."
echo
echo "📡 Backend will start on http://localhost:5000"
echo "🌐 Frontend will start on http://localhost:5173"
echo
echo "Press Enter to start the system..."
read

echo
echo "🚀 Starting Backend Server..."
gnome-terminal --title="Sentinel-3 Backend" -- bash -c "npm run dev; exec bash" &
BACKEND_PID=$!

echo
echo "🌐 Starting Frontend..."
gnome-terminal --title="Sentinel-3 Frontend" -- bash -c "cd ../frontend && npm run dev; exec bash" &
FRONTEND_PID=$!

echo
echo "✅ Sentinel-3 is starting up!"
echo "📱 Backend: http://localhost:5000"
echo "🖥️  Frontend: http://localhost:5173"
echo
echo "Press Enter to exit this launcher..."
read

# Clean up background processes
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

echo "👋 Sentinel-3 launcher closed"
