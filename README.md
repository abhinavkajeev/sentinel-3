# Sentinel-3

Project structure for frontend and backend.
# Sentinel-3

## Project Overview
Sentinel-3 is a comprehensive MERN stack application designed to solve [insert problem statement here]. The solution leverages modern web technologies, blockchain for smart contracts, and IPFS for decentralized storage. This project aims to [insert solution details here].

*Note: Add images and videos here to showcase the working of the project.*

---

## Tech Stack

### Frontend
- React.js
- Vite
- CSS

### Backend
- Node.js
- Express.js

### Server
- Custom server scripts

### Smart Contracts
- Clarity (for Stacks blockchain)

### Database
- MongoDB

---

## Repository Structure

```
.
├── backend/
│   ├── API.md
│   ├── deploy-and-test-fixed.bat
│   ├── deploy-and-test.bat
│   ├── deploy-contract.js
│   ├── env.example
│   ├── generate-private-key-simple.js
│   ├── generate-private-key.js
│   ├── package.json
│   ├── README.md
│   ├── server.js
│   ├── server.log
│   ├── start-sentinel.bat
│   ├── start-sentinel.sh
│   ├── test-integration.js
│   ├── test-pinata.js
│   ├── test-real-blockchain.js
│   ├── validate-contract.js
│   ├── verify-setup.js
│   ├── config/
│   │   ├── blockchain.config.js
│   │   └── ipfs.config.js
│   ├── contracts/
│   │   └── AccessLog.clar
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── companyController.js
│   │   └── sessionController.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Company.js
│   │   ├── EventLog.js
│   │   └── Session.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── blockchainRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── ipfsRoutes.js
│   │   └── sessionRoutes.js
│   ├── s3-contracts/
│   │   ├── Clarinet.toml
│   │   ├── deploy-to-testnet.cjs
│   │   ├── generate-testnet-wallet.js
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.js
│   │   ├── contracts/
│   │   │   └── access-log.clar
│   │   ├── deployments/
│   │   │   ├── default.devnet-plan.yaml
│   │   │   └── default.testnet-plan.yaml
│   │   └── settings/
│   │       └── Devnet.toml
│   └── services/
│       ├── blockchainService.js
│       └── ipfsService.js
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── photoDetector/
│   │   ├── public/
│   │   │   ├── img1.avif
│   │   │   └── vite.svg
│   │   ├── models/
│   │   │   ├── face_landmark_68/
│   │   │   │   ├── face_landmark_68_model-shard1
│   │   │   │   └── face_landmark_68_model-weights_manifest.json
│   │   │   ├── face_recognition/
│   │   │   │   ├── face_recognition_model-shard1
│   │   │   │   ├── face_recognition_model-shard2
│   │   │   │   └── face_recognition_model-weights_manifest.json
│   │   │   └── tiny_face_detector/
│   │   │       ├── tiny_face_detector_model-shard1
│   │   │       └── tiny_face_detector_model-weights_manifest.json
│   └── src/
│       ├── App.jsx
│       ├── AppRouter.jsx
│       ├── main.jsx
│       ├── blockchain/
│       │   ├── clarity.js
│       │   └── stacks.js
│       ├── components/
│       │   ├── CameraPage.jsx
│       │   ├── Dashboard.jsx
│       │   ├── LandingPage.jsx
│       │   └── LoginPage.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   ├── adminService.js
│       │   ├── api.js
│       │   └── companyService.js
│       └── styles/
│           └── index.css
├── package.json
├── README.md
├── SETUP.md
└── start-system.bat
```

---

## How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Clarity CLI (for smart contracts)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/abhinavkajeev/sentinel-3.git
   cd sentinel-3
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Backend**:
   ```bash
   cd ../backend
   node server.js
   ```

5. **Run the Frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

---

## Future Enhancements
- Add more robust error handling.
- Implement additional blockchain features.
- Enhance the UI/UX for better user experience.
