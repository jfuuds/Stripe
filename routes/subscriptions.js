const express = require('express');
const router = express.Router();
const { stripe, handleStripeError } = require('../utils/stripe');

/**
 * POST /api/subscriptions
 * Create a subscription
 * Body: { customer: string, price: string, trial_period_days?: number, metadata?: object }
 */
router.post('/', async (req, res) => {
  try {
    const { customer, price, trial_period_days, metadata } = req.body;

    if (!customer || !price) {
      return res
        .status(400)
        .json({ error: 'customer and price are required' });
    }

    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ price }],
      trial_period_days: trial_period_days || undefined,
      metadata: metadata || undefined,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({ success: true, subscription });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/subscriptions/:id
 * Retrieve a subscription
 */
router.get('/:id', async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(req.params.id, {
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({ success: true, subscription });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/subscriptions/:id
 * Update a subscription
 * Body: { items?: array, trial_period_days?: number, metadata?: object }
 */
router.post('/:id', async (req, res) => {
  try {
    const { items, trial_period_days, metadata } = req.body;

    const updateData = {
      metadata: metadata || undefined,
    };

    if (trial_period_days) {
      updateData.trial_period_days = trial_period_days;
    }

    if (items) {
      updateData.items = items;
    }

    const subscription = await stripe.subscriptions.update(
      req.params.id,
      updateData
    );

    res.json({ success: true, subscription });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * DELETE /api/subscriptions/:id
 * Cancel a subscription
 * Query: { cancel_at_period_end?: boolean }
 */
router.delete('/:id', async (req, res) => {
  try {
    const { cancel_at_period_end = false } = req.query;

    const subscription = await stripe.subscriptions.del(req.params.id, {
      cancel_at_period_end: cancel_at_period_end === 'true',
    });

    res.json({ success: true, subscription });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/subscriptions
 * List subscriptions
 * Query: { customer?: string, limit?: number, status?: string }
 */
router.get('/', async (req, res) => {
  try {
    const { customer, limit = 10, status } = req.query;

    const queryParams = {
      limit: parseInt(limit),
      expand: ['data.latest_invoice.payment_intent'],
    };

    if (customer) {
      queryParams.customer = customer;
    }

    if (status) {
      queryParams.status = status;
    }

    const subscriptions = await stripe.subscriptions.list(queryParams);

    res.json({ success: true, subscriptions });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/subscriptions/:id/resume
 * Resume a subscription
 */
router.post('/:id/resume', async (req, res) => {
  try {
    const subscription = await stripe.subscriptions.update(req.params.id, {
      cancel_at_period_end: false,
    });

    res.json({ success: true, subscription });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

module.exports = router;
