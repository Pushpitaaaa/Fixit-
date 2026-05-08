const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    includedItems: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
