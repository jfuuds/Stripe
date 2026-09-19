# Stripe Demo - Architecture & Workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT APPLICATION                      │
│                   (Browser / Postman / API)                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP Requests / REST API
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    EXPRESS.JS SERVER                        │
│              (server.js - Port 3000)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              MIDDLEWARE STACK                          │ │
│  │  ✓ CORS      ✓ Body Parser    ✓ Error Handler         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              ROUTE HANDLERS                            │ │
│  │  /api/payments      → payments.js                      │ │
│  │  /api/customers     → customers.js                     │ │
│  │  /api/products      → products.js                      │ │
│  │  /api/subscriptions → subscriptions.js                 │ │
│  │  /api/invoices      → invoices.js                      │ │
│  │  /api/checkout      → checkout.js                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           STRIPE CLIENT LIBRARY                        │ │
│  │         (utils/stripe.js - SDK)                        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │
                  HTTPS / API Calls
                             │
┌────────────────────────────▼────────────────────────────────┐
│              STRIPE API                                      │
│         (api.stripe.com)                                     │
│                                                              │
│  - Payment Processing    - Subscriptions                     │
│  - Customer Data         - Invoicing                         │
│  - Products & Prices     - Checkout                          │
└────────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

### Example: Create a Payment Intent

```
Client                  Server              Stripe API
  │                       │                    │
  ├─ POST /payments/intent│                    │
  │  { amount: 50 }       │                    │
  │─────────────────────→ │                    │
  │                       │                    │
  │                       ├─ Create PaymentIntent
  │                       ├─────────────────→ │
  │                       │                    │
  │                       │ ← PaymentIntent   │
  │                       │   { id, status } │
  │                       │                    │
  │ ← { success: true,   │                    │
  │    paymentIntent }   │                    │
  │ ←────────────────────│                    │
  │                       │                    │
```

### Example: Create a Subscription

```
Client              Server          Stripe API
  │                   │                │
  ├─ Create          │                │
  │  Customer        │                │
  ├────────────────→ ├──────────────→ │
  │                   │ ← cus_xxx     │
  │ ← cus_xxx        │                │
  │ ←────────────────│                │
  │                   │                │
  ├─ Create          │                │
  │  Product         │                │
  ├────────────────→ ├──────────────→ │
  │                   │ ← prod_xxx    │
  │ ← prod_xxx       │                │
  │ ←────────────────│                │
  │                   │                │
  ├─ Create Price    │                │
  ├────────────────→ ├──────────────→ │
  │                   │ ← price_xxx   │
  │ ← price_xxx      │                │
  │ ←────────────────│                │
  │                   │                │
  ├─ Create Sub      │                │
  │  { customer,      │                │
  │    price }       │                │
  ├────────────────→ ├──────────────→ │
  │                   │ ← sub_xxx     │
  │ ← sub_xxx        │                │
  │ ←────────────────│                │
  │                   │                │
```

## File Structure & Responsibilities

```
server.js
    ├─ Initialize Express app
    ├─ Load middleware (CORS, body-parser)
    ├─ Import and mount route handlers
    ├─ Define error handler
    └─ Start HTTP server

routes/
    ├─ payments.js
    │   ├─ Create Payment Intents
    │   ├─ Confirm payments
    │   ├─ Create charges (legacy)
    │   └─ List payment intents
    │
    ├─ customers.js
    │   ├─ CRUD operations for customers
    │   ├─ Attach payment methods
    │   └─ List payment methods
    │
    ├─ products.js
    │   ├─ Manage products
    │   ├─ Create and list prices
    │   └─ Update product details
    │
    ├─ subscriptions.js
    │   ├─ Create subscriptions
    │   ├─ Update subscription items
    │   ├─ Cancel & resume subscriptions
    │   └─ List subscriptions
    │
    ├─ invoices.js
    │   ├─ Create invoices
    │   ├─ Add line items
    │   ├─ Finalize & send
    │   ├─ Pay & void invoices
    │   └─ List invoices
    │
    └─ checkout.js
        ├─ Create Checkout sessions
        ├─ Retrieve sessions
        ├─ List session line items
        └─ Quick checkout helper

utils/
    └─ stripe.js
        ├─ Initialize Stripe SDK
        ├─ Define error handler
        └─ Export for route use

helpers.js
    ├─ setupDemoData()
    ├─ listAllResources()
    └─ cleanupTestData()
```

