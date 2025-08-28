import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
    unique: true
  },
  sessionId: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    enum: ['ENTRY', 'EXIT'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  photoHash: {
    type: String,
    required: true,
    trim: true
  },
  // Blockchain transaction details
  blockchainTxHash: {
    type: String,
    trim: true
  },
  blockchainBlockHeight: {
    type: Number
  },
  // Photo storage details
  photoUrl: {
    type: String,
    trim: true
  },
  photoStoragePath: {
    type: String,
    trim: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  // Status tracking
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingError: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
eventLogSchema.index({ sessionId: 1, timestamp: -1 });
eventLogSchema.index({ eventType: 1, timestamp: -1 });
eventLogSchema.index({ timestamp: -1 });
eventLogSchema.index({ photoHash: 1 });
eventLogSchema.index({ blockchainTxHash: 1 });

// Virtual for formatted timestamp
eventLogSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleString();
});

// Method to get recent events
eventLogSchema.statics.getRecentEvents = function(limit = 50) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Method to get events by session
eventLogSchema.statics.getEventsBySession = function(sessionId, limit = 100) {
  return this.find({ sessionId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Method to get events by type
eventLogSchema.statics.getEventsByType = function(eventType, limit = 100) {
  return this.find({ eventType })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Method to get events by date range
eventLogSchema.statics.getEventsByDateRange = function(startDate, endDate) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ timestamp: -1 });
};

// Method to get events with photos
eventLogSchema.statics.getEventsWithPhotos = function(limit = 100) {
  return this.find({
    $or: [
      { photoUrl: { $exists: true, $ne: null } },
      { photoStoragePath: { $exists: true, $ne: null } }
    ]
  }).sort({ timestamp: -1 }).limit(limit);
};

// Method to get blockchain status
eventLogSchema.statics.getBlockchainStatus = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        onChainEvents: { $sum: { $cond: [{ $ne: ['$blockchainTxHash', null] }, 1, 0] } },
        pendingEvents: { $sum: { $cond: [{ $eq: ['$blockchainTxHash', null] }, 1, 0] } }
      }
    }
  ]);
};

// Method to get daily event counts
eventLogSchema.statics.getDailyEventCounts = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$timestamp"
          }
        },
        entryCount: {
          $sum: { $cond: [{ $eq: ['$eventType', 'ENTRY'] }, 1, 0] }
        },
        exitCount: {
          $sum: { $cond: [{ $eq: ['$eventType', 'EXIT'] }, 1, 0] }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Pre-save middleware to ensure eventId is unique
eventLogSchema.pre('save', async function(next) {
  if (this.isNew && !this.eventId) {
    // Generate event ID if not provided
    const lastEvent = await this.constructor.findOne().sort({ eventId: -1 });
    this.eventId = lastEvent ? lastEvent.eventId + 1 : 1;
  }
  next();
});

const EventLog = mongoose.model('EventLog', eventLogSchema);

export default EventLog;
