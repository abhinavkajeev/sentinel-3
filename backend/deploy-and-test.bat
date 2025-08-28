@echo off
echo 🚀 Sentinel-3 Smart Contract Deployment & Testing
echo.

echo 📋 Prerequisites Check:
echo 1. Leather Wallet installed and switched to TESTNET
echo 2. Testnet STX received from faucet
echo 3. Private key exported and added to .env file
echo.

echo 🔑 Checking environment variables...
if not defined BLOCKCHAIN_PRIVATE_KEY (
    echo ❌ BLOCKCHAIN_PRIVATE_KEY not found in .env file
    echo Please add your testnet private key to .env file
    echo.
    echo Example:
    echo BLOCKCHAIN_PRIVATE_KEY=your_actual_private_key_here
    pause
    exit /b 1
)

echo ✅ Environment variables found
echo.

echo 🏗️  Step 1: Deploying Smart Contract...
echo This will deploy the access-log contract to Stacks testnet
echo.
echo Press any key to continue with deployment...
pause >nul

node deploy-contract.js
if errorlevel 1 (
    echo ❌ Contract deployment failed
    echo Please check your private key and STX balance
    pause
    exit /b 1
)

echo.
echo 🎉 Contract deployed successfully!
echo.
echo ⏳ Waiting 30 seconds for deployment confirmation...
timeout /t 30 /nobreak >nul

echo.
echo 🧪 Step 2: Testing Real Blockchain Transactions...
echo This will log real ENTRY and EXIT events to testnet
echo.
echo Press any key to continue with testing...
pause >nul

node test-real-blockchain.js

echo.
echo 🎯 Test Complete!
echo Check the explorer links above to view your transactions
echo.
pause
