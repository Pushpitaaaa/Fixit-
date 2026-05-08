const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    includedItems: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
);

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    services: {
      type: [serviceSchema],
      default: [],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    portfolio: {
      type: [String],
      default: [],
    },
    maxBookingsPerDay: {
      type: Number,
      default: 3,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalJobs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);
