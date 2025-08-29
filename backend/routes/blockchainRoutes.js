import express from 'express';
import BlockchainService from '../services/blockchainService.js';

const router = express.Router();
const blockchainService = new BlockchainService();

// Test blockchain connection
router.get('/test-connection', async (req, res) => {
  try {
    const result = await blockchainService.testConnection();
    res.json({
      success: result,
      message: result ? 'Blockchain connection successful' : 'Blockchain connection failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Blockchain connection test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    const health = await blockchainService.getSystemHealth();
    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await blockchainService.getAllEvents();
    res.json({
      success: true,
      events: events || [],
      count: Array.isArray(events) ? events.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get event count
router.get('/events/count', async (req, res) => {
  try {
    const count = await blockchainService.getEventCount();
    res.json({
      success: true,
      count: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching event count:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get latest event
router.get('/events/latest', async (req, res) => {
  try {
    const event = await blockchainService.getLatestEvent();
    res.json({
      success: true,
      event: event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching latest event:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get events by session ID
router.get('/events/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const events = await blockchainService.getEventsBySession(sessionId);
    res.json({
      success: true,
      sessionId,
      events: events || [],
      count: Array.isArray(events) ? events.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching events by session:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get recent events
router.get('/events/recent/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const events = await blockchainService.getRecentEvents(limit);
    res.json({
      success: true,
      events: events || [],
      limit,
      count: Array.isArray(events) ? events.length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching recent events:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Log access event
router.post('/events/log', async (req, res) => {
  try {
    const { sessionId, eventType, photoHash, privateKey } = req.body;
    
    // Validate required fields
    if (!sessionId || !eventType || !photoHash || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sessionId, eventType, photoHash, privateKey',
        timestamp: new Date().toISOString()
      });
    }

    // Validate event data
    const validation = blockchainService.validateEventData({ sessionId, eventType, photoHash });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', '),
        timestamp: new Date().toISOString()
      });
    }

    // Log to blockchain
    const result = await blockchainService.logAccessEvent({
      sessionId,
      eventType,
      photoHash,
      privateKey
    });

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get transaction status
router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    const status = await blockchainService.getTransactionStatus(txHash);
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get current counter
router.get('/counter', async (req, res) => {
  try {
    const counter = await blockchainService.getCurrentCounter();
    res.json({
      success: true,
      counter: counter || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching counter:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get network information
router.get('/network', async (req, res) => {
  try {
    const networkInfo = blockchainService.getNetworkInfo();
    res.json({
      success: true,
      network: networkInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching network info:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
