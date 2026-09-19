# 🏌️ Jim's Golf Shop - Frontend Setup

Your professional Jim's Golf Shop storefront is ready! This is a complete ecommerce demo with Stripe payment integration.

## ✨ Features

- **Professional Design** - Clean, modern, and fun golf-themed interface
- **Product Catalog** - 10 golf products with categories and filtering
- **Shopping Cart** - Full cart functionality with real-time updates
- **Checkout** - Secure Stripe payment processing
- **Responsive** - Works on desktop, tablet, and mobile
- **Product Modals** - Beautiful product detail views
- **Order Confirmation** - Success screen with order ID

## 🚀 Quick Start (1 minute)

### Step 1: Dependencies are already installed!
```bash
cd "Stripe Demo"
# npm install (already done)
```

### Step 2: Make sure your `.env` file has your Stripe keys
Check that your `.env` contains:
```
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### Step 3: Start the server
```bash
npm run dev
```

You'll see:
```
🚀 Server running on http://localhost:3000
Stripe API Key configured: ✓
```

### Step 4: Open in browser
Open your browser and go to: **http://localhost:3000**

## 🏌️ Jim's Golf Shop Features

### Product Catalog
- **Clubs**: Professional drivers, putters, iron sets
- **Balls**: Premium and standard golf balls
- **Bags**: Stand bags and cart bags
- **Apparel**: Golf shoes and gloves
- **Accessories**: Tees and more

### Shopping Experience
1. **Browse Products** - Filter by category or special badges
2. **View Details** - Click any product for full details
3. **Add to Cart** - Choose quantity and add
4. **Review Cart** - See all items with prices
5. **Checkout** - Enter billing info and pay with card
6. **Order Confirmation** - Get your order ID

## 💳 Test Payments

Use Stripe's test cards to test the checkout:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25` (any future date)
- CVC: `123` (any 3 digits)

**3D Secure Required:**
- Card: `4000 0025 0000 3155`

**Payment Fails:**
- Card: `5555 5555 5555 4444`

## 📁 Frontend Structure

```
public/
├── index.html          # Main storefront (with modals)
├── css/
│   └── style.css       # All styling (golf theme colors)
└── js/
    └── app.js          # Frontend logic (cart, checkout, Stripe)
```

## 🎨 Design Features

- **Colors**: Golf green (#1a5f3f), gold accents (#f59e0b)
- **Fonts**: Poppins (headings), Inter (body)
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions and interactions
- **Icons**: Golf emoji (⛳) and Unicode symbols

## 🔄 How It Works

```
User Interface (HTML)
        ↓
Shopping Cart (JavaScript)
        ↓
Stripe.js (Frontend)
        ↓
Payment Intent API
        ↓
Express Backend
        ↓
Stripe API
        ↓
Success/Error
```

## 📦 Included Products

1. **Pro Driver 460cc** - $199.99 (Popular)
2. **Elite Putter** - $89.99
3. **Iron Set** - $449.99 (Best Value)
4. **Premium Golf Balls** - $39.99
5. **Standard Golf Balls** - $24.99
6. **Stand Golf Bag** - $129.99
7. **Cart Golf Bag** - $149.99 (New)
8. **Pro Golf Shoes** - $119.99
9. **Golf Glove Set** - $44.99
10. **Bamboo Tees** - $14.99

## 🎯 API Endpoints Used

- `GET /api/config` - Get Stripe publishable key
- `GET /api/shop/products` - Get all golf products
- `POST /api/payments/intent` - Create payment intent
- `POST /api/checkout/session` - Alternative checkout

## 🛠️ Customization

### Change Product Images
Edit `server.js` routes and change the Unsplash URLs in the products array.

### Add More Products
Add new products to the `app.get('/api/shop/products')` endpoint in `server.js`.

### Change Colors
Edit CSS variables in `public/css/style.css`:
```css
--primary: #1a5f3f;           /* Golf green */
--secondary: #f59e0b;         /* Gold */
```

### Update Business Name
Replace "Jim's Golf Shop" throughout the HTML and CSS files.

## 📱 Mobile Responsive

- Navbar adapts for mobile (menu hidden)
- Products grid adjusts to screen size
- Modals are touch-friendly
- All fonts scale appropriately

## 🔒 Security Features

✅ Secure payment processing with Stripe  
✅ PCI-compliant (no card data stored)  
✅ Environment variables for secrets  
✅ Input validation  
✅ Error handling  

## 💡 Tips

- Products use placeholder images from Unsplash
- Tax is calculated at 10%
- Cart persists during session
- Real Stripe API integration
- Test mode enabled (won't charge real cards)

## 🆘 Troubleshooting

**"Cannot find module"?**
- Run: `npm install`

**Stripe key not working?**
- Check `.env` has `STRIPE_PUBLISHABLE_KEY`
- Restart the server

**Images not loading?**
- Check internet connection (uses Unsplash URLs)
- Test card will load placeholder images

**Cart not updating?**
- Refresh the page
- Check browser console for errors

**Checkout failing?**
- Use test card: `4242 4242 4242 4242`
- Check .env has `STRIPE_SECRET_KEY`

## 📖 Additional Resources

- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [Testing Guide](https://stripe.com/docs/testing)

## 🎉 You're All Set!

Open `http://localhost:3000` in your browser and start shopping at Jim's Golf Shop!

Enjoy the professional, fun golf shop experience! ⛳🚀

---

**Questions?** Check the main README.md for full API documentation.
