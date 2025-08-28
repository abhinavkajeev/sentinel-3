# Sentinel-3 Backend API Documentation

## Overview

This API provides endpoints for managing building security events using facial recognition, IPFS image storage, and blockchain logging.

## Base URL

```
http://localhost:3070/api
```

## Authentication

All endpoints require a valid `companyPin` (6-digit PIN) in the request body.

## Endpoints

### 1. Company Management

#### Register Company

- **POST** `/company/register`
- **Description**: Register a new company and receive a 6-digit PIN
- **Request Body**:
  ```json
  {
    "companyName": "Bank of Example",
    "phoneNumber": "+1234567890",
    "email": "security@bank.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true,
    "company": {
      "companyId": "C123456",
      "companyName": "Bank of Example",
      "companyPin": "123456",
      "email": "security@bank.com"
    }
  }
  ```

#### Login Company

- **POST** `/company/login`
- **Description**: Login with company PIN and password
- **Request Body**:
  ```json
  {
    "companyPin": "123456",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true,
    "company": {
      "companyId": "C123456",
      "companyName": "Bank of Example",
      "companyPin": "123456"
    }
  }
  ```

### 2. Session Management

#### Log Entry Event

- **POST** `/sessions/entry`
- **Description**: Log a person entering the building with facial recognition
- **Request Body**:
  ```json
  {
    "companyPin": "123456",
    "faceDescriptor": [0.1, 0.2, 0.3, ...], // 128-dimensional face embedding
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Base64 encoded image
  }
  ```
- **Response**:
  ```json
  {
    "ok": true,
    "sessionId": "S123456",
    "photoHash": "sha256_hash_of_image",
    "ipfsHash": "QmIPFSHash...",
    "ipfsUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
    "onchain": {
      "txHash": "0x...",
      "blockHeight": 123456,
      "eventId": 789
    }
  }
  ```

#### Log Exit Event

- **POST** `/sessions/exit`
- **Description**: Log a person exiting the building with facial recognition
- **Request Body**:
  ```json
  {
    "companyPin": "123456",
    "faceDescriptor": [0.1, 0.2, 0.3, ...], // 128-dimensional face embedding
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // Base64 encoded image
  }
  ```
- **Response**:
  ```json
  {
    "ok": true,
    "sessionId": "S123456",
    "photoHash": "sha256_hash_of_image",
    "ipfsHash": "QmIPFSHash...",
    "ipfsUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
    "matchDistance": 0.45,
    "onchain": {
      "txHash": "0x...",
      "blockHeight": 123456,
      "eventId": 789
    }
  }
  ```

#### Get Recent Sessions

- **GET** `/sessions/recent?companyPin=123456&limit=50`
- **Description**: Retrieve recent sessions for a company
- **Query Parameters**:
  - `companyPin` (required): Company's 6-digit PIN
  - `limit` (optional): Number of sessions to return (default: 50)
- **Response**:
  ```json
  {
    "ok": true,
    "sessions": [
      {
        "sessionId": "S123456",
        "companyPin": "123456",
        "status": "closed",
        "entry": {
          "at": "2024-01-15T10:30:00.000Z",
          "photoHash": "sha256_hash",
          "photoUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
          "faceDescriptor": [0.1, 0.2, 0.3, ...],
          "txHash": "0x...",
          "blockHeight": 123456,
          "eventId": 789
        },
        "exit": {
          "at": "2024-01-15T11:30:00.000Z",
          "photoHash": "sha256_hash",
          "photoUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
          "faceDescriptor": [0.1, 0.2, 0.3, ...],
          "txHash": "0x...",
          "blockHeight": 123456,
          "eventId": 790
        },
        "matchConfidence": 0.55
      }
    ]
  }
  ```

#### Retrieve Image from IPFS

- **GET** `/sessions/image/:hash`
- **Description**: Retrieve an image stored on IPFS using its hash
- **Path Parameters**:
  - `hash`: IPFS hash/CID of the image
- **Response**: Raw image data with appropriate content-type headers
- **Headers**:
  ```
  Content-Type: image/jpeg
  Content-Length: [size]
  Cache-Control: public, max-age=31536000
  ```

### 3. Admin Functions

#### Health Check

- **GET** `/admin/health`
- **Description**: Check if the backend is running
- **Response**:
  ```json
  {
    "ok": true,
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```

## Data Models

### Session

```json
{
  "sessionId": "S123456",
  "companyPin": "123456",
  "status": "open|closed",
  "entry": {
    "at": "2024-01-15T10:30:00.000Z",
    "photoHash": "sha256_hash",
    "photoUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
    "faceDescriptor": [0.1, 0.2, 0.3, ...],
    "txHash": "0x...",
    "blockHeight": 123456,
    "eventId": 789
  },
  "exit": {
    "at": "2024-01-15T11:30:00.000Z",
    "photoHash": "sha256_hash",
    "photoUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
    "faceDescriptor": [0.1, 0.2, 0.3, ...],
    "txHash": "0x...",
    "blockHeight": 123456,
    "eventId": 790
  },
  "matchConfidence": 0.55
}
```

### EventLog

```json
{
  "eventId": 789,
  "sessionId": "S123456",
  "eventType": "ENTRY|EXIT",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "photoHash": "sha256_hash",
  "blockchainTxHash": "0x...",
  "blockchainBlockHeight": 123456,
  "photoUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
  "photoStoragePath": "QmIPFSHash...",
  "confidence": 1.0,
  "isProcessed": true
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error description"
}
```

Common HTTP status codes:

- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (invalid company PIN)
- `404`: Not Found (no matching session)
- `500`: Internal Server Error

## IPFS Integration

### Image Storage Flow

1. **Upload**: Images are uploaded to IPFS when logging entry/exit events
2. **Storage**: IPFS hash (CID) is stored in MongoDB for quick retrieval
3. **Access**: Images can be accessed via IPFS gateway URLs or API endpoint
4. **Verification**: SHA-256 hash is stored on blockchain for immutability

### IPFS Configuration

The system supports multiple IPFS providers:

- **Infura IPFS** (recommended for hackathon)
- **Pinata**
- **Local IPFS node**
- **Web3.Storage**

See `README-IPFS.md` for detailed setup instructions.

## Blockchain Integration

### Current Status

- Placeholder implementation for hackathon demo
- Returns mock transaction hashes and block heights
- Ready for Stacks blockchain integration

### Future Implementation

- Integrate with Stacks SDK
- Call Clarity smart contract functions
- Store real transaction hashes and block heights

## Rate Limits

- **IPFS Uploads**: Limited by provider (Infura: 100MB/day free)
- **API Calls**: No artificial limits implemented
- **Face Recognition**: No limits on processing

## Security Considerations

- Company PINs are required for all operations
- Face descriptors are stored securely in MongoDB
- IPFS hashes provide immutable proof of image storage
- Blockchain hashes ensure data integrity

## Development

### Running Locally

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file with:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/sentinel3
PORT=3070
IPFS_PROVIDER=infura
IPFS_AUTH=your_project_id:your_project_secret
```

### Testing

Test the API endpoints using tools like Postman or curl:

```bash
curl -X POST http://localhost:3070/api/sessions/entry \
  -H "Content-Type: application/json" \
  -d '{"companyPin":"123456","faceDescriptor":[0.1,0.2],"imageBase64":"data:image/jpeg;base64,..."}'
```
