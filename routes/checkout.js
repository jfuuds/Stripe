const express = require('express');
const router = express.Router();
const { stripe, handleStripeError } = require('../utils/stripe');

/**
 * POST /api/checkout/session
 * Create a Checkout session
 * Body: { 
 *   line_items: array, 
 *   customer?: string,
 *   success_url: string, 
 *   cancel_url: string,
 *   mode?: string (payment|setup|subscription)
 * }
 */
router.post('/session', async (req, res) => {
  try {
    const {
      line_items,
      customer,
      success_url,
      cancel_url,
      mode = 'payment',
      customer_email,
      metadata,
    } = req.body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({
        error:
          'line_items is required and must be a non-empty array',
      });
    }

    if (!success_url || !cancel_url) {
      return res.status(400).json({
        error: 'success_url and cancel_url are required',
      });
    }

    const sessionData = {
      line_items,
      mode,
      success_url,
      cancel_url,
      metadata: metadata || undefined,
    };

    // Add customer info (either customer ID or email)
    if (customer) {
      sessionData.customer = customer;
    } else if (customer_email) {
      sessionData.customer_email = customer_email;
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    res.json({ success: true, session });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/checkout/session/:id
 * Retrieve a Checkout session
 */
router.get('/session/:id', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ['payment_intent', 'subscription'],
    });

    res.json({ success: true, session });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/checkout/session/:id/line-items
 * Retrieve line items from a Checkout session
 */
router.get('/session/:id/line-items', async (req, res) => {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(
      req.params.id,
      { limit: 100 }
    );

    res.json({ success: true, lineItems });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/checkout/quick-session
 * Quick helper to create a simple checkout session
 * Body: { price_id: string, success_url: string, cancel_url: string }
 */
router.post('/quick-session', async (req, res) => {
  try {
    const { price_id, success_url, cancel_url } = req.body;

    if (!price_id || !success_url || !cancel_url) {
      return res.status(400).json({
        error:
          'price_id, success_url, and cancel_url are required',
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url,
      cancel_url,
    });

    res.json({ success: true, session });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

module.exports = router;
