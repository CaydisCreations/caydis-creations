const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function deactivateBeanieProducts() {
  try {
    // Product IDs to deactivate
    const productIds = [
      'prod_ScqwIdWsr9r38o', // Beanie - Blue with Strands of White
      'prod_Scqv5tStfYgkm6', // Beanie - Multi-color (Blue, White, Green, Beige)
      'prod_ScqvXyB1qrD45G'  // Beanie - Multi-color (Pink, Orange, Yellow, Blue)
    ];

    console.log('🗑️ Deactivating beanie products...\n');

    for (const productId of productIds) {
      try {
        // Get product details first
        const product = await stripe.products.retrieve(productId);
        console.log(`📦 Product: ${product.name} (${productId})`);
        
        // Deactivate the product
        await stripe.products.update(productId, { active: false });
        console.log(`✅ Successfully deactivated: ${product.name}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Error processing ${productId}:`, error.message);
      }
    }

    console.log('✅ Beanie product deactivation completed!');
    
    // Show remaining active products
    console.log('\n📋 Remaining active products:');
    const remainingProducts = await stripe.products.list({ limit: 100, active: true });
    remainingProducts.data.forEach(product => {
      console.log(`  - ${product.name} (${product.id})`);
    });

  } catch (error) {
    console.error('❌ Error deactivating beanie products:', error);
  }
}

deactivateBeanieProducts(); 