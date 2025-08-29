// Blockchain Configuration for Deployed Contract
export const blockchainConfig = {
  // Update these values with your deployed contract details
  contractAddress: process.env.CONTRACT_ADDRESS || 'your_contract_address_here',
  contractName: 'access-log',
  network: process.env.BLOCKCHAIN_NETWORK || 'testnet',
  
  // Stacks API endpoints
  apiEndpoints: {
    testnet: 'https://api.testnet.hiro.so',
    mainnet: 'https://api.hiro.so'
  },
  
  // Contract functions
  functions: {
    logEntry: 'log-entry',
    getEvents: 'get-events',
    getEventCount: 'get-event-count',
    getLatestEvent: 'get-latest-event',
    getEventsBySession: 'get-events-by-session',
    getCurrentCounter: 'get-current-counter',
    clearEvents: 'clear-events'
  },
  
  // Transaction settings
  transaction: {
    fee: 1000,
    postConditionMode: 1, // Allow
    anchorMode: 1 // Any
  }
};

export default blockchainConfig;