## Data Flow: Complete Payment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CREATE CUSTOMER                                          │
│    POST /api/customers                                      │
│    { email, name, description }                            │
│    ↓                                                        │
│    Response: { customer: { id: "cus_...", ... } }          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CREATE PRODUCT & PRICE                                   │
│    POST /api/products                                       │
│    { name, type, description }                             │
│    ↓                                                        │
│    POST /api/products/:id/prices                           │
│    { amount, currency, recurring? }                        │
│    ↓                                                        │
│    Response: { price: { id: "price_...", ... } }           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CREATE PAYMENT / SUBSCRIPTION                            │
│                                                              │
│    Option A: ONE-TIME PAYMENT                               │
│    POST /api/payments/intent                               │
│    { amount, currency, customer_id }                       │
│                                                              │
│    Option B: SUBSCRIPTION                                   │
│    POST /api/subscriptions                                 │
│    { customer, price }                                      │
│                                                              │
│    Option C: CHECKOUT SESSION                               │
│    POST /api/checkout/session                              │
│    { line_items, customer, success_url, cancel_url }       │
│    ↓                                                        │
│    Response: { paymentIntent / subscription / session }     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CONFIRMATION & STATUS TRACKING                           │
│    GET /api/payments/intent/:id                            │
│    GET /api/subscriptions/:id                              │
│    GET /api/checkout/session/:id                           │
│    ↓                                                        │
│    Check status: succeeded, requires_action, etc.           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. MANAGE & TRACK (Optional)                                │
│    POST /api/invoices                                      │
│    POST /api/subscriptions/:id                             │
│    GET /api/invoices/:id                                   │
│    ↓                                                        │
│    Create invoices, update subscriptions, track payments    │
└─────────────────────────────────────────────────────────────┘
```

## API Response Pattern

All endpoints follow this response structure:

### Success Response
```json
{
  "success": true,
  "customer": { /* Stripe object */ },
  "paymentIntent": { /* Stripe object */ },
  "subscription": { /* Stripe object */ }
  // etc.
}
```

### Error Response
```json
{
  "error": "Description of what went wrong",
  "type": "StripeInvalidRequestError"
}
```

## Environment Configuration

```
.env
├── STRIPE_SECRET_KEY        # Required: Your Stripe secret key
├── STRIPE_PUBLISHABLE_KEY   # Optional: For frontend integration
├── PORT                      # Optional: Server port (default 3000)
└── NODE_ENV                  # Optional: development/production
```

## Dependency Graph

```
express
    ├─ Handles HTTP routing & middleware
    └─ Used in: server.js, all routes

stripe
    ├─ Official Stripe SDK
    └─ Used in: all route handlers

dotenv
    ├─ Loads environment variables
    └─ Used in: server.js, utils/stripe.js

cors
    ├─ Enables cross-origin requests
    └─ Used in: server.js

body-parser
    ├─ Parses JSON requests
    └─ Used in: server.js

nodemon (dev only)
    ├─ Auto-restarts on file changes
    └─ Used in: npm run dev
```

## Error Handling Flow

```
Route Handler
    ↓
Try-Catch Block
    ├─ Success → Return 200 + data
    └─ Error:
        ├─ Stripe Error
        │   ├─ StripeInvalidRequestError → 400
        │   ├─ StripeAuthenticationError → 401
        │   └─ Other → 500
        └─ Return error response with details
```

---

This architecture provides a clean, scalable foundation for integrating Stripe into your application!
