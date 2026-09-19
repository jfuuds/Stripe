// Utility functions for common Stripe tasks

const { stripe } = require('./utils/stripe');

/**
 * Create a complete demo setup
 * Useful for testing and initialization
 */
async function setupDemoData() {
  try {
    console.log('Creating demo data...\n');

    // 1. Create a customer
    console.log('1️⃣ Creating customer...');
    const customer = await stripe.customers.create({
      email: 'demo@example.com',
      name: 'Demo User',
      description: 'Stripe Demo Test Customer',
    });
    console.log(`✅ Customer created: ${customer.id}\n`);

    // 2. Create a product
    console.log('2️⃣ Creating product...');
    const product = await stripe.products.create({
      name: 'Starter Plan',
      description: 'Monthly subscription starter plan',
      type: 'service',
    });
    console.log(`✅ Product created: ${product.id}\n`);

    // 3. Create a price
    console.log('3️⃣ Creating price...');
    const price = await stripe.prices.create({
      product: product.id,
      amount: 2999, // $29.99
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
    });
    console.log(`✅ Price created: ${price.id}\n`);

    // 4. Create a payment intent
    console.log('4️⃣ Creating payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 4999, // $49.99
      currency: 'usd',
      customer: customer.id,
      description: 'Demo payment intent',
    });
    console.log(`✅ Payment Intent created: ${paymentIntent.id}\n`);

    // Summary
    console.log('📊 Demo Data Created Successfully!\n');
    console.log('Summary:');
    console.log(`- Customer ID: ${customer.id}`);
    console.log(`- Product ID: ${product.id}`);
    console.log(`- Price ID: ${price.id}`);
    console.log(`- Payment Intent ID: ${paymentIntent.id}`);
    console.log(`\nUse these IDs in your API calls for testing.\n`);

    return {
      customer: customer.id,
      product: product.id,
      price: price.id,
      paymentIntent: paymentIntent.id,
    };
  } catch (error) {
    console.error('❌ Error creating demo data:', error.message);
    throw error;
  }
}

/**
 * List all resources
 */
async function listAllResources() {
  try {
    console.log('📋 Stripe Resources Summary\n');

    // Customers
    const customers = await stripe.customers.list({ limit: 5 });
    console.log(`Customers (showing ${customers.data.length}):`);
    customers.data.forEach((c) => {
      console.log(`  - ${c.id}: ${c.email}`);
    });
    console.log();

    // Products
    const products = await stripe.products.list({ limit: 5, active: true });
    console.log(`Products (showing ${products.data.length}):`);
    products.data.forEach((p) => {
      console.log(`  - ${p.id}: ${p.name}`);
    });
    console.log();

    // Prices
    const prices = await stripe.prices.list({ limit: 5 });
    console.log(`Prices (showing ${prices.data.length}):`);
    prices.data.forEach((p) => {
      console.log(
        `  - ${p.id}: $${(p.unit_amount / 100).toFixed(2)} ${p.currency}`
      );
    });
    console.log();

    // Payment Intents
    const intents = await stripe.paymentIntents.list({ limit: 5 });
    console.log(`Payment Intents (showing ${intents.data.length}):`);
    intents.data.forEach((pi) => {
      console.log(`  - ${pi.id}: $${(pi.amount / 100).toFixed(2)} (${pi.status})`);
    });
    console.log();
  } catch (error) {
    console.error('❌ Error listing resources:', error.message);
  }
}

/**
 * Clean up test data (use with caution!)
 */
async function cleanupTestData() {
  try {
    console.log('🗑️  Cleaning up test data...\n');

    const limit = 10;

    // Delete customers
    const customers = await stripe.customers.list({ limit });
    console.log(`Deleting ${customers.data.length} customers...`);
    for (const customer of customers.data) {
      await stripe.customers.del(customer.id);
      console.log(`  ✓ Deleted: ${customer.id}`);
    }

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

// Export for use in other files or CLI
module.exports = {
  setupDemoData,
  listAllResources,
  cleanupTestData,
};

// If run directly as a script
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'setup') {
    setupDemoData()
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  } else if (command === 'list') {
    listAllResources()
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  } else if (command === 'cleanup') {
    if (process.argv[3] === '--force') {
      cleanupTestData()
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    } else {
      console.log('⚠️  Cleanup requires --force flag');
      console.log('Usage: node helpers.js cleanup --force');
    }
  } else {
    console.log('Stripe Demo Helper CLI\n');
    console.log('Usage:');
    console.log('  node helpers.js setup              - Create demo data');
    console.log('  node helpers.js list               - List all resources');
    console.log(
      '  node helpers.js cleanup --force   - Delete test data (CAREFUL!)'
    );
  }
}
