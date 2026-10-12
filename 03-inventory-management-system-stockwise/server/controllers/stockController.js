const Product = require('../models/Product');
const StockActivity = require('../models/StockActivity');

// POST /api/stock/receive  { productId, quantity }
const receiveStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity += quantity;
    await product.save();

    const activity = await StockActivity.create({
      type: 'received',
      product: product._id,
      quantity,
      description: `${quantity} ${product.name} added to warehouse`,
    });

    res.status(201).json({ product, activity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/stock/fulfill  { productId, quantity, orderId }
const fulfillOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let { orderId } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock to fulfill this order' });
    }

    if (!orderId) {
      orderId = `#${Math.floor(10000 + Math.random() * 90000)}`;
    }

    product.quantity -= quantity;
    await product.save();

    const activity = await StockActivity.create({
      type: 'fulfilled',
      product: product._id,
      quantity,
      orderId,
      description: `Order ${orderId} shipped — ${quantity} ${product.name}`,
    });

    res.status(201).json({ product, activity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/stock/adjust  { productId, newQuantity }
const adjustStock = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    if (newQuantity === undefined || newQuantity < 0) {
      return res.status(400).json({ message: 'newQuantity must be 0 or greater' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const oldQuantity = product.quantity;
    product.quantity = newQuantity;
    await product.save();

    const activity = await StockActivity.create({
      type: 'adjusted',
      product: product._id,
      quantity: newQuantity - oldQuantity,
      description: `${product.name} quantity changed from ${oldQuantity} to ${newQuantity}`,
    });

    res.status(201).json({ product, activity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/stock/activity
const getActivity = async (req, res) => {
  try {
    const activity = await StockActivity.find()
      .populate('product', 'name sku')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { receiveStock, fulfillOrder, adjustStock, getActivity };