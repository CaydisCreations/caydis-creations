const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkProductOrder() {
  try {
    console.log('🔍 Checking Pink Handbag product order in the list...\n');

    // Get all products
    const products = await stripe.products.list({ limit: 100 });
    
    const pinkHandbagIds = ['prod_SlvCyL1ArUUcAa', 'prod_ScqwTo3jjqx8Kc'];
    
    console.log('📋 Product positions in the list:\n');
    
    pinkHandbagIds.forEach((productId, index) => {
      const position = products.data.findIndex(p => p.id === productId);
      const product = products.data[position];
      
      console.log(`${index + 1}. Product ID: ${productId}`);
      console.log(`   Position in list: ${position + 1} of ${products.data.length}`);
      console.log(`   Distance from end: ${products.data.length - position} positions`);
      console.log(`   Name: ${product?.name || 'Not found'}`);
      console.log(`   Created: ${product ? new Date(product.created * 1000).toLocaleDateString() : 'N/A'}`);
      console.log('');
    });

    // Find which one is closer to the end
    const positions = pinkHandbagIds.map(id => products.data.findIndex(p => p.id === id));
    const distancesFromEnd = positions.map(pos => products.data.length - pos);
    
    const closerToEndIndex = distancesFromEnd.indexOf(Math.min(...distancesFromEnd));
    const closerToEndId = pinkHandbagIds[closerToEndIndex];
    
    console.log('🎯 Result:');
    console.log(`The Pink Handbag product closer to the end of the list is:`);
    console.log(`Product ID: ${closerToEndId}`);
    console.log(`Position: ${positions[closerToEndIndex] + 1} of ${products.data.length}`);
    console.log(`Distance from end: ${distancesFromEnd[closerToEndIndex]} positions`);

  } catch (error) {
    console.error('❌ Error checking product order:', error.message);
  }
}

checkProductOrder();
