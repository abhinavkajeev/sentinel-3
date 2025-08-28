import express from 'express';
import { registerCompany, loginWithPin } from '../controllers/companyController.js';

const router = express.Router();

router.post('/register', registerCompany);
router.post('/login', loginWithPin);

export default router;