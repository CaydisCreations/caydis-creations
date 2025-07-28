require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function checkHandbagDetails() {
  try {
    console.log('🔍 Checking Handbag - Multi-color (Pink, Purple, Red, Orange) details...\n');

    const productId = 'prod_ScqwTo3jjqx8Kc';
    
    // Get product details
    const product = await stripe.products.retrieve(productId);
    console.log('📦 Product Details:');
    console.log(`   Name: ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Active: ${product.active}`);
    console.log(`   Description: ${product.description || 'No description'}`);
    console.log(`   Metadata:`, product.metadata);

    // Get price details
    const prices = await stripe.prices.list({
      product: productId,
      active: true
    });

    if (prices.data.length > 0) {
      const price = prices.data[0];
      console.log('\n💰 Price Details:');
      console.log(`   Price ID: ${price.id}`);
      console.log(`   Amount: $${(price.unit_amount / 100).toFixed(2)}`);
      console.log(`   Currency: ${price.currency}`);
      console.log(`   Active: ${price.active}`);
    } else {
      console.log('\n❌ No active prices found');
    }

    // Get inventory details
    console.log('\n📊 Inventory Details:');
    console.log(`   Stock: ${product.metadata?.stock || 'Not set'}`);
    console.log(`   Total Sold: ${product.metadata?.total_sold || 'Not set'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkHandbagDetails(); 