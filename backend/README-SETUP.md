# 🚀 Sentinel-3 Security System - Setup Guide

## 📋 Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Pinata IPFS account with JWT token
- Stacks blockchain account (for smart contract deployment)

## 🔧 Environment Setup

Create a `.env` file in the backend directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/sentinel3

# Server
PORT=5000

# IPFS (Pinata)
IPFS_PROVIDER=pinata
PINATA_JWT=your_pinata_jwt_token_here
GATEWAY_URL=gateway.pinata.cloud

# Blockchain (Stacks)
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFYVDEQMMKSWZQAG97KXKPSWD05E
BLOCKCHAIN_PRIVATE_KEY=your_stacks_private_key_here
BLOCKCHAIN_NETWORK=testnet
```

## 🚀 Quick Start

### Option 1: Automatic Startup (Recommended)
```bash
# Windows
start-sentinel.bat

# Linux/Mac
./start-sentinel.sh
```

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend
npm install
npm run dev

# Terminal 2 - Frontend
cd ../frontend
npm install
npm run dev
```

## 🧪 Testing Components

### 1. Test IPFS Integration
```bash
node test-pinata.js
```

### 2. Validate Smart Contract
```bash
node validate-contract.js
```

### 3. Test Complete Integration
```bash
node test-integration.js
```

### 4. Deploy Smart Contract (Optional)
```bash
node deploy-contract.js
```

## 📱 System URLs
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:5173
- **API Documentation**: http://localhost:5000/api-docs

## 🔍 Troubleshooting

### IPFS Issues
- Ensure `PINATA_JWT` is correct (not Project ID)
- Check Pinata account has sufficient credits
- Verify gateway URL is accessible

### Blockchain Issues
- Ensure `BLOCKCHAIN_PRIVATE_KEY` is valid
- Check Stacks account has STX for gas fees
- Verify network configuration (testnet/mainnet)

### MongoDB Issues
- Ensure MongoDB service is running
- Check connection string format
- Verify database permissions

## 📊 System Architecture

```
Frontend (React) → Backend (Node.js) → MongoDB + IPFS + Stacks Blockchain
     ↓                    ↓                    ↓
  Camera UI         Session Management    Data Storage
  Dashboard         IPFS Upload          Blockchain Logging
  Settings          Face Recognition     Event History
```

## 🎯 Features

- ✅ **Real-time Camera Integration**
- ✅ **IPFS Image Storage** (Pinata)
- ✅ **Blockchain Event Logging** (Stacks)
- ✅ **Face Recognition** (face-api.js)
- ✅ **Session Management**
- ✅ **Company Authentication**
- ✅ **Event History & Analytics**

## 🆘 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure all services are running
4. Check network connectivity for external services

## 📝 License

This project is part of the Sentinel-3 Security System.
