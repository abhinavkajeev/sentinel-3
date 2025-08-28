import Admin from '../models/Admin.js';

export const getHealth = async (_req, res) => {
  return res.json({ ok: true, service: 'sentinel-3-backend' });
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }
    const admin = await Admin.findOne({ username, password });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    return res.json({ ok: true, adminId: admin._id, username: admin.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
};