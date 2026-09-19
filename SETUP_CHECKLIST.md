# Stripe Demo - Setup Checklist

Complete these steps to get your Stripe demo running:

## ✅ Prerequisites
- [ ] Node.js installed (v14+) - [Download](https://nodejs.org/)
- [ ] npm or yarn installed (comes with Node.js)
- [ ] Stripe account created - [Sign up](https://stripe.com)

## ✅ Step 1: Get Stripe API Keys (5 minutes)

- [ ] Go to [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Click **Developers** → **API keys**
- [ ] Make sure you're in **Test Mode** (look for toggle)
- [ ] Copy your **Secret Key** (starts with `sk_test_`)
- [ ] Copy your **Publishable Key** (starts with `pk_test_`)
- [ ] Keep these keys safe - never share or commit them

## ✅ Step 2: Install Dependencies (2 minutes)

```bash
cd "Stripe Demo"
npm install
```

Expected output: Shows packages being installed (express, stripe, etc.)

- [ ] All packages installed successfully
- [ ] No errors in terminal

## ✅ Step 3: Configure Environment (1 minute)

```bash
cp .env.example .env
```

Then edit `.env` file and replace with your actual keys:

```
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
PORT=3000
NODE_ENV=development
```

- [ ] `.env` file created
- [ ] Secret key added to `.env`
- [ ] Publishable key added to `.env`
- [ ] Port set (default 3000)

⚠️ **Important**: Never commit `.env` to Git (it's in `.gitignore`)

## ✅ Step 4: Start the Server (1 minute)

```bash
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:3000
Stripe API Key configured: ✓
```

- [ ] Server started successfully
- [ ] Stripe API Key shows as configured ✓
- [ ] No errors in output

## ✅ Step 5: Test the API (2 minutes)

Open a **new terminal** and test:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"OK","message":"Stripe Demo API is running"}
```

- [ ] Health check returned OK

## ✅ Step 6: Create Test Data (Optional)

```bash
node helpers.js setup
```

Expected output: Shows created customer, product, price, and payment intent IDs

- [ ] Test data created successfully
- [ ] Copy the IDs for testing

## ✅ Step 7: Test API Endpoints (Optional)

Try creating a customer:

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

Expected response:
```json
{"success":true,"customer":{"id":"cus_xxx",...}}
```

- [ ] Customer created successfully
- [ ] Response includes customer ID

## ✅ Additional Setup (Optional)

### Setup Git Repository
```bash
git init
git add .
git commit -m "Initial Stripe demo setup"
```

- [ ] Git repository initialized
- [ ] Files committed (without `.env`)

### Install Postman (for easier testing)
- [ ] Download [Postman](https://www.postman.com/downloads/)
- [ ] Import API endpoints for testing

### Setup VS Code Extensions (optional)
- [ ] REST Client extension (for .http file requests)
- [ ] Thunder Client (built-in REST testing)

## ✅ Documentation Review

- [ ] Read **GETTING_STARTED.md** for detailed setup
- [ ] Review **README.md** for all available endpoints
- [ ] Check **TESTING.md** for 50+ example API calls
- [ ] Study **ARCHITECTURE.md** for system design

## ✅ Troubleshooting

If something doesn't work:

- [ ] Check error messages in terminal
- [ ] Verify API keys in `.env` are correct
- [ ] Make sure `.env` file exists
- [ ] Try restarting the server
- [ ] Check Stripe status: https://status.stripe.com
- [ ] Review GETTING_STARTED.md troubleshooting section

## ✅ Common Issues & Fixes

### "Cannot find module 'stripe'"
```bash
npm install
npm run dev
```

### "STRIPE_SECRET_KEY is undefined"
- Verify `.env` file exists
- Check API key is not empty
- Restart server

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
```

### "Invalid API Key"
- Double-check key in Stripe dashboard
- Make sure it starts with `sk_test_`
- No extra spaces around the key

## ✅ Next Steps After Setup

1. **Learn the API**
   - Read all endpoints in README.md
   - Try examples from TESTING.md

2. **Build Something**
   - Create a React frontend
   - Add webhook handling
   - Integrate a database

3. **Test Edge Cases**
   - Use test cards from TESTING.md
   - Try different payment scenarios
   - Test error handling

4. **Deploy (Optional)**
   - Use Heroku, Vercel, AWS, etc.
   - Update URLs to production domains
   - Use production API keys (when ready)

## ✅ Quick Command Reference

```bash
# Start server (development)
npm run dev

# Start server (production)
npm start

# Setup demo data
node helpers.js setup

# List all resources
node helpers.js list

# Clean up test data
node helpers.js cleanup --force

# Quick setup
./quickstart.sh
```

## ✅ Final Verification

Run this complete check:

```bash
# 1. Server running?
curl http://localhost:3000/health

# 2. Create customer?
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'

# 3. List products?
curl http://localhost:3000/api/products

# 4. All working?
echo "✅ Setup Complete!"
```

## 📊 Setup Checklist Summary

- **Time to Complete**: ~10 minutes
- **Difficulty Level**: Easy (follow checklist)
- **Prerequisites**: 3 (Node.js, npm, Stripe account)
- **Files Created**: 14
- **API Endpoints**: 30+

---

## 🎉 You're Ready!

Once you check all boxes above:

✅ Server is running  
✅ API keys configured  
✅ Health check passes  
✅ Can create objects  

**You're ready to build with Stripe!**

Start with the example API calls in **TESTING.md**

Questions? Read **GETTING_STARTED.md**

Need details? Check **README.md**

Happy building! 🚀
