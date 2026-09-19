# Getting Started with Stripe Demo

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - comes with Node.js
- A **Stripe Account** (free) - [Sign up here](https://stripe.com)
- **Stripe API Keys** - from your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in to your account
3. Navigate to **Developers** → **API keys**
4. You'll see two keys:
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)

⚠️ **Important**: Always use **test keys** during development (they contain `test`).

## Step 2: Setup Your Project

### 1. Navigate to your project folder:
```bash
cd "Stripe Demo"
```

### 2. Install dependencies:
```bash
npm install
```

This installs:
- `express` - Web framework
- `stripe` - Stripe SDK
- `dotenv` - Environment variable management
- `cors` - Cross-origin resource sharing
- `body-parser` - JSON request parsing
- `nodemon` - Auto-reload during development

### 3. Create your `.env` file:

**Option A**: Copy the example file:
```bash
cp .env.example .env
```

**Option B**: Create manually:
```bash
cat > .env << EOF
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
PORT=3000
NODE_ENV=development
EOF
```

### 4. Edit `.env` with your actual keys:
Open `.env` in your editor and replace the placeholder keys with your real Stripe API keys:

```
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnop
STRIPE_PUBLISHABLE_KEY=pk_test_qrstuvwxyz0123456789abcd
PORT=3000
NODE_ENV=development
```

## Step 3: Start the Server

### Development (with auto-reload):
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
Stripe API Key configured: ✓
```

### Production:
```bash
npm start
```

## Step 4: Test the API

In a new terminal window, test the health check:

```bash
curl http://localhost:3000/health
```

You should get:
```json
{"status": "OK", "message": "Stripe Demo API is running"}
```

## Step 5: Create Test Data

Use the helper script to quickly set up test data:

```bash
node helpers.js setup
```

This will create and display:
- A test customer
- A test product
- A test price
- A test payment intent

## Common API Calls

### Create a Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Product",
    "type": "service"
  }'
```

### Create a Payment Intent
```bash
curl -X POST http://localhost:3000/api/payments/intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.99,
    "currency": "usd",
    "description": "Test payment"
  }'
```

## Stripe Test Cards

Use these card numbers to test payments (Stripe test mode only):

| Card Number | Exp Date | CVC | Result |
|---|---|---|---|
| 4242 4242 4242 4242 | Any future | Any 3 digits | Succeeds |
| 4000 0025 0000 3155 | Any future | Any 3 digits | Requires 3D Secure |
| 5555 5555 5555 4444 | Any future | Any 3 digits | Fails (Visa) |
| 378282246310005 | Any future | Any 4 digits | Amex |
| 6011 1111 1111 1117 | Any future | Any 3 digits | Discover |

Example: `4242 4242 4242 4242` | `12/25` | `123`

## File Structure

```
Stripe Demo/
├── server.js              # Main application
├── package.json           # Dependencies
├── .env                   # Your API keys (keep secret!)
├── .env.example           # Template
├── .gitignore            # Git ignore file
├── README.md             # Full documentation
├── TESTING.md            # More detailed test examples
├── GETTING_STARTED.md    # This file
├── helpers.js            # CLI helper scripts
│
├── utils/
│   └── stripe.js         # Stripe configuration
│
└── routes/
    ├── payments.js       # Payment endpoints
    ├── customers.js      # Customer endpoints
    ├── products.js       # Product endpoints
    ├── subscriptions.js  # Subscription endpoints
    ├── invoices.js       # Invoice endpoints
    └── checkout.js       # Checkout endpoints
```

## Troubleshooting

### "Cannot find module 'stripe'"
**Solution**: Run `npm install` in the project folder

### "STRIPE_SECRET_KEY is undefined"
**Solution**: 
1. Check that `.env` file exists
2. Verify you added your API key
3. Restart the server (`npm run dev`)

### "Invalid API Key"
**Solution**:
1. Double-check your secret key starts with `sk_test_`
2. Copy directly from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Make sure there are no extra spaces

### "Port 3000 is already in use"
**Solution**:
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the existing process
lsof -i :3000
kill -9 <PID>
```

### Requests hang or timeout
**Solution**:
1. Check internet connection (Stripe API requires network access)
2. Verify Stripe status: https://status.stripe.com
3. Try using a different API key

## Next Steps

1. **Read the full README.md** for all endpoints
2. **Review TESTING.md** for detailed examples
3. **Explore the route files** to understand the code
4. **Build a frontend** using Stripe.js to accept payments
5. **Add webhook handling** to track Stripe events
6. **Integrate a database** to store transactions

## Tips & Best Practices

✅ **DO:**
- Use test keys during development
- Keep your `.env` file secret (in `.gitignore`)
- Validate input on both client and server
- Handle Stripe errors gracefully
- Log important events for debugging

❌ **DON'T:**
- Share your secret API key
- Commit `.env` to git
- Use live keys in development
- Store card data yourself (let Stripe handle it)
- Forget to handle payment failures

## Resources

- 📖 [Stripe API Documentation](https://stripe.com/docs/api)
- 📚 [Node.js Library Guide](https://github.com/stripe/stripe-node)
- 🧪 [Stripe Testing Guide](https://stripe.com/docs/testing)
- 💬 [Stripe Support](https://support.stripe.com)
- 🎓 [Stripe Learning Center](https://stripe.com/learn)

## Need Help?

1. Check the error message carefully
2. Look at the server logs
3. Review the relevant route file
4. Check [Stripe documentation](https://stripe.com/docs/api)
5. Visit [Stripe Support](https://support.stripe.com)

---

Happy building! 🚀
