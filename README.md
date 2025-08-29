# 🛡️ Sentinel-3: Building Security Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![Stacks](https://img.shields.io/badge/Stacks-Blockchain-orange.svg)](https://stacks.co/)

> A comprehensive MERN stack application for building security management with blockchain integration, face detection, and decentralized storage.

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔧 Configuration](#-configuration)
- [📱 Demo & Screenshots](#-demo--screenshots)
- [🎥 Video Demonstration](#-video-demonstration)
- [📡 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🔐 Security Features](#-security-features)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🆘 Support](#-support)

## 🌟 Features

✨ **Core Features:**
- 🏢 **Company Management** - Secure registration and authentication with PIN system
- 📸 **Real-time Face Detection** - Advanced camera integration with face-api.js
- 🔗 **Blockchain Integration** - Immutable event logging on Stacks blockchain
- 🌐 **IPFS Storage** - Decentralized photo storage and verification
- 📊 **Live Dashboard** - Real-time monitoring and analytics
- 🔐 **JWT Authentication** - Secure session management
- 📱 **Responsive Design** - Mobile-friendly interface

🚀 **Advanced Features:**
- ⚡ Smart contract automation with Clarity
- 🎯 Real-time event tracking
- 📈 Advanced analytics and reporting
- 🛡️ Multi-layer security architecture
- 🔄 Auto-backup and recovery systems

## 🏗️ Tech Stack

### 🎨 Frontend
- **React.js** - Modern UI library
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling
- **face-api.js** - Face detection and recognition
- **Axios** - HTTP client for API calls

### ⚙️ Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### 🔗 Blockchain & Storage
- **Stacks Blockchain** - Smart contract platform
- **Clarity** - Smart contract language
- **IPFS** - Decentralized storage
- **Pinata** - IPFS pinning service

### 🛠️ Development Tools
- **ESLint** - Code linting
- **Clarinet** - Stacks development toolkit
- **Git** - Version control

## 📁 Project Structure

```
sentinel-3/
├── 📦 package.json
├── 📖 README.md
├── ⚙️ SETUP.md
├── 🚀 start-system.bat
├── 🔧 backend/
│   ├── 📋 API.md
│   ├── 📦 package.json
│   ├── 🚀 server.js
│   ├── 📊 server.log
│   ├── 🔧 config/
│   │   ├── blockchain.config.js
│   │   └── ipfs.config.js
│   ├── 📄 contracts/
│   │   └── AccessLog.clar
│   ├── 🎮 controllers/
│   │   ├── adminController.js
│   │   ├── companyController.js
│   │   └── sessionController.js
│   ├── 🗃️ models/
│   │   ├── Admin.js
│   │   ├── Company.js
│   │   ├── EventLog.js
│   │   └── Session.js
│   ├── 🛣️ routes/
│   │   ├── adminRoutes.js
│   │   ├── blockchainRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── ipfsRoutes.js
│   │   └── sessionRoutes.js
│   ├── 🔗 s3-contracts/
│   │   ├── contracts/
│   │   ├── deployments/
│   │   └── settings/
│   └── 🔧 services/
│       ├── blockchainService.js
│       └── ipfsService.js
├── 🎨 frontend/
│   ├── 📦 package.json
│   ├── 🏠 index.html
│   ├── ⚡ vite.config.js
│   ├── 🌍 public/
│   │   ├── 🖼️ img1.png - img8.png
│   │   └── 🧠 models/
│   │       ├── face_landmark_68/
│   │       ├── face_recognition/
│   │       └── tiny_face_detector/
│   └── 📝 src/
│       ├── 📱 App.jsx
│       ├── 🛣️ AppRouter.jsx
│       ├── 🚀 main.jsx
│       ├── 🔗 blockchain/
│       ├── 🧩 components/
│       ├── 🌐 contexts/
│       ├── 🔧 services/
│       └── 🎨 styles/
```

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- 🟢 **Node.js** (v18 or higher)
- 🍃 **MongoDB** (running locally or cloud instance)
- 🔧 **Git** (for cloning the repository)
- 🦀 **Clarinet** (for smart contract development)

### 📥 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abhinavkajeev/sentinel-3.git
   cd sentinel-3
   ```

2. **🔧 Backend Setup**
   ```bash
   cd sentinel-3/backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Generate testnet wallet
   npm run generate-wallet
   
   # Deploy smart contract
   npm run deploy-contract
   ```

3. **🎨 Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **🍃 Start MongoDB**
   ```bash
   # On macOS
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

5. **🚀 Start the Application**
   
   **Backend Server:**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:3070
   ```
   
   **Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

6. **🌐 Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### 🌍 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# 🔗 Blockchain Configuration
DEPLOYER_PRIVATE_KEY=your_private_key_here
DEPLOYER_ADDRESS=your_address_here
CONTRACT_ADDRESS=your_contract_address_here
NETWORK=testnet

# 🍃 MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/sentinel3

# 🚀 Server Configuration
PORT=3070
NODE_ENV=development

# 🌐 IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

## 📱 Demo & Screenshots

### 📹 Full System Demo
<div align="center">
  <p><a href = "https://youtu.be/zQAiMY5HcUM">Link For Demo: https://youtu.be/zQAiMY5HcUM</a></p>
</div>

### 🎬 Feature Highlights

#### 🏠 Landing Page Experience
<div align="center">
  <img src="./sentinel-3/frontend/public/img1.png" alt="Landing Page Experience" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <p><em>Clean and intuitive landing page design</em></p>
</div>

#### 📊 Dashboard Analytics
<div align="center">
  <img src="./sentinel-3/frontend/public/img4.png" alt="Dashboard Analytics" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <p><em>Real-time monitoring and security analytics</em></p>
</div>

#### 🔗 Wallet Integration
<div align="center">
  <img src="./sentinel-3/frontend/public/img5.png" alt="Wallet Integration" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <p><em>Secure blockchain wallet connection</em></p>
</div>

#### 📸 Camera Detection System
<div align="center">
  <img src="./sentinel-3/frontend/public/img6.png" alt="Camera Detection" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <p><em>Live face detection and event capture</em></p>
</div>

#### 🌐 IPFS Storage Management
<div align="center">
  <img src="./sentinel-3/frontend/public/img7.png" alt="IPFS Storage" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <p><em>Decentralized image storage and verification</em></p>
</div> 

<div align="center">
  <img src="./sentinel-3/frontend/public/img9.jpeg" alt="IPFS Storage" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <p><em>Decentralized image storage and verification</em></p>storage
  </div>
- 🔗 IPFS hash generation
- 🛡️ Immutable photo verificationgration
- 🔄 Successfully connected to the wallet
- 🔐 Blockchain authenticationvent monitoring
- 📊 Security analytics
- 🔗 Blockchain transaction tracking

## 📡 API Documentation

### 🏥 Health & Status
- `GET /` - Basic health check
- `GET /health` - Detailed system health
- `GET /api` - API documentation

### 🔗 Blockchain Operations
- `GET /api/blockchain/health` - Blockchain system health
- `GET /api/blockchain/events` - Get all events
- `POST /api/blockchain/events/log` - Log new event
- `GET /api/blockchain/events/session/:sessionId` - Get events by session

### 🏢 Company Management
- `POST /api/company/register` - Register new company
- `POST /api/company/login` - Company authentication
- `GET /api/company/profile` - Get company profile

### 👤 Session Management
- `POST /api/sessions/entry` - Log entry event
- `POST /api/sessions/exit` - Log exit event
- `GET /api/sessions/recent` - Get recent sessions

## 🧪 Testing

### ✅ Health Check
```bash
curl http://localhost:3070/health
```

### 🔗 Blockchain Connection
```bash
curl http://localhost:3070/api/blockchain/test-connection
```

### 📝 Log Event
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

### 🏢 Company Registration Test
```bash
curl -X POST http://localhost:3070/api/company/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "email": "test@company.com",
    "phone": "1234567890",
    "password": "securepassword"
  }'
```

## 🔐 Security Features

- 🔑 **JWT Authentication** - Secure token-based authentication
- 🏢 **Company PIN System** - 6-digit PIN for additional security
- 🔒 **Input Validation** - Comprehensive input sanitization
- 🔐 **Private Key Management** - Secure blockchain key handling
- 🌐 **CORS Configuration** - Controlled cross-origin requests
- 🛡️ **Rate Limiting** - API abuse prevention
- 📊 **Event Logging** - Comprehensive audit trails
- 🔗 **Blockchain Immutability** - Tamper-proof event records

## 🚀 Deployment

### 🌍 Production Setup

1. **🌐 Switch to Mainnet**
   ```bash
   # Update network configuration
   NETWORK=mainnet
   
   # Deploy contract to mainnet
   npm run deploy-mainnet
   ```

2. **☁️ Cloud Database**
   ```bash
   # MongoDB Atlas connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sentinel3
   ```

3. **🔧 Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=3070
   # Set production CORS origins
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

### 🐳 Docker Deployment (Optional)

```dockerfile
# Create Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3070
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! 🎉

1. 🍴 **Fork the repository**
2. 🌟 **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. ✅ **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push to the branch** (`git push origin feature/AmazingFeature`)
5. 🔄 **Open a Pull Request**

### 📋 Contribution Guidelines

- 📝 Write clear commit messages
- 🧪 Add tests for new features
- 📖 Update documentation as needed
- 🎨 Follow existing code style
- 🔍 Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### 🔧 Troubleshooting

**Backend Issues:**
- ✅ Ensure MongoDB is running
- 🔍 Check `.env` file configuration
- 📦 Verify all dependencies are installed

**Frontend Issues:**
- 🧹 Clear browser cache
- 🕵️ Check browser console for errors
- 🔗 Ensure backend is running on port 3070

**Camera Issues:**
- 📷 Allow camera permissions in browser
- 🔄 Check if camera is being used by another application
- 🔃 Try refreshing the page

### 📞 Get Help

For support and questions:
- 📧 **Email**: support@sentinel3.com
- 💬 **Discord**: [Join our community](https://discord.gg/sentinel3)
- 🐛 **Issues**: [GitHub Issues](https://github.com/abhinavkajeev/sentinel-3/issues)
- 📖 **Documentation**: [Full Documentation](https://docs.sentinel3.com)

### 🌟 Community

- ⭐ Star this repository if you find it helpful!
- 🐦 Follow us on [Twitter](https://twitter.com/sentinel3_app)
- 📺 Subscribe to our [YouTube channel](https://youtube.com/sentinel3) for tutorials

---

<div align="center">

**🛡️ Built with ❤️ by the Sentinel-3 Team**

[![GitHub](https://img.shields.io/badge/GitHub-Sentinel--3-black?style=for-the-badge&logo=github)](https://github.com/abhinavkajeev/sentinel-3)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-blue?style=for-the-badge&logo=twitter)](https://twitter.com/sentinel3_app)

</div>
