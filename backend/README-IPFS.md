# IPFS Integration for Sentinel-3

This backend now uses IPFS (InterPlanetary File System) for decentralized image storage instead of traditional file systems or cloud storage.

## Why IPFS?

- **Decentralized**: Images are stored across a distributed network
- **Immutable**: Once uploaded, images cannot be modified
- **Cost-effective**: No recurring storage fees
- **Blockchain-friendly**: Perfect for web3 applications
- **Censorship-resistant**: Distributed storage makes it hard to take down

## Setup Options

### Option 1: Infura IPFS (Recommended for Hackathon)

1. Go to [Infura](https://infura.io/) and create an account
2. Create a new IPFS project
3. Get your Project ID and Project Secret
4. Set environment variables:

```bash
IPFS_PROVIDER=infura
IPFS_AUTH=your_project_id:your_project_secret
```

### Option 2: Pinata

1. Go to [Pinata](https://pinata.cloud/) and create an account
2. Get your JWT token from the API keys section
3. Set environment variables:

```bash
IPFS_PROVIDER=pinata
IPFS_AUTH=Bearer your_jwt_token
```

### Option 3: Local IPFS Node

1. Install IPFS Desktop or IPFS CLI
2. Start your local node
3. Set environment variables:

```bash
IPFS_PROVIDER=local
```

### Option 4: Web3.Storage (Filecoin + IPFS)

1. Go to [Web3.Storage](https://web3.storage/) and create an account
2. Get your API token
3. Set environment variables:

```bash
IPFS_PROVIDER=web3storage
IPFS_AUTH=Bearer your_api_token
```

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/sentinel3

# Server
PORT=3070

# IPFS Configuration
IPFS_PROVIDER=infura
IPFS_AUTH=your_project_id:your_project_secret
IPFS_GATEWAY=https://ipfs.io/ipfs
```

## How It Works

1. **Entry Event**: When someone enters the building:

   - Face image is captured
   - Image is uploaded to IPFS
   - IPFS hash is stored in MongoDB
   - SHA-256 hash is stored on blockchain
   - IPFS URL is returned for immediate access

2. **Exit Event**: When someone exits:

   - Face image is captured
   - Image is uploaded to IPFS
   - Face recognition matches with entry event
   - Session is closed
   - Both images remain accessible via IPFS

3. **Image Retrieval**: Images can be accessed via:
   - Direct IPFS gateway URLs
   - API endpoint: `GET /api/sessions/image/:hash`

## API Endpoints

- `POST /api/sessions/entry` - Log entry with image upload
- `POST /api/sessions/exit` - Log exit with image upload
- `GET /api/sessions/image/:hash` - Retrieve image from IPFS
- `GET /api/sessions/recent` - Get recent sessions

## Response Format

Entry/Exit responses now include:

```json
{
  "ok": true,
  "sessionId": "S123456",
  "photoHash": "sha256_hash",
  "ipfsHash": "QmIPFSHash...",
  "ipfsUrl": "https://ipfs.io/ipfs/QmIPFSHash...",
  "onchain": {
    "txHash": "0x...",
    "blockHeight": 123456,
    "eventId": 789
  }
}
```

## Benefits for Your Hackathon

1. **Immediate Demo**: Images are instantly accessible via IPFS
2. **No Storage Costs**: Free IPFS services available
3. **Web3 Credibility**: Shows understanding of decentralized storage
4. **Scalability**: Can handle unlimited images
5. **Audit Trail**: IPFS hashes provide immutable proof of storage

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check your IPFS credentials and network
2. **Images Not Loading**: Verify IPFS gateway is accessible
3. **Rate Limits**: Free tiers have upload limits

### Testing

Test your IPFS setup:

```bash
# Check if service initializes
npm run dev

# Look for: "IPFS Service initialized with [host]:[port]"
```

## Next Steps

1. Choose an IPFS provider (Infura recommended for hackathon)
2. Set up environment variables
3. Test image upload/retrieval
4. Deploy to your hackathon environment

## Resources

- [IPFS Documentation](https://docs.ipfs.io/)
- [Infura IPFS](https://infura.io/docs/ipfs)
- [Pinata](https://docs.pinata.cloud/)
- [Web3.Storage](https://web3.storage/docs/)
