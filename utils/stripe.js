require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Helper to handle errors
const handleStripeError = (error) => {
  if (error.type === 'StripeInvalidRequestError') {
    return { status: 400, message: error.message };
  } else if (error.type === 'StripeAuthenticationError') {
    return { status: 401, message: 'Stripe authentication failed' };
  }
  return { status: 500, message: error.message };
};

module.exports = { stripe, handleStripeError };
