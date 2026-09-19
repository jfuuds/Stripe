# Stripe Demo API

A comprehensive Node.js/Express API demo showcasing Stripe's payment processing capabilities. This demo includes endpoints for handling payments, customers, products, subscriptions, invoices, and checkout sessions.

## Features

✅ **Payment Processing**
- Create and manage Payment Intents
- Direct charge capability
- Payment method handling

✅ **Customer Management**
- Create and manage customer records
- Attach payment methods to customers
- List and retrieve payment methods

✅ **Products & Pricing**
- Create and manage products
- Create flexible pricing (one-time or recurring)
- List prices for products

✅ **Subscriptions**
- Create recurring subscriptions
- Update and cancel subscriptions
- Resume canceled subscriptions
- Trial period support

✅ **Invoicing**
- Create and manage invoices
- Finalize and send invoices
- Add line items to invoices
- Pay and void invoices

✅ **Checkout**
- Create hosted Checkout sessions
- Support for payment, setup, and subscription modes
- Quick checkout helper endpoint

## Prerequisites

- Node.js 14+ and npm/yarn
- A Stripe account (free at https://stripe.com)
- Stripe API keys from https://dashboard.stripe.com/apikeys

## Installation

1. **Clone/Extract the repository:**
```bash
cd "Stripe Demo"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env
```

4. **Edit `.env` and add your Stripe credentials:**
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
PORT=3000
```

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```

### Payments
```
POST   /api/payments/intent              # Create a Payment Intent
GET    /api/payments/intent/:id          # Retrieve a Payment Intent
POST   /api/payments/intent/:id/confirm  # Confirm a Payment Intent
POST   /api/payments/charge              # Create a direct charge
GET    /api/payments/list                # List Payment Intents
```

### Customers
```
POST   /api/customers                       # Create a customer
GET    /api/customers                       # List customers
GET    /api/customers/:id                   # Retrieve a customer
POST   /api/customers/:id                   # Update a customer
DELETE /api/customers/:id                   # Delete a customer
POST   /api/customers/:id/payment-method    # Add payment method
GET    /api/customers/:id/payment-methods   # List payment methods
```

### Products & Prices
```
POST   /api/products                     # Create a product
GET    /api/products                     # List products
GET    /api/products/:id                 # Retrieve a product
POST   /api/products/:id                 # Update a product
POST   /api/products/:id/prices          # Create a price
GET    /api/products/:id/prices          # List prices for product
GET    /api/products/prices/:price_id    # Retrieve a specific price
```

### Subscriptions
```
POST   /api/subscriptions                # Create a subscription
GET    /api/subscriptions                # List subscriptions
GET    /api/subscriptions/:id            # Retrieve a subscription
POST   /api/subscriptions/:id            # Update a subscription
DELETE /api/subscriptions/:id            # Cancel a subscription
POST   /api/subscriptions/:id/resume     # Resume a subscription
```

### Invoices
```
POST   /api/invoices                     # Create an invoice
GET    /api/invoices                     # List invoices
GET    /api/invoices/:id                 # Retrieve an invoice
POST   /api/invoices/:id                 # Update an invoice
POST   /api/invoices/:id/finalize        # Finalize an invoice
POST   /api/invoices/:id/send            # Send an invoice
POST   /api/invoices/:id/pay             # Pay an invoice
POST   /api/invoices/:id/void            # Void an invoice
POST   /api/invoices/:id/line-items      # Add line items
```

### Checkout
```
POST   /api/checkout/session             # Create a Checkout session
GET    /api/checkout/session/:id         # Retrieve a session
GET    /api/checkout/session/:id/line-items  # Get session line items
POST   /api/checkout/quick-session       # Quick checkout helper
```

## Usage Examples

### Create a Customer

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "name": "John Doe",
    "description": "Demo customer"
  }'
```

### Create a Payment Intent

```bash
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "currency": "usd",
    "description": "Demo payment"
  }'
```

### Create a Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Plan",
    "description": "Monthly subscription plan",
    "type": "service"
  }'
```

### Create a Subscription

```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "cus_xxx",
    "price": "price_xxx",
    "trial_period_days": 14
  }'
```

## Testing with Stripe Test Cards

Use these test card numbers in test mode:

| Card Number | CVC | Date | Result |
|---|---|---|---|
| 4242 4242 4242 4242 | Any | Any future date | Success |
| 4000 0025 0000 3155 | Any | Any future date | 3D Secure |
| 5555 5555 5555 4444 | Any | Any future date | Visa (fails) |
| 378282246310005 | Any | Any future date | Amex |

**Test Customer Details:**
- Email: any email
- Name: any name
- Address: any valid address

## Project Structure

```
├── server.js              # Main Express server
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore
├── README.md
├── utils/
│   └── stripe.js          # Stripe client initialization
└── routes/
    ├── payments.js        # Payment endpoints
    ├── customers.js       # Customer endpoints
    ├── products.js        # Products & Prices endpoints
    ├── subscriptions.js   # Subscription endpoints
    ├── invoices.js        # Invoice endpoints
    └── checkout.js        # Checkout endpoints
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `STRIPE_SECRET_KEY` | Your Stripe secret API key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | Optional |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Optional |

## Next Steps

1. **Add Authentication**: Implement JWT or session-based auth
2. **Add Webhooks**: Handle Stripe events (payment.success, invoice.paid, etc.)
3. **Add Database**: Store customers and transactions in a database
4. **Add Frontend**: Create a React/Vue frontend for the API
5. **Add Tests**: Write unit and integration tests
6. **Error Handling**: Enhance error messages and logging

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Node.js Library](https://github.com/stripe/stripe-node)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)

## License

MIT

## Support

For issues with the Stripe API, visit [Stripe Support](https://support.stripe.com).
For issues with this demo, check the code comments and API documentation.
