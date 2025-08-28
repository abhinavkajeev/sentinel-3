import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  companyPin: { type: String, required: true, index: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open', index: true },

  entry: {
    at: { type: Date },
    photoHash: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    faceDescriptor: { type: [Number] },
    txHash: { type: String, trim: true },
    blockHeight: { type: Number },
    eventId: { type: Number }
  },

  exit: {
    at: { type: Date },
    photoHash: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    faceDescriptor: { type: [Number] },
    txHash: { type: String, trim: true },
    blockHeight: { type: Number },
    eventId: { type: Number }
  },

  matchConfidence: { type: Number, min: 0, max: 1 },
}, { timestamps: true });

sessionSchema.index({ companyPin: 1, status: 1, 'entry.at': -1 });

sessionSchema.pre('save', function(next) {
  if (this.isNew && !this.sessionId) {
    const id = `S${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`.toUpperCase();
    this.sessionId = id;
  }
  next();
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;


