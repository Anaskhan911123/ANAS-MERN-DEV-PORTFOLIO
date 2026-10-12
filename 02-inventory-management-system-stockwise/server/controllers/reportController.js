const Product = require('../models/Product');
const StockActivity = require('../models/StockActivity');

// GET /api/reports/units-movement
// Returns units received vs fulfilled for each of the last 7 days (Mon–Sun)
const getUnitsMovement = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // include today = 7 days total
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const activity = await StockActivity.find({
      createdAt: { $gte: sevenDaysAgo },
      type: { $in: ['received', 'fulfilled'] },
    });

    // Build a Mon–Sun bucket, all zeroed out first
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const buckets = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
      buckets[key] = { day: dayLabels[d.getDay()], unitsIn: 0, unitsOut: 0 };
    }

    // Drop each activity into its day's bucket
    activity.forEach((entry) => {
      const key = entry.createdAt.toISOString().split('T')[0];
      if (!buckets[key]) return; // outside range, skip
      if (entry.type === 'received') buckets[key].unitsIn += entry.quantity;
      if (entry.type === 'fulfilled') buckets[key].unitsOut += entry.quantity;
    });

    const result = Object.values(buckets).map((b) => ({
      ...b,
      total: b.unitsIn + b.unitsOut, // what the bar height represents
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/top-category
// Returns every category's share of total inventory value, sorted highest first
const getTopCategory = async (req, res) => {
  try {
    const products = await Product.find();

    const valueByCategory = {};
    let totalValue = 0;

    products.forEach((p) => {
      const value = p.quantity * p.price;
      valueByCategory[p.category] = (valueByCategory[p.category] || 0) + value;
      totalValue += value;
    });

    const breakdown = Object.entries(valueByCategory)
      .map(([category, value]) => ({
        category,
        value,
        percentage: totalValue ? Number(((value / totalValue) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    res.json({
      topCategory: breakdown[0] || null, // e.g. { category: 'Furniture', percentage: 42.8 }
      breakdown, // full list, useful if you want a legend later
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUnitsMovement, getTopCategory };