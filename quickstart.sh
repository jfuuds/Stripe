#!/bin/bash

# Stripe Demo Quick Start Script
# This script sets up your Stripe demo in 3 steps

set -e

echo "🚀 Stripe Demo - Quick Start Setup"
echo "=================================="
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Step 2: Setup environment
echo "🔑 Step 2: Setting up environment..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file from template"
  echo "   ⚠️  IMPORTANT: Edit .env and add your Stripe API keys!"
  echo ""
  echo "   Get your keys from: https://dashboard.stripe.com/apikeys"
  echo ""
else
  echo "✅ .env file already exists"
  echo ""
fi

# Step 3: Show next steps
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Stripe API keys"
echo "   nano .env  (or open in your editor)"
echo ""
echo "2. Start the server:"
echo "   npm run dev"
echo ""
echo "3. Test the API:"
echo "   curl http://localhost:3000/health"
echo ""
echo "📚 For more info, read:"
echo "   - GETTING_STARTED.md  (Step-by-step guide)"
echo "   - README.md           (Full documentation)"
echo "   - TESTING.md          (API examples)"
echo ""
echo "💡 Tip: Use 'node helpers.js setup' to create test data"
echo ""
