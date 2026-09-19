const express = require('express');
const router = express.Router();
const { stripe, handleStripeError } = require('../utils/stripe');

/**
 * POST /api/invoices
 * Create an invoice
 * Body: { customer: string, description?: string, metadata?: object }
 */
router.post('/', async (req, res) => {
  try {
    const { customer, description, metadata } = req.body;

    if (!customer) {
      return res.status(400).json({ error: 'customer is required' });
    }

    const invoice = await stripe.invoices.create({
      customer,
      description: description || undefined,
      metadata: metadata || undefined,
    });

    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/invoices/:id
 * Retrieve an invoice
 */
router.get('/:id', async (req, res) => {
  try {
    const invoice = await stripe.invoices.retrieve(req.params.id);
    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/invoices/:id
 * Update an invoice
 */
router.post('/:id', async (req, res) => {
  try {
    const { description, metadata } = req.body;

    const invoice = await stripe.invoices.update(req.params.id, {
      description: description || undefined,
      metadata: metadata || undefined,
    });

    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * GET /api/invoices
 * List invoices
 * Query: { customer?: string, limit?: number, status?: string }
 */
router.get('/', async (req, res) => {
  try {
    const { customer, limit = 10, status } = req.query;

    const queryParams = {
      limit: parseInt(limit),
    };

    if (customer) {
      queryParams.customer = customer;
    }

    if (status) {
      queryParams.status = status;
    }

    const invoices = await stripe.invoices.list(queryParams);

    res.json({ success: true, invoices });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/invoices/:id/finalize
 * Finalize (lock) an invoice
 */
router.post('/:id/finalize', async (req, res) => {
  try {
    const invoice = await stripe.invoices.finalizeInvoice(req.params.id);
    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/invoices/:id/send
 * Send an invoice to the customer
 */
router.post('/:id/send', async (req, res) => {
  try {
    const invoice = await stripe.invoices.sendInvoice(req.params.id);
    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/invoices/:id/pay
 * Pay an invoice
 * Body: { paid_out_of_band?: boolean }
 */
router.post('/:id/pay', async (req, res) => {
  try {
    const { paid_out_of_band = false } = req.body;

    const invoice = await stripe.invoices.pay(req.params.id, {
      paid_out_of_band,
    });

    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/invoices/:id/void
 * Void an invoice
 */
router.post('/:id/void', async (req, res) => {
  try {
    const invoice = await stripe.invoices.voidInvoice(req.params.id);
    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

/**
 * POST /api/invoices/:id/line-items
 * Add a line item to an invoice (draft only)
 * Body: { price?: string, amount?: number, description?: string, quantity?: number }
 */
router.post('/:id/line-items', async (req, res) => {
  try {
    const { price, amount, description, quantity = 1 } = req.body;

    const lineItem = {
      quantity,
    };

    if (price) {
      lineItem.price = price;
    } else if (amount && description) {
      lineItem.amount = Math.round(amount * 100);
      lineItem.description = description;
    } else {
      return res
        .status(400)
        .json({
          error:
            'Either price or (amount and description) are required',
        });
    }

    const invoice = await stripe.invoices.addLines(req.params.id, {
      line_items: [lineItem],
    });

    res.json({ success: true, invoice });
  } catch (error) {
    const errorInfo = handleStripeError(error);
    res.status(errorInfo.status).json({ error: errorInfo.message });
  }
});

module.exports = router;
