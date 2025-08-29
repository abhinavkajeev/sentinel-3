import express from 'express';
import IPFSService from '../services/ipfsService.js';

const router = express.Router();
const ipfsService = new IPFSService();

// POST /api/ipfs/upload - Upload image directly to IPFS
router.post('/upload', async (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ 
        error: 'Image data is required',
        success: false 
      });
    }

    console.log('Uploading image to IPFS...');
    
    // Upload to IPFS
    const result = await ipfsService.uploadBase64Image(imageBase64, filename);
    
    console.log('Image uploaded successfully:', result.hash);
    
    res.json({
      success: true,
      hash: result.hash,
      url: result.url,
      cid: result.cid,
      gateway: result.url,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
});

// GET /api/ipfs/:hash - Retrieve image from IPFS
router.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Get gateway URL
    const url = ipfsService.getGatewayUrl(hash);
    
    res.json({
      success: true,
      hash,
      url,
      gateway: url
    });
    
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
});

export default router;
