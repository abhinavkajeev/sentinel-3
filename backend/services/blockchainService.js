import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { makeContractCall, broadcastTransaction, getNonce } from '@stacks/transactions';
import { StacksMocknet } from '@stacks/network';
import crypto from 'crypto';

class BlockchainService {
  constructor() {
    // Use testnet for development, change to mainnet for production
    this.network = new StacksTestnet();
    this.contractAddress = process.env.CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFYVDEQMMKSWZQAG97KXKPSWD05E';
    this.contractName = 'access-log';
    this.contractFunction = 'log-entry';
    
    console.log(`Blockchain Service initialized for ${this.network.chainId}`);
  }

  /**
   * Log access event to blockchain
   * @param {Object} eventData - Event data
   * @param {string} eventData.sessionId - Session ID
   * @param {string} eventData.eventType - Event type (ENTRY/EXIT)
   * @param {string} eventData.photoHash - IPFS hash of the photo
   * @param {string} eventData.privateKey - Private key for signing
   * @returns {Promise<Object>} Transaction result
   */
  async logAccessEvent(eventData) {
    try {
      const { sessionId, eventType, photoHash, privateKey } = eventData;
      
      // Validate inputs
      if (!sessionId || !eventType || !photoHash || !privateKey) {
        throw new Error('Missing required event data');
      }

      // Truncate strings to match contract constraints
      const truncatedSessionId = sessionId.substring(0, 50);
      const truncatedEventType = eventType.substring(0, 10);
      const truncatedPhotoHash = photoHash.substring(0, 64);

      // Get current nonce for the account
      const senderAddress = this.getAddressFromPrivateKey(privateKey);
      const nonce = await getNonce(senderAddress, this.network);

      // Create contract call options
      const contractCallOptions = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: this.contractFunction,
        functionArgs: [
          truncatedSessionId,
          truncatedEventType,
          truncatedPhotoHash
        ],
        senderKey: privateKey,
        validateWithAbi: false,
        network: this.network,
        nonce: nonce,
        fee: 1000, // Set appropriate fee
        postConditionMode: 1, // Allow
      };

      console.log(`Logging event to blockchain: ${eventType} for session ${sessionId}`);

      // Make the contract call
      const transaction = await makeContractCall(contractCallOptions);

      // Broadcast the transaction
      const broadcastResponse = await broadcastTransaction(transaction, this.network);

      if (broadcastResponse.error) {
        throw new Error(`Broadcast failed: ${broadcastResponse.error}`);
      }

      console.log(`Transaction broadcasted: ${broadcastResponse.txid}`);

      return {
        success: true,
        txHash: broadcastResponse.txid,
        eventId: this.generateEventId(),
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Blockchain logging error:', error);
      throw new Error(`Failed to log to blockchain: ${error.message}`);
    }
  }

  /**
   * Get address from private key
   * @param {string} privateKey - Private key
   * @returns {string} Stacks address
   */
  getAddressFromPrivateKey(privateKey) {
    try {
      // This is a simplified version - in production you'd use proper key derivation
      const hash = crypto.createHash('sha256').update(privateKey).digest('hex');
      return `ST${hash.substring(0, 40)}`;
    } catch (error) {
      throw new Error('Invalid private key format');
    }
  }

  /**
   * Generate unique event ID
   * @returns {string} Event ID
   */
  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get transaction status
   * @param {string} txHash - Transaction hash
   * @returns {Promise<Object>} Transaction status
   */
  async getTransactionStatus(txHash) {
    try {
      const response = await fetch(`${this.network.getCoreApiUrl()}/extended/v1/tx/${txHash}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.status}`);
      }
      
      const txData = await response.json();
      return {
        txHash,
        status: txData.tx_status,
        blockHeight: txData.block_height,
        timestamp: txData.burn_block_time
      };
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      return { txHash, status: 'UNKNOWN', error: error.message };
    }
  }

  /**
   * Get recent events from blockchain
   * @param {number} limit - Number of events to fetch
   * @returns {Promise<Array>} Recent events
   */
  async getRecentEvents(limit = 10) {
    try {
      // This would call your smart contract's get-events function
      // For now, return mock data
      return [];
    } catch (error) {
      console.error('Error fetching recent events:', error);
      return [];
    }
  }
}

export default BlockchainService;
