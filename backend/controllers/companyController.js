import Company from '../models/Company.js';

export const registerCompany = async (req, res) => {
  try {
    const { companyName, phoneNumber, email, password } = req.body;
    if (!companyName || !phoneNumber || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await Company.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const company = await Company.create({ companyName, phoneNumber, email, password, companyPin: 'INIT' });
    // Pre-save hook will set the 6-digit alphanumeric pin
    await company.save();
    return res.status(201).json({ ok: true, companyPin: company.companyPin, companyId: company._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginWithPin = async (req, res) => {
  try {
    const { companyPin } = req.body;
    if (!companyPin) return res.status(400).json({ error: 'companyPin required' });
    const company = await Company.findOne({ companyPin });
    if (!company) return res.status(401).json({ error: 'Invalid PIN' });
    return res.json({ ok: true, companyId: company._id, companyName: company.companyName });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
};