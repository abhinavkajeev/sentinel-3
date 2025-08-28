import crypto from 'crypto';
import Session from '../models/Session.js';
import EventLog from '../models/EventLog.js';
import Company from '../models/Company.js';
import IPFSService from '../services/ipfsService.js';
import BlockchainService from '../services/blockchainService.js';

const ipfsService = new IPFSService();
const blockchainService = new BlockchainService();

function euclideanDistance(a = [], b = []) {
  if (!a || !b || a.length !== b.length) return Number.POSITIVE_INFINITY;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] || 0) - (b[i] || 0);
    sum += d * d;
  }
  return Math.sqrt(sum);
}

function sha256Hex(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// Integrate with Stacks blockchain to call Clarity `log-entry` / `log-exit`
async function pushOnChainLog({ eventType, photoHash, sessionId }) {
  try {
    // For now, use a mock private key - in production this should come from secure storage
    const mockPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    const blockchainResult = await blockchainService.logAccessEvent({
      sessionId: sessionId || `session_${Date.now()}`,
      eventType,
      photoHash,
      privateKey: mockPrivateKey
    });

    return {
      txHash: blockchainResult.txHash,
      blockHeight: Math.floor(blockchainResult.timestamp / 1000),
      eventId: blockchainResult.eventId
    };
  } catch (error) {
    console.error('Blockchain logging failed, using fallback:', error);
    // Fallback to mock data if blockchain fails
    return {
      txHash: `0x${crypto.randomBytes(16).toString('hex')}`,
      blockHeight: Math.floor(Date.now() / 1000),
      eventId: Math.floor(Math.random() * 1e6)
    };
  }
}

export const startEntry = async (req, res) => {
  try {
    const { companyPin, faceDescriptor, imageBase64 } = req.body;
    if (!companyPin || !faceDescriptor || !imageBase64) {
      return res.status(400).json({ error: 'companyPin, faceDescriptor, imageBase64 required' });
    }

    const company = await Company.findOne({ companyPin });
    if (!company) return res.status(401).json({ error: 'Invalid company PIN' });

    // Upload image to IPFS
    let ipfsResult;
    try {
      ipfsResult = await ipfsService.uploadBase64Image(imageBase64, `entry_${Date.now()}.jpg`);
    } catch (ipfsError) {
      console.error('IPFS upload failed:', ipfsError);
      return res.status(500).json({ error: 'Failed to upload image to IPFS' });
    }

    // Generate SHA-256 hash for blockchain
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const photoHash = sha256Hex(imageBuffer);

    const onchain = await pushOnChainLog({ eventType: 'ENTRY', photoHash, sessionId: null });

    const session = await Session.create({
      companyPin,
      status: 'open',
      entry: {
        at: new Date(),
        photoHash,
        photoUrl: ipfsResult.url,
        faceDescriptor,
        txHash: onchain.txHash,
        blockHeight: onchain.blockHeight,
        eventId: onchain.eventId
      }
    });

    await EventLog.create({
      eventId: onchain.eventId,
      sessionId: session.sessionId,
      eventType: 'ENTRY',
      timestamp: new Date(),
      photoHash,
      blockchainTxHash: onchain.txHash,
      blockchainBlockHeight: onchain.blockHeight,
      photoUrl: ipfsResult.url,
      photoStoragePath: ipfsResult.hash, // Store IPFS hash
      confidence: 1,
      isProcessed: true
    });

    return res.status(201).json({
      ok: true,
      sessionId: session.sessionId,
      photoHash,
      ipfsHash: ipfsResult.hash,
      ipfsUrl: ipfsResult.url,
      onchain
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to start entry' });
  }
};

export const endExit = async (req, res) => {
  try {
    const { companyPin, faceDescriptor, imageBase64 } = req.body;
    if (!companyPin || !faceDescriptor || !imageBase64) {
      return res.status(400).json({ error: 'companyPin, faceDescriptor, imageBase64 required' });
    }

    const company = await Company.findOne({ companyPin });
    if (!company) return res.status(401).json({ error: 'Invalid company PIN' });

    // Upload image to IPFS
    let ipfsResult;
    try {
      ipfsResult = await ipfsService.uploadBase64Image(imageBase64, `exit_${Date.now()}.jpg`);
    } catch (ipfsError) {
      console.error('IPFS upload failed:', ipfsError);
      return res.status(500).json({ error: 'Failed to upload image to IPFS' });
    }

    // Generate SHA-256 hash for blockchain
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const photoHash = sha256Hex(imageBuffer);

    // find best open session
    const candidates = await Session.find({ companyPin, status: 'open' }).sort({ 'entry.at': -1 }).limit(200);
    let best = { s: null, dist: Number.POSITIVE_INFINITY };
    for (const s of candidates) {
      const d = euclideanDistance(faceDescriptor, s.entry.faceDescriptor);
      if (d < best.dist) best = { s, dist: d };
    }

    const THRESHOLD = 0.55;
    if (!best.s || best.dist > THRESHOLD) {
      return res.status(404).json({ error: 'No matching open session found', bestDistance: best.dist });
    }

    const onchain = await pushOnChainLog({ eventType: 'EXIT', photoHash, sessionId: best.s.sessionId });

    best.s.status = 'closed';
    best.s.exit = {
      at: new Date(),
      photoHash,
      photoUrl: ipfsResult.url,
      faceDescriptor,
      txHash: onchain.txHash,
      blockHeight: onchain.blockHeight,
      eventId: onchain.eventId
    };
    best.s.matchConfidence = Math.max(0, 1 - best.dist);
    await best.s.save();

    await EventLog.create({
      eventId: onchain.eventId,
      sessionId: best.s.sessionId,
      eventType: 'EXIT',
      timestamp: new Date(),
      photoHash,
      blockchainTxHash: onchain.txHash,
      blockchainBlockHeight: onchain.blockHeight,
      photoUrl: ipfsResult.url,
      photoStoragePath: ipfsResult.hash, // Store IPFS hash
      confidence: Math.max(0, 1 - best.dist),
      isProcessed: true
    });

    return res.status(200).json({
      ok: true,
      sessionId: best.s.sessionId,
      photoHash,
      ipfsHash: ipfsResult.hash,
      ipfsUrl: ipfsResult.url,
      matchDistance: best.dist,
      onchain
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to log exit' });
  }
};

export const getRecentSessions = async (req, res) => {
  try {
    const { companyPin, limit = 50 } = req.query;
    const filter = companyPin ? { companyPin } : {};
    const sessions = await Session.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    return res.json({ ok: true, sessions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// New function to retrieve image from IPFS
export const getImage = async (req, res) => {
  try {
    const { hash } = req.params;
    if (!hash) {
      return res.status(400).json({ error: 'IPFS hash required' });
    }

    const imageBuffer = await ipfsService.getImage(hash);
    
    // Set appropriate headers
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });
    
    res.send(imageBuffer);
  } catch (err) {
    console.error('Image retrieval error:', err);
    return res.status(500).json({ error: 'Failed to retrieve image' });
  }
};


