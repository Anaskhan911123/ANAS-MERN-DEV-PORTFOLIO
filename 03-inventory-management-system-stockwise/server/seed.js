const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const StockActivity = require('./models/StockActivity');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected — seeding...');

    // Clear existing data so this script is safe to re-run
    await Product.deleteMany({});
    await StockActivity.deleteMany({});

    const products = await Product.insertMany([
      {
        name: 'Ergonomic Chair',
        sku: 'SKU-48291',
        category: 'Furniture',
        quantity: 48,
        price: 220,
        reorderLevel: 15,
        criticalLevel: 8,
      },
      {
        name: 'Desk Lamp, Brass',
        sku: 'SKU-29104',
        category: 'Lighting',
        quantity: 12,
        price: 65,
        reorderLevel: 15,
        criticalLevel: 8,
      },
      {
        name: 'Monitor Stand',
        sku: 'SKU-82376',
        category: 'Accessories',
        quantity: 64,
        price: 45,
        reorderLevel: 15,
        criticalLevel: 8,
      },
      {
        name: 'Studio Headphones',
        sku: 'SKU-34918',
        category: 'Electronics',
        quantity: 8,
        price: 180,
        reorderLevel: 15,
        criticalLevel: 8,
      },
      {
        name: 'side table',
        sku: 'shquy37772',
        category: 'Accessories',
        quantity: 6,
        price: 90,
        reorderLevel: 15,
        criticalLevel: 8,
      },
    ]);

    const [chair, lamp, standMonitor] = products; // reuse for activity below

    const now = new Date();
    const today = (h, m) => {
      const d = new Date(now);
      d.setHours(h, m, 0, 0);
      return d;
    };
    const yesterday = (h, m) => {
      const d = today(h, m);
      d.setDate(d.getDate() - 1);
      return d;
    };

    await StockActivity.insertMany([
      {
        type: 'received',
        product: chair._id,
        quantity: 24,
        description: '24 Ergonomic Chairs added to warehouse',
        createdAt: today(10, 42),
      },
      {
        type: 'fulfilled',
        product: lamp._id,
        quantity: 2,
        orderId: '#10482',
        description: 'Order #10482 shipped — 2 Desk Lamps',
        createdAt: today(10, 20),
      },
      {
        type: 'adjusted',
        product: lamp._id,
        quantity: -2,
        description: 'Desk Lamp quantity changed from 14 to 12',
        createdAt: today(9, 31),
      },
      {
        type: 'received',
        product: standMonitor._id,
        quantity: 18,
        description: '18 Monitor Stands added to warehouse',
        createdAt: today(7, 15),
      },
      {
        type: 'fulfilled',
        product: chair._id,
        quantity: 3,
        orderId: '#10475',
        description: 'Order #10475 shipped — 3 Ergonomic Chairs',
        createdAt: yesterday(16, 3),
      },
    ]);

    console.log(`Seeded ${products.length} products and 5 activity entries.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();