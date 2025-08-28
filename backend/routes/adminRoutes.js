import express from 'express';
import { getHealth, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.get('/health', getHealth);
router.post('/login', loginAdmin);

export default router;