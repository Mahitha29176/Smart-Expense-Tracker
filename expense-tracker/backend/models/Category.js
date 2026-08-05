const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: '📦' },
    color: { type: String, default: '#6366f1' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
