const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, default: '', trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    reply: { type: String, default: '' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
