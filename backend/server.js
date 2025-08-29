// backend/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import companyRoutes from './routes/companyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import ipfsRoutes from './routes/ipfsRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3070;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set; set it in backend/.env');
}
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sentinel3')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

// Routes
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/ipfs', ipfsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Sentinel-3 backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
