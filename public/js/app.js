// ==================== */
// STRIPE SETUP
// ==================== */

let stripe;
let elements;
let cardElement;

function addApiActivity({ method, path, status, duration, direction = 'round trip', detail }) {
  const activityLog = document.getElementById('apiActivityLog');
  if (!activityLog) return;

  const emptyState = activityLog.querySelector('.api-empty');
  if (emptyState) emptyState.remove();

  const item = document.createElement('article');
  item.className = `api-activity-item ${status >= 400 ? 'is-error' : ''}`;
  item.innerHTML = `
    <div class="api-activity-topline">
      <span class="api-method">${method}</span>
      <code>${path}</code>
      <span class="api-status">${status >= 400 ? 'Error' : 'Success'} ${status || ''}</span>
    </div>
    <div class="api-activity-meta">
      <span>${direction}</span>
      <span>${duration ? `${duration} ms` : 'Stripe.js'}</span>
    </div>
    ${detail ? `<code class="api-detail">${detail}</code>` : ''}
  `;
  activityLog.prepend(item);
}

async function apiFetch(path, options = {}) {
  const startedAt = performance.now();
  try {
    const response = await fetch(path, options);
    addApiActivity({
      method: options.method || 'GET',
      path,
      status: response.status,
      duration: Math.round(performance.now() - startedAt),
    });
    return response;
  } catch (error) {
    addApiActivity({
      method: options.method || 'GET',
      path,
      status: 0,
      duration: Math.round(performance.now() - startedAt),
      detail: error.message,
    });
    throw error;
  }
}

function mountCardElement() {
  const cardContainer = document.getElementById('cardElement');
  if (!cardContainer) {
    return;
  }

  if (cardContainer.dataset.stripeMounted === 'true') {
    return;
  }

  if (!cardElement || typeof cardElement.mount !== 'function') {
    cardContainer.innerHTML = '<p class="card-errors">Secure checkout is unavailable right now. Please refresh and try again.</p>';
    return;
  }

  try {
    cardElement.mount(cardContainer);
    cardContainer.dataset.stripeMounted = 'true';
  } catch (error) {
    console.error('Stripe card mount failed:', error);
    cardContainer.innerHTML = '<p class="card-errors">Secure checkout could not be initialized. Please refresh and try again.</p>';
  }
}

// Initialize Stripe
async function initStripe() {
  const response = await apiFetch('/api/config');
  const config = await response.json();
  stripe = Stripe(config.publishableKey);
  elements = stripe.elements();
  cardElement = elements.create('card');

  mountCardElement();
}

// ==================== */
// STATE MANAGEMENT
// ==================== */

let cart = [];
let allProducts = [];
let currentFilter = 'all';

const fallbackProductImages = {
  'golf-driver-pro': 'https://loremflickr.com/400/400/golf,driver?lock=1',
  'golf-putter-elite': 'https://loremflickr.com/400/400/golf,putter?lock=2',
  'golf-irons-set': 'https://loremflickr.com/400/400/golf,iron?lock=3',
  'golf-balls-premium': 'https://loremflickr.com/400/400/golf,ball?lock=4',
  'golf-balls-standard': 'https://loremflickr.com/400/400/golf,ball?lock=5',
  'golf-bag-stand': 'https://loremflickr.com/400/400/golf,bag?lock=6',
  'golf-bag-cart': 'https://loremflickr.com/400/400/golf,bag?lock=7',
  'golf-shoes-pro': 'https://loremflickr.com/400/400/golf,shoes?lock=8',
  'golf-glove-set': 'https://loremflickr.com/400/400/golf,glove?lock=9',
  'golf-tees-pack': 'https://loremflickr.com/400/400/golf,tees?lock=10',
};

function getProductImage(product) {
  return fallbackProductImages[product.id] || product.image;
}

// ==================== */
// DOM ELEMENTS
// ==================== */

const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const productModal = document.getElementById('productModal');
const checkoutModal = document.getElementById('checkoutModal');
const successModal = document.getElementById('successModal');

// ==================== */
// LOAD PRODUCTS
// ==================== */

