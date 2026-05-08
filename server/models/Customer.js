const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, default: '', trim: true },
    profilePic: { type: String, default: '' },
    phone: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
