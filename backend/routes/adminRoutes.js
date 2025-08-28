import express from 'express';
import { getHealth } from '../controllers/adminController.js';

const router = express.Router();

router.get('/health', getHealth);

export default router;