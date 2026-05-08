const mongoose = require('mongoose');

const { Schema } = mongoose;

const providerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    isOpen: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    portfolio: { type: [String], default: [] },
    maxBookingsPerDay: { type: Number, default: 3 },
    averageRating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Provider || mongoose.model('Provider', providerSchema);
