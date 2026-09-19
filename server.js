const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const paymentsRouter = require('./routes/payments');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const subscriptionsRouter = require('./routes/subscriptions');
const invoicesRouter = require('./routes/invoices');
const checkoutRouter = require('./routes/checkout');

// Routes
app.use('/api/payments', paymentsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/checkout', checkoutRouter);

// Stripe publishable key endpoint
app.get('/api/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Shop products endpoint
app.get('/api/shop/products', (req, res) => {
  const products = [
    {
      id: 'golf-driver-pro',
      name: 'Pro Driver 460cc',
      category: 'Clubs',
      price: 199.99,
      image: 'https://loremflickr.com/400/400/golf,driver?lock=1',
      description: 'Professional grade driver for maximum distance',
      badge: 'Popular',
    },
    {
      id: 'golf-putter-elite',
      name: 'Elite Putter',
      category: 'Clubs',
      price: 89.99,
      image: 'https://loremflickr.com/400/400/golf,putter?lock=2',
      description: 'Precision milled putter for consistent strokes',
      badge: null,
    },
    {
      id: 'golf-irons-set',
      name: 'Iron Set (4-9, PW)',
      category: 'Clubs',
      price: 449.99,
      image: 'https://loremflickr.com/400/400/golf,iron?lock=3',
      description: 'Complete iron set for intermediate players',
      badge: 'Best Value',
    },
    {
      id: 'golf-balls-premium',
      name: 'Premium Golf Balls (Dozen)',
      category: 'Balls',
      price: 39.99,
      image: 'https://loremflickr.com/400/400/golf,ball?lock=4',
      description: 'High-performance tour-quality golf balls',
      badge: null,
    },
    {
      id: 'golf-balls-standard',
      name: 'Standard Golf Balls (Dozen)',
      category: 'Balls',
      price: 24.99,
      image: 'https://loremflickr.com/400/400/golf,ball?lock=5',
      description: 'Reliable balls for practice and play',
      badge: null,
    },
    {
      id: 'golf-bag-stand',
      name: 'Stand Golf Bag',
      category: 'Bags',
      price: 129.99,
      image: 'https://loremflickr.com/400/400/golf,bag?lock=6',
      description: '14-way divider stand bag with storage',
      badge: null,
    },
    {
      id: 'golf-bag-cart',
      name: 'Cart Golf Bag',
      category: 'Bags',
      price: 149.99,
      image: 'https://loremflickr.com/400/400/golf,bag?lock=7',
      description: 'Waterproof cart bag with multiple pockets',
      badge: 'New',
    },
    {
      id: 'golf-shoes-pro',
      name: 'Pro Golf Shoes',
      category: 'Apparel',
      price: 119.99,
      image: 'https://loremflickr.com/400/400/golf,shoes?lock=8',
      description: 'Waterproof spiked shoes for all-weather play',
      badge: null,
    },
    {
      id: 'golf-glove-set',
      name: 'Golf Glove (Left, 3-Pack)',
      category: 'Accessories',
      price: 44.99,
      image: 'https://loremflickr.com/400/400/golf,glove?lock=9',
      description: 'Premium leather gloves for better grip',
      badge: null,
    },
    {
      id: 'golf-tees-pack',
      name: 'Bamboo Golf Tees (500 Pack)',
      category: 'Accessories',
      price: 14.99,
      image: 'https://loremflickr.com/400/400/golf,tees?lock=10',
      description: 'Eco-friendly bamboo tees',
      badge: null,
    },
  ];
  res.json({ success: true, products });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stripe Demo API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    type: err.type,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Stripe API Key configured: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗'}`);
});