async function loadProducts() {
  try {
    const response = await apiFetch('/api/shop/products');
    const data = await response.json();
    allProducts = data.products;
    renderProducts('all');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function renderProducts(filter = 'all') {
  let filteredProducts = allProducts;

  if (filter !== 'all') {
    filteredProducts = allProducts.filter((p) => {
      if (filter === 'Popular' || filter === 'New' || filter === 'Best Value') {
        return p.badge === filter;
      }
      return p.category === filter;
    });
  }

  productsGrid.innerHTML = filteredProducts
    .map((product) => {
      return `
        <div class="product-card" onclick="openProductModal('${product.id}')">
          <div class="product-image-wrapper">
            <img src="${getProductImage(product)}" alt="${product.name}" class="product-image" onerror="this.src='${getProductImage(product)}'">
            ${
              product.badge
                ? `<div class="product-badge-container"><span class="product-badge">${product.badge}</span></div>`
                : ''
            }
          </div>
          <div class="product-body">
            <p class="product-category">${product.category}</p>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <button class="product-add-btn" onclick="quickAddToCart(event, '${product.id}')">Add</button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

// ==================== */
// PRODUCT MODAL
// ==================== */

let selectedProductId = null;

function openProductModal(productId) {
  selectedProductId = productId;
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return;

  document.getElementById('productImage').src = getProductImage(product);
  document.getElementById('productImage').onerror = function () {
    this.src = getProductImage(product);
  };
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productCategory').textContent = product.category;
  document.getElementById('productDescription').textContent = product.description;
  document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;

  const badge = document.getElementById('productBadge');
  if (product.badge) {
    badge.textContent = product.badge;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }

  document.getElementById('productQty').value = 1;

  productModal.classList.add('active');
}

document.getElementById('closeProductBtn').addEventListener('click', () => {
  productModal.classList.remove('active');
});

document.getElementById('increaseQty').addEventListener('click', () => {
  const input = document.getElementById('productQty');
  input.value = Math.min(parseInt(input.value) + 1, 10);
});

document.getElementById('decreaseQty').addEventListener('click', () => {
  const input = document.getElementById('productQty');
  input.value = Math.max(parseInt(input.value) - 1, 1);
});

document.getElementById('addToCartBtn').addEventListener('click', () => {
  const qty = parseInt(document.getElementById('productQty').value);
  addToCart(selectedProductId, qty);
  productModal.classList.remove('active');
});

// ==================== */
// CART MANAGEMENT
// ==================== */

function addToCart(productId, quantity = 1) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: getProductImage(product),
      quantity: quantity,
    });
  }

  updateCartUI();
  showNotification(`${product.name} added to cart!`);
}

function quickAddToCart(event, productId) {
  event.stopPropagation();
  addToCart(productId, 1);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCartItems() {
  const cartItems = document.getElementById('cartItems');

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div class="cart-empty"><p>Your cart is empty</p><p>Start shopping to add items!</p></div>';
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80?text=${encodeURIComponent(item.name)}'">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-qty">Qty: ${item.quantity}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
        </div>
      `;
    })
    .join('');
}

function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

  return { subtotal, tax, total };
}

function updateCheckoutSummary() {
  const summary = document.getElementById('checkoutSummary');
  summary.innerHTML = cart
    .map((item) => {
      return `
        <div class="checkout-summary-item">
          <span>${item.name} × ${item.quantity}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `;
    })
    .join('');
}

// ==================== */
// CART MODAL
// ==================== */

cartBtn.addEventListener('click', () => {
  if (cart.length === 0 && cartModal.classList.contains('active')) {
    cartModal.classList.remove('active');
    return;
  }
  renderCartItems();
  calculateTotal();
  cartModal.classList.add('active');
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
  cartModal.classList.remove('active');
});

document.getElementById('continueShopping').addEventListener('click', () => {
  cartModal.classList.remove('active');
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  cartModal.classList.remove('active');
  openCheckoutModal();
});

// ==================== */
// CHECKOUT MODAL
// ==================== */

async function openCheckoutModal() {
  updateCheckoutSummary();
  calculateTotal();
  mountCardElement();
  checkoutModal.classList.add('active');
}

document.getElementById('closeCheckoutBtn').addEventListener('click', () => {
  checkoutModal.classList.remove('active');
});

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('submitPayment');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.innerHTML = '<span class="loading"></span> Processing...';

  try {
    const { total } = calculateTotal();

    // Create payment intent
    const intentResponse = await apiFetch('/api/payments/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        currency: 'usd',
        description: `Jim's Golf Shop order - ${cart.length} items`,
      }),
    });

    const intentData = await intentResponse.json();
    if (!intentData.success) throw new Error(intentData.error);

    const paymentIntent = intentData.paymentIntent;

    // Confirm payment with Stripe
    const { paymentIntent: confirmedPayment, error } = await stripe.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
            email: document.getElementById('email').value,
            address: {
              line1: document.getElementById('address').value,
              city: document.getElementById('city').value,
              state: document.getElementById('state').value,
              postal_code: document.getElementById('zip').value,
            },
          },
        },
      }
    );

    addApiActivity({
      method: 'POST',
      path: 'Stripe.js confirmCardPayment',
      status: error ? 402 : 200,
      direction: 'browser ↔ Stripe',
      detail: error ? error.message : `PaymentIntent ${confirmedPayment.status}`,
    });

    if (error) {
      document.getElementById('cardErrors').textContent = error.message;
      throw error;
    }

    if (confirmedPayment.status === 'succeeded') {
      // Success!
      checkoutModal.classList.remove('active');
      cart = [];
      updateCartUI();
      showSuccessModal(confirmedPayment.id);
    }
  } catch (error) {
    console.error('Payment error:', error);
    document.getElementById('cardErrors').textContent =
      error.message || 'Payment failed. Please try again.';
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// ==================== */
// SUCCESS MODAL
// ==================== */

function showSuccessModal(paymentId) {
  document.getElementById('successMessage').textContent =
    'Thank you for your purchase! Your order has been confirmed.';
  document.getElementById('orderId').textContent = `Order ID: ${paymentId}`;
  successModal.classList.add('active');
}

// ==================== */
// NOTIFICATIONS
// ==================== */

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    z-index: 999;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==================== */
// FILTER & NAVIGATION
// ==================== */

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = e.target.dataset.filter;

    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    e.target.classList.add('active');

    renderProducts(filter);
    currentFilter = filter;
  });
});

document.querySelectorAll('.tag').forEach((tag) => {
  tag.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = e.target.dataset.filter;

    document.querySelectorAll('.tag').forEach((t) => t.classList.remove('active'));
    e.target.classList.add('active');

    renderProducts(filter);
    currentFilter = filter;
  });
});

// ==================== */
// CLOSE MODALS ON OUTSIDE CLICK
// ==================== */

[cartModal, productModal, checkoutModal, successModal].forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

// ==================== */
// INITIALIZATION
// ==================== */

document.addEventListener('DOMContentLoaded', async () => {
  await initStripe();
  await loadProducts();
  updateCartUI();
});

document.getElementById('clearApiActivity').addEventListener('click', () => {
  document.getElementById('apiActivityLog').innerHTML =
    '<div class="api-empty">Waiting for an API call...</div>';
});

// Add some CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
