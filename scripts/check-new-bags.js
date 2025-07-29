require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function checkNewBags() {
  try {
    console.log('🔍 Checking new bag products...\n');

    // Check the three bag products
    const bagIds = [
      'prod_ScqwTo3jjqx8Kc', // Updated pink bag with solid pink lining
      'prod_SlvCyL1ArUUcAa', // New pink bag with flowers lining
      'prod_SlvC49ifPVmHzA'  // New dark bag
    ];

    for (const productId of bagIds) {
      try {
        const product = await stripe.products.retrieve(productId);
        console.log(`📦 ${product.name}:`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Active: ${product.active}`);
        console.log(`   Description: ${product.description}`);
        console.log(`   Metadata:`, product.metadata);
        
        // Get price details
        const prices = await stripe.prices.list({
          product: productId,
          active: true
        });
        
        if (prices.data.length > 0) {
          const price = prices.data[0];
          console.log(`   Price: $${(price.unit_amount / 100).toFixed(2)}`);
        }
        
        console.log('');
      } catch (error) {
        console.log(`❌ Error retrieving product ${productId}:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkNewBags(); 