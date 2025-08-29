# Sentinel-3 Backend

A robust backend service for the Sentinel-3 building security platform with blockchain integration using Stacks blockchain and Clarity smart contracts.

## 🏗️ Architecture

- **Express.js** - RESTful API server
- **MongoDB** - Database for user management and session data
- **Stacks Blockchain** - Immutable event logging and access control
- **Clarity Smart Contracts** - Access log management on blockchain
- **IPFS Integration** - Photo storage and verification

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or accessible via connection string
- Stacks testnet account (for development)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Generate testnet wallet:**
   ```bash
   npm run generate-wallet
   ```

4. **Deploy smart contract:**
   ```bash
   npm run deploy-contract
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Blockchain Configuration
DEPLOYER_PRIVATE_KEY=your_private_key_here
DEPLOYER_ADDRESS=your_address_here
CONTRACT_ADDRESS=your_contract_address_here
NETWORK=testnet

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/sentinel3

# Server Configuration
PORT=3070
NODE_ENV=development

# IPFS Configuration (Optional)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

## 📡 API Endpoints

### Health & Status
- `GET /` - Basic health check
- `GET /health` - Detailed system health
- `GET /api` - API documentation

### Blockchain Operations
- `GET /api/blockchain/health` - Blockchain system health
- `GET /api/blockchain/network-info` - Network information
- `GET /api/blockchain/events` - Get all events
- `GET /api/blockchain/events/count` - Get event count
- `GET /api/blockchain/events/latest` - Get latest event
- `GET /api/blockchain/events/session/:sessionId` - Get events by session
- `GET /api/blockchain/counter` - Get current counter
- `GET /api/blockchain/events/recent/:limit` - Get recent events
- `GET /api/blockchain/transaction/:txHash` - Get transaction status
- `POST /api/blockchain/events/log` - Log new event
- `POST /api/blockchain/events/validate` - Validate event data

### Core Operations
- `GET /api/company/*` - Company management
- `GET /api/admin/*` - Admin operations
- `GET /api/sessions/*` - Session management

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3070/health
```

### Blockchain Connection
```bash
curl http://localhost:3070/api/blockchain/test-connection
```

### Log Event
```bash
curl -X POST http://localhost:3070/api/blockchain/events/log \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "eventType": "ENTRY",
    "photoHash": "QmTestHash123456789",
    "privateKey": "your_private_key_here"
  }'
```

## 📁 Project Structure

```
backend/
├── s3-contracts/           # Smart contract deployment
│   ├── contracts/         # Clarity smart contracts
│   ├── deploy-to-testnet.js
│   └── generate-testnet-wallet.js
├── services/              # Business logic services
│   └── blockchainService.js
├── routes/                # API route handlers
│   ├── blockchainRoutes.js
│   ├── companyRoutes.js
│   ├── adminRoutes.js
│   └── sessionRoutes.js
├── controllers/           # Request controllers
├── models/               # MongoDB models
├── config/               # Configuration files
├── server.js             # Main server file
├── setup-integration.js  # Integration setup script
└── package.json
```

## 🔐 Security Features

- Input validation and sanitization
- Private key management
- CORS configuration
- Environment variable protection
- Blockchain transaction signing
- Rate limiting (configurable)

## 🚀 Production Deployment

1. **Switch to mainnet:**
   - Update network configuration
   - Deploy contract to mainnet
   - Use real STX for transactions

2. **Environment setup:**
   - Set production MongoDB URI
   - Configure production IPFS endpoints
   - Set proper CORS origins

3. **Monitoring:**
   - Health check endpoints
   - Logging service
   - Blockchain transaction monitoring

## 📚 Documentation

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/write-smart-contracts/overview)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section in the main integration guide
- Review console logs and error messages
- Ensure all services are running correctly
- Verify environment variable configuration
