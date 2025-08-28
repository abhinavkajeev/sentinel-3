import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  companyPin: {
    type: String,
    required: true,
    unique: true,
    length: 6
  }
}, {
  timestamps: true
});

// Generate random alphanumeric pin before saving
companySchema.pre('save', async function(next) {
  if (!this.isModified('companyPin')) {
    return next();
  }
  
  // Generate a random 6 character alphanumeric string
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  this.companyPin = pin;
  next();
});

const Company = mongoose.model('Company', companySchema);

export default Company;