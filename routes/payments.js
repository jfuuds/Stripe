const express = require('express');
const router = express.Router();
const { stripe, handleStripeError } = require('../utils/stripe');

/**
 * POST /api/payments/intent
 * Create a Payment Intent
 * Body: { amount: number, currency: string, description?: string }
 */
router.post('/intent', async (req, res) => {
  try {
    const { amount, currency, description, customer_id } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'amount and currency are required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: description || 'Demo payment',
      ...(customer_id && { customer: customer_id }),
    });

    res.json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/payments/charge
 * Create a direct charge (legacy, but still supported)
 * Body: { amount: number, currency: string, source: string, description?: string }
 */
router.post('/charge', async (req, res) => {
  try {
    const { amount, currency, source, description } = req.body;

    if (!amount || !currency || !source) {
      return res.status(400).json({
        error: 'amount, currency, and source are required',
      });
    }

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      source,
      description: description || 'Demo charge',
    });

    res.json({
      success: true,
      charge,
    });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/payments/intent/:id
 * Retrieve a Payment Intent
 */
router.get('/intent/:id', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
    res.json({ success: true, paymentIntent });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/payments/intent/:id/confirm
 * Confirm a Payment Intent
 * Body: { payment_method: string }
 */
router.post('/intent/:id/confirm', async (req, res) => {
  try {
    const { payment_method } = req.body;

    if (!payment_method) {
      return res.status(400).json({ error: 'payment_method is required' });
    }

    const paymentIntent = await stripe.paymentIntents.confirm(req.params.id, {
      payment_method,
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/payments/list
 * List all payment intents
 * Query: { limit?: number, status?: string }
 */
router.get('/list', async (req, res) => {
  try {
    const { limit = 10, status } = req.query;
    const queryParams = {
      limit: parseInt(limit),
    };

    if (status) {
      queryParams.status = status;
    }

    const paymentIntents = await stripe.paymentIntents.list(queryParams);
    res.json({ success: true, paymentIntents });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

module.exports = router;
