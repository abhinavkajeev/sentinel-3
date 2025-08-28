const API_BASE_URL = 'http://localhost:3040/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
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

  // Session management
  async logEntry(sessionData) {
    return this.request('/sessions/entry', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async logExit(sessionData) {
    return this.request('/sessions/exit', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getRecentSessions(companyPin, limit = 50) {
    return this.request(`/sessions/recent?companyPin=${companyPin}&limit=${limit}`);
  }

  async getImage(hash) {
    return `${this.baseURL}/sessions/image/${hash}`;
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
