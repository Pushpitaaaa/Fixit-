const mongoose = require('mongoose');

const { Schema } = mongoose;

const uploadSchema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Upload || mongoose.model('Upload', uploadSchema);
