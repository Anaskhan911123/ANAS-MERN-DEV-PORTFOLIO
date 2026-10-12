const mongoose = require('mongoose');

const stockActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['received', 'fulfilled', 'adjusted'],
    required: true,
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }, // units added/removed/changed
  description: { type: String, required: true }, // e.g. "24 Ergonomic Chairs added to warehouse"
  orderId: { type: String }, // only used when type === 'fulfilled'
}, { timestamps: true }); // createdAt doubles as the activity timestamp

module.exports = mongoose.model('StockActivity', stockActivitySchema);