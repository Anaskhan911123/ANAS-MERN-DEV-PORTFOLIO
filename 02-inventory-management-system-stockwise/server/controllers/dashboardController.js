const Product = require('../models/Product');
const StockActivity = require('../models/StockActivity');

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const products = await Product.find();

    const inventoryValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    const productsInStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const categoryCount = new Set(products.map((p) => p.category)).size;

    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.reorderLevel
    );
    const criticalCount = products.filter(
      (p) => p.quantity <= p.criticalLevel
    ).length;

    res.json({
      inventoryValue,
      productsInStock,
      categoryCount,
      lowStockCount: lowStockProducts.length,
      criticalCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/stock-overview
// Feeds the "Stock overview" list — a handful of products worth flagging
const getStockOverview = async (req, res) => {
  try {
    const products = await Product.find()
          .sort({ quantity: 1 })
      .limit(4);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSummary, getStockOverview };