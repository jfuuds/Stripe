const express = require('express');
const router = express.Router();
const { stripe, handleStripeError } = require('../utils/stripe');

/**
 * POST /api/customers
 * Create a new customer
 * Body: { email: string, name?: string, description?: string, metadata?: object }
 */
router.post('/', async (req, res) => {
  try {
    const { email, name, description, metadata } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      description: description || undefined,
      metadata: metadata || undefined,
    });

    res.json({ success: true, customer });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/customers/:id
 * Retrieve a customer
 */
router.get('/:id', async (req, res) => {
  try {
    const customer = await stripe.customers.retrieve(req.params.id);
    res.json({ success: true, customer });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/customers/:id
 * Update a customer
 * Body: { email?: string, name?: string, description?: string, metadata?: object }
 */
router.post('/:id', async (req, res) => {
  try {
    const { email, name, description, metadata } = req.body;

    const customer = await stripe.customers.update(req.params.id, {
      email: email || undefined,
      name: name || undefined,
      description: description || undefined,
      metadata: metadata || undefined,
    });

    res.json({ success: true, customer });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * DELETE /api/customers/:id
 * Delete a customer
 */
router.delete('/:id', async (req, res) => {
  try {
    const customer = await stripe.customers.del(req.params.id);
    res.json({ success: true, customer });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/customers
 * List all customers
 * Query: { limit?: number, email?: string }
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 10, email } = req.query;
    const queryParams = {
      limit: parseInt(limit),
    };

    if (email) {
      queryParams.email = email;
    }

    const customers = await stripe.customers.list(queryParams);
    res.json({ success: true, customers });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/customers/:id/payment-method
 * Add a payment method to a customer
 * Body: { payment_method: string }
 */
router.post('/:id/payment-method', async (req, res) => {
  try {
    const { payment_method } = req.body;

    if (!payment_method) {
      return res.status(400).json({ error: 'payment_method is required' });
    }

    const paymentMethod = await stripe.paymentMethods.attach(payment_method, {
      customer: req.params.id,
    });

    res.json({ success: true, paymentMethod });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/customers/:id/payment-methods
 * List payment methods for a customer
 */
router.get('/:id/payment-methods', async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.params.id,
      type: 'card',
    });

    res.json({ success: true, paymentMethods });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

module.exports = router;
