import express from 'express';
import { startEntry, endExit, getRecentSessions, getImage } from '../controllers/sessionController.js';

const router = express.Router();

// Log entry event
router.post('/entry', startEntry);

// Log exit event
router.post('/exit', endExit);

// Get recent sessions
router.get('/recent', getRecentSessions);

// Get image from IPFS
router.get('/image/:hash', getImage);

export default router;