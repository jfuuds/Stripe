const express = require('express');
const router = express.Router();
const { stripe, handleStripeError } = require('../utils/stripe');

/**
 * POST /api/products
 * Create a new product
 * Body: { name: string, description?: string, type?: string, metadata?: object }
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, type = 'service', metadata } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const product = await stripe.products.create({
      name,
      description: description || undefined,
      type,
      metadata: metadata || undefined,
    });

    res.json({ success: true, product });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/products/:id
 * Retrieve a product
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await stripe.products.retrieve(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/products/:id
 * Update a product
 */
router.post('/:id', async (req, res) => {
  try {
    const { name, description, metadata } = req.body;

    const product = await stripe.products.update(req.params.id, {
      name: name || undefined,
      description: description || undefined,
      metadata: metadata || undefined,
    });

    res.json({ success: true, product });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/products
 * List all products
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await stripe.products.list({
      limit: parseInt(limit),
      active: true,
    });

    res.json({ success: true, products });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/products/:id/prices
 * Create a price for a product
 * Body: { amount: number, currency: string, billing_scheme?: string, recurring?: { interval: string, interval_count?: number } }
 */
router.post('/:id/prices', async (req, res) => {
  try {
    const { amount, currency, billing_scheme = 'per_unit', recurring } = req.body;

    if (!amount || !currency) {
      return res
        .status(400)
        .json({ error: 'amount and currency are required' });
    }

    const priceData = {
      product: req.params.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      billing_scheme,
      recurring: recurring || undefined,
    };

    const price = await stripe.prices.create(priceData);

    res.json({ success: true, price });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/products/:id/prices
 * List prices for a product
 */
router.get('/:id/prices', async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      product: req.params.id,
    });

    res.json({ success: true, prices });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/products/prices/:price_id
 * Retrieve a specific price
 */
router.get('/prices/:price_id', async (req, res) => {
  try {
    const price = await stripe.prices.retrieve(req.params.price_id);
    res.json({ success: true, price });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

module.exports = router;
