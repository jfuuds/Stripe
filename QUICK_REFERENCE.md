# Stripe Demo - Quick Reference

Copy-paste these commands to get running in minutes!

## 🚀 FASTEST SETUP (Copy & Paste These Commands)

### Step 1: Install & Setup (2 minutes)
```bash
cd "Stripe Demo"
npm install
cp .env.example .env
```

### Step 2: Add Your API Keys
```bash
# Edit .env file with your editor
# Replace THESE LINES:
# STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
# STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
# 
# Get keys from: https://dashboard.stripe.com/apikeys
```

### Step 3: Start Server
```bash
npm run dev
```

### Step 4: Test in Another Terminal
```bash
curl http://localhost:3000/health
```

---

## 📚 QUICK API EXAMPLES

### Create a Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

### Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Plan",
    "type": "service"
  }'
```

### Create Payment Intent ($29.99)
```bash
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.99,
    "currency": "usd",
    "description": "Test payment"
  }'
```

### List All Customers
```bash
curl http://localhost:3000/api/customers
```

### List All Products
```bash
curl http://localhost:3000/api/products
```

### List All Payment Intents
```bash
curl http://localhost:3000/api/payments/list
```

---

## 🎯 COMMON WORKFLOWS

### One-Time Payment Flow
```bash
# 1. Create customer
CUST_ID=$(curl -s -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# 2. Create payment intent
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d "{\"amount\":49.99,\"currency\":\"usd\",\"customer_id\":\"$CUST_ID\"}"
```

### Subscription Flow
```bash
# 1. Create product
PROD_ID=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Monthly Plan"}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# 2. Create price ($19.99/month)
PRICE_ID=$(curl -s -X POST http://localhost:3000/api/products/$PROD_ID/prices \
  -H "Content-Type: application/json" \
  -d '{"amount":19.99,"currency":"usd","recurring":{"interval":"month"}}' | \
  grep -o '"id":"[^"]*' | cut -d'"' -f4)

# 3. Create customer
CUST_ID=$(curl -s -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"email":"subscriber@test.com"}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# 4. Create subscription
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d "{\"customer\":\"$CUST_ID\",\"price\":\"$PRICE_ID\"}"
```

---

## 🧪 TEST PAYMENT METHODS

**Card Numbers (Stripe Test Mode Only):**
- `4242 4242 4242 4242` → Succeeds ✅
- `4000 0025 0000 3155` → 3D Secure ✓
- `5555 5555 5555 4444` → Declines ✗

**Other Test Cards:**
- Amex: `378282246310005` (4 digit CVC)
- Discover: `6011 1111 1111 1117`

**Any Expiry:** Any future date (e.g., `12/25`)  
**Any CVC:** Any 3 digits (e.g., `123`)

---

## 📋 ALL ENDPOINTS (Quick Reference)

### PAYMENTS
- `POST /api/payments/intent` - Create payment intent
- `GET /api/payments/intent/:id` - Get payment intent
- `POST /api/payments/charge` - Create charge
- `GET /api/payments/list` - List intents

### CUSTOMERS
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer
- `POST /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### PRODUCTS & PRICES
- `POST /api/products` - Create product
- `GET /api/products` - List products
- `POST /api/products/:id/prices` - Create price
- `GET /api/products/:id/prices` - List prices

### SUBSCRIPTIONS
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions` - List subscriptions
- `GET /api/subscriptions/:id` - Get subscription
- `POST /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription

### INVOICES
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - List invoices
- `POST /api/invoices/:id/finalize` - Finalize invoice
- `POST /api/invoices/:id/send` - Send invoice
- `POST /api/invoices/:id/pay` - Pay invoice

### CHECKOUT
- `POST /api/checkout/session` - Create checkout
- `GET /api/checkout/session/:id` - Get checkout session
- `POST /api/checkout/quick-session` - Quick checkout

---

## 🛠️ UTILITY COMMANDS

```bash
# Create sample data
node helpers.js setup

# List all resources
node helpers.js list

# Clean up (DANGEROUS!)
node helpers.js cleanup --force

# Start development server
npm run dev

# Start production server
npm start

# Run quick setup script
./quickstart.sh
```

---

## 📂 IMPORTANT FILES

| File | Purpose |
|---|---|
| `.env` | Your API keys (CREATE THIS) |
| `server.js` | Main app entry point |
| `routes/*` | API endpoint handlers |
| `utils/stripe.js` | Stripe configuration |
| `helpers.js` | CLI utilities |

---

## ⚠️ IMPORTANT NOTES

✅ **DO:**
- Use test keys (contain "test")
- Keep `.env` secret
- Validate all inputs
- Handle errors gracefully

❌ **DON'T:**
- Share your secret key
- Commit `.env` to git
- Use live keys in development
- Store card data yourself

---

## 🆘 QUICK TROUBLESHOOTING

**Server won't start?**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Try different port
PORT=3001 npm run dev
```

**API key error?**
```bash
# Verify .env exists
cat .env

# Check it has keys
grep STRIPE .env

# Restart server
npm run dev
```

**Dependencies missing?**
```bash
# Reinstall all packages
rm -rf node_modules
npm install
```

---

## 📖 READ THESE FILES NEXT

1. **GETTING_STARTED.md** - Complete setup guide
2. **README.md** - Full API documentation
3. **TESTING.md** - 50+ example calls
4. **ARCHITECTURE.md** - How it all works

---

## ✅ VERIFICATION CHECKLIST

```bash
# 1. Server running?
curl http://localhost:3000/health

# 2. Can create customer?
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# 3. Can create payment?
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{"amount":50,"currency":"usd"}'

# 4. All working?
echo "🎉 You're ready!"
```

---

## 🎓 Learn More

- Stripe Docs: https://stripe.com/docs/api
- Node SDK: https://github.com/stripe/stripe-node
- API Keys: https://dashboard.stripe.com/apikeys
- Test Data: https://stripe.com/docs/testing

---

**Ready to build?** Start with these 3 commands:

```bash
cd "Stripe Demo"
npm install
npm run dev
```

Then open GETTING_STARTED.md in your editor! 🚀
