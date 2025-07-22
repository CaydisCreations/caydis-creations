require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function cleanupTestProduct(productId) {
  console.log('🧹 Cleaning up test product...\n');

  if (!productId) {
    console.log('❌ Please provide a product ID to clean up');
    console.log('Usage: node scripts/cleanup-test-product.js <product_id>');
    return;
  }

  try {
    // Get the product to find its prices
    const product = await stripe.products.retrieve(productId);
    console.log('📦 Found product:', product.name);

    // Get all prices for this product
    const prices = await stripe.prices.list({ product: productId });
    console.log(`💰 Found ${prices.data.length} prices to delete`);

    // Delete all prices
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
      console.log('✅ Deactivated price:', price.id);
    }

    // Delete the product
    await stripe.products.del(productId);
    console.log('✅ Deleted product:', productId);

    console.log('\n🎉 Cleanup complete!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

const productId = process.argv[2];
cleanupTestProduct(productId); 