/**
 * Stripe Demo API - Quick Test Guide
 * 
 * Run the server first: npm run dev
 * Then use these curl commands to test the API
 */

// ============================================
// 1. CUSTOMERS API
// ============================================

// Create a customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "description": "Test customer"
  }'

// Response: { "success": true, "customer": { "id": "cus_xxx", ... } }
// Save the customer ID as CUS_ID for next steps


// List all customers
curl -X GET "http://localhost:3000/api/customers?limit=10"


// Get a specific customer
curl -X GET http://localhost:3000/api/customers/cus_xxx


// Update a customer
curl -X POST http://localhost:3000/api/customers/cus_xxx \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'


// ============================================
// 2. PRODUCTS & PRICES API
// ============================================

// Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Professional Plan",
    "description": "Monthly subscription for professionals",
    "type": "service"
  }'

// Response: { "success": true, "product": { "id": "prod_xxx", ... } }
// Save the product ID as PROD_ID


// List all products
curl -X GET "http://localhost:3000/api/products?limit=10"


// Create a price for the product
curl -X POST http://localhost:3000/api/products/prod_xxx/prices \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.99,
    "currency": "usd",
    "recurring": {
      "interval": "month",
      "interval_count": 1
    }
  }'

// Response: { "success": true, "price": { "id": "price_xxx", ... } }
// Save the price ID as PRICE_ID


// List prices for a product
curl -X GET http://localhost:3000/api/products/prod_xxx/prices


// ============================================
// 3. PAYMENTS & PAYMENT INTENTS
// ============================================

// Create a Payment Intent
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 49.99,
    "currency": "usd",
    "description": "Purchase of Professional Plan",
    "customer_id": "cus_xxx"
  }'

// Response: { "success": true, "paymentIntent": { "id": "pi_xxx", "client_secret": "xxx" } }
// Save the payment intent ID as PI_ID
// client_secret is needed for frontend payment confirmation


// Retrieve a Payment Intent
curl -X GET http://localhost:3000/api/payments/intent/pi_xxx


// List all Payment Intents
curl -X GET "http://localhost:3000/api/payments/list?limit=10&status=succeeded"


// Confirm a Payment Intent (requires payment method)
curl -X POST http://localhost:3000/api/payments/intent/pi_xxx/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "pm_xxx"
  }'


// ============================================
// 4. SUBSCRIPTIONS
// ============================================

// Create a subscription
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "cus_xxx",
    "price": "price_xxx",
    "trial_period_days": 14
  }'

// Response: { "success": true, "subscription": { "id": "sub_xxx", ... } }
// Save the subscription ID as SUB_ID


// List all subscriptions for a customer
curl -X GET "http://localhost:3000/api/subscriptions?customer=cus_xxx&limit=10"


// Get a specific subscription
curl -X GET http://localhost:3000/api/subscriptions/sub_xxx


// Update a subscription
curl -X POST http://localhost:3000/api/subscriptions/sub_xxx \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "order_id": "12345"
    }
  }'


// Cancel a subscription (immediately)
curl -X DELETE http://localhost:3000/api/subscriptions/sub_xxx


// Cancel a subscription at period end
curl -X DELETE "http://localhost:3000/api/subscriptions/sub_xxx?cancel_at_period_end=true"


// Resume a canceled subscription
curl -X POST http://localhost:3000/api/subscriptions/sub_xxx/resume \
  -H "Content-Type: application/json" \
  -d '{}'


// ============================================
// 5. INVOICES
// ============================================

// Create an invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "cus_xxx",
    "description": "Invoice for services rendered"
  }'

// Response: { "success": true, "invoice": { "id": "in_xxx", ... } }
// Save the invoice ID as INV_ID


// List invoices for a customer
curl -X GET "http://localhost:3000/api/invoices?customer=cus_xxx&limit=10"


// Get a specific invoice
curl -X GET http://localhost:3000/api/invoices/in_xxx


// Add line items to an invoice (draft only)
curl -X POST http://localhost:3000/api/invoices/in_xxx/line-items \
  -H "Content-Type: application/json" \
  -d '{
    "price": "price_xxx",
    "quantity": 1
  }'

// OR add a custom line item:
// -d '{
//   "amount": 5000,
//   "description": "Service fee",
//   "quantity": 1
// }'


// Finalize an invoice
curl -X POST http://localhost:3000/api/invoices/in_xxx/finalize \
  -H "Content-Type: application/json" \
  -d '{}'


// Send an invoice to the customer
curl -X POST http://localhost:3000/api/invoices/in_xxx/send \
  -H "Content-Type: application/json" \
  -d '{}'


// Pay an invoice
curl -X POST http://localhost:3000/api/invoices/in_xxx/pay \
  -H "Content-Type: application/json" \
  -d '{}'


// Void an invoice
curl -X POST http://localhost:3000/api/invoices/in_xxx/void \
  -H "Content-Type: application/json" \
  -d '{}'


// ============================================
// 6. CHECKOUT
// ============================================

// Create a Checkout session
curl -X POST http://localhost:3000/api/checkout/session \
  -H "Content-Type: application/json" \
  -d '{
    "line_items": [
      {
        "price": "price_xxx",
        "quantity": 1
      }
    ],
    "customer": "cus_xxx",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel",
    "mode": "subscription"
  }'

// Response: { "success": true, "session": { "id": "cs_xxx", "url": "https://checkout.stripe.com/..." } }
// Open the URL in a browser to complete checkout


// Quick checkout (simpler)
curl -X POST http://localhost:3000/api/checkout/quick-session \
  -H "Content-Type: application/json" \
  -d '{
    "price_id": "price_xxx",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel"
  }'


// Retrieve a Checkout session
curl -X GET http://localhost:3000/api/checkout/session/cs_xxx


// Get line items from a session
curl -X GET http://localhost:3000/api/checkout/session/cs_xxx/line-items


// ============================================
// TEST WORKFLOW
// ============================================

/**
 * Complete flow to test the API:
 * 
 * 1. Create a Customer
 * 2. Create a Product
 * 3. Create a Price for the Product
 * 4. Create a Payment Intent (one-time) OR Checkout Session
 * 5. OR Create a Subscription
 * 
 * For testing without a real payment method:
 * - Use Stripe test mode (not live keys)
 * - Use test card: 4242 4242 4242 4242
 * - Any future expiry date
 * - Any 3-digit CVC
 */
