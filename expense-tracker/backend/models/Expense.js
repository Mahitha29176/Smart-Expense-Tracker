const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: [0.01, 'Amount must be greater than 0'] },
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, trim: true, default: '' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'bank_transfer', 'other'], default: 'cash' },
  },
  { timestamps: true }
);

ExpenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
