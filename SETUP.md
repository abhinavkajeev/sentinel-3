# Sentinel-3 Complete Setup Guide

## Overview
This guide will help you set up the complete Sentinel-3 system with frontend, backend, and smart contract integration.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Git

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/sentinel3
PORT=3070
IPFS_PROVIDER=infura
IPFS_AUTH=your_project_id:your_project_secret
```

### 3. Start MongoDB
If running locally:
```bash
# On Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# On macOS/Linux
mongod
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

The backend will be available at `http://localhost:3070`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Smart Contract Setup

### 1. Install Clarinet (Stacks Development Tool)
```bash
# On Windows (using Chocolatey)
choco install clarinet

# On macOS
brew install clarinet

# On Linux
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar -xz
sudo mv clarinet /usr/local/bin/
```

### 2. Deploy Contract (Optional for Demo)
```bash
cd backend/s3-contracts
clarinet deploy
```

## System Integration

### 1. Authentication Flow
- Companies can register with company name, phone, email, and password
- Upon registration, they receive a 6-digit PIN
- Login using PIN and password
- JWT tokens are stored in localStorage

### 2. Camera Integration
- Camera captures images when faces are detected
- Images are converted to base64 and sent to backend
- Backend uploads to IPFS and stores hash
- Smart contract logs the event on blockchain

### 3. Dashboard
- Shows real-time security events from backend
- Displays IPFS hashes and blockchain transaction IDs
- Real-time statistics and monitoring

## API Endpoints

### Company Management
- `POST /api/company/register` - Register new company
- `POST /api/company/login` - Company login

### Session Management
- `POST /api/sessions/entry` - Log entry event
- `POST /api/sessions/exit` - Log exit event
- `GET /api/sessions/recent` - Get recent sessions

### Admin
- `GET /api/admin/health` - Health check

## Testing the System

### 1. Register a Company
- Go to landing page
- Click "Company Registration"
- Fill in company details
- Note the 6-digit PIN

### 2. Login
- Click "Company Login"
- Use PIN and password
- You'll be redirected to dashboard

### 3. Test Camera
- Navigate to "Live Feed"
- Allow camera permissions
- Face detection will automatically log events

### 4. View Events
- Return to dashboard
- See real-time events with IPFS hashes and blockchain IDs

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check `.env` file configuration
- Verify all dependencies are installed

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Ensure backend is running on port 3070

### Camera Issues
- Allow camera permissions in browser
- Check if camera is being used by another application
- Try refreshing the page

## Security Features

- Company PIN authentication
- IPFS image storage with SHA-256 hashing
- Blockchain event logging
- Secure session management
- Protected routes with authentication

## Next Steps

1. **Production Deployment**
   - Set up production MongoDB instance
   - Configure IPFS gateway
   - Deploy smart contract to mainnet

2. **Advanced Features**
   - Real face recognition with face-api.js
   - Multiple camera support
   - Advanced analytics dashboard
   - Mobile app integration

3. **Blockchain Integration**
   - Connect to Stacks mainnet
   - Implement real transaction signing
   - Add STX token integration

## Support

For issues or questions:
1. Check the console logs
2. Verify all services are running
3. Ensure proper network connectivity
4. Review environment configuration
