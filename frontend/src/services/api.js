import axios from 'axios';
const API_BASE_URL = 'http://localhost:3040/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.client = axios.create({ baseURL: API_BASE_URL });
  }

  // Generic request method using axios
  async request(endpoint, options = {}) {
    try {
      const response = await this.client.request({ url: endpoint, ...options });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || error.message);
      }
      throw error;
    }
  }

  // Company authentication
  async registerCompany(companyData) {
    return this.request('/company/register', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async loginCompany(credentials) {
    return this.request('/company/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }


  // IPFS direct upload
  async uploadToIPFS(imageData) {
    // POST /ipfs/upload
    return this.request('/ipfs/upload', {
      method: 'POST',
      data: {
        imageBase64: imageData,
        filename: `camera-${Date.now()}.jpg`
      }
    });
  }

  // Session management (image recognition endpoints)
  async logEntry(sessionData) {
    // POST /sessions/entry
    return this.request('/sessions/entry', {
      method: 'POST',
      data: sessionData
    });
  }

  async logExit(sessionData) {
    // POST /sessions/exit
    return this.request('/sessions/exit', {
      method: 'POST',
      data: sessionData
    });
  }

  async getRecentSessions(companyPin, limit = 50) {
    // GET /sessions/recent
    return this.request(`/sessions/recent?companyPin=${companyPin}&limit=${limit}`, {
      method: 'GET'
    });
  }

  async getImage(hash) {
    // GET /sessions/image/:hash
    return this.client.get(`/sessions/image/${hash}`, { responseType: 'blob' });
  }

  // Admin functions
  async healthCheck() {
    return this.request('/admin/health');
  }

  // Smart contract integration (placeholder for now)
  async logToBlockchain(eventData) {
    // This would integrate with the Stacks blockchain
    // For now, return mock data
    return {
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockHeight: Math.floor(Math.random() * 1000000),
      eventId: Math.floor(Math.random() * 1000000),
    };
  }
}

export default new ApiService();