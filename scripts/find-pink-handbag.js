const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function findPinkHandbag() {
  try {
    console.log('🔍 Finding Pink Handbag product ID...\n');

    // Get all products
    const products = await stripe.products.list({ limit: 100 });
    
    // Find Pink Handbag products
    const pinkHandbags = products.data.filter(p => p.name === 'Pink Handbag');
    
    console.log('📋 Pink Handbag Product(s) Found:\n');
    
    if (pinkHandbags.length > 0) {
      pinkHandbags.forEach((product, index) => {
        console.log(`${index + 1}. Product ID: ${product.id}`);
        console.log(`   Name: ${product.name}`);
        console.log(`   Description: ${product.description}`);
        console.log(`   Price: $${(product.default_price?.unit_amount || 0) / 100}`);
        console.log(`   Active: ${product.active}`);
        console.log(`   Created: ${new Date(product.created * 1000).toLocaleDateString()}`);
        console.log('');
      });
    } else {
      console.log('❌ No Pink Handbag products found');
    }

    console.log(`📊 Total products in Stripe: ${products.data.length}`);
    console.log(`📊 Pink Handbag products found: ${pinkHandbags.length}`);

  } catch (error) {
    console.error('❌ Error fetching product:', error.message);
  }
}

findPinkHandbag();
