const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true, default: 15 }, // below this = "Low stock"
  criticalLevel: { type: Number, required: true, default: 8 }, // below this = "Critical"
}, { timestamps: true });

// Virtual field: computes status on the fly instead of storing it
productSchema.virtual('status').get(function () {
  if (this.quantity <= this.criticalLevel) return 'Critical';
  if (this.quantity <= this.reorderLevel) return 'Low stock';
  return 'Healthy';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);