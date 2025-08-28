@echo off
echo 🚀 Starting Sentinel-3 Security System...
echo.

echo 📋 Checking prerequisites...
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🧪 Testing system components...
echo.

echo 1️⃣ Testing IPFS Integration...
node test-pinata.js
if errorlevel 1 (
    echo ❌ IPFS test failed
    pause
    exit /b 1
)

echo.
echo 2️⃣ Validating Smart Contract...
node validate-contract.js
if errorlevel 1 (
    echo ❌ Contract validation failed
    pause
    exit /b 1
)

echo.
echo 3️⃣ Testing Complete Integration...
node test-integration.js
if errorlevel 1 (
    echo ❌ Integration test failed
    pause
    exit /b 1
)

echo.
echo 🎉 All tests passed! Starting Sentinel-3...
echo.
echo 📡 Backend will start on http://localhost:5000
echo 🌐 Frontend will start on http://localhost:5173
echo.
echo Press any key to start the system...
pause >nul

echo.
echo 🚀 Starting Backend Server...
start "Sentinel-3 Backend" cmd /k "npm run dev"

echo.
echo 🌐 Starting Frontend...
start "Sentinel-3 Frontend" cmd /k "cd ../frontend && npm run dev"

echo.
echo ✅ Sentinel-3 is starting up!
echo 📱 Backend: http://localhost:5000
echo 🖥️  Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher...
pause >nul
