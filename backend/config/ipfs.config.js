// IPFS Configuration for different providers
export const ipfsConfigs = {
  // Infura IPFS (Free tier available)
  infura: {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    auth: process.env.IPFS_AUTH, // Format: "project_id:project_secret"
    gateway: 'https://ipfs.io/ipfs'
  },

  // Pinata (Popular IPFS service)
  pinata: {
    host: 'api.pinata.cloud',
    port: 443,
    protocol: 'https',
    auth: process.env.IPFS_AUTH, // Format: "Bearer your_jwt_token"
    gateway: 'https://gateway.pinata.cloud/ipfs'
  },

  // Local IPFS node
  local: {
    host: 'localhost',
    port: 5001,
    protocol: 'http',
    auth: null,
    gateway: 'http://localhost:8080/ipfs'
  },

  // Web3.Storage (Filecoin + IPFS)
  web3storage: {
    host: 'api.web3.storage',
    port: 443,
    protocol: 'https',
    auth: process.env.IPFS_AUTH, // Format: "Bearer your_api_token"
    gateway: 'https://w3s.link/ipfs'
  }
};

// Get configuration based on environment
export function getIPFSConfig() {
  const provider = process.env.IPFS_PROVIDER || 'infura';
  const config = ipfsConfigs[provider];
  
  if (!config) {
    throw new Error(`Unknown IPFS provider: ${provider}`);
  }

  return {
    ...config,
    host: process.env.IPFS_HOST || config.host,
    port: process.env.IPFS_PORT || config.port,
    protocol: process.env.IPFS_PROTOCOL || config.protocol,
    auth: process.env.IPFS_AUTH || config.auth,
    gateway: process.env.IPFS_GATEWAY || config.gateway
  };
}
