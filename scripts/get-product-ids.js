const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product names to find (in the order they appear in the image)
const productNames = [
  'Dark Rainbow Handbag',
  'Brown Shoulder Bag', 
  'Dark Rainbow Handbag'
];

async function getProductIds() {
  try {
    console.log('🔍 Finding product IDs for the three products...\n');

    // Get all products
    const products = await stripe.products.list({ limit: 100 });
    
    console.log('📋 Product IDs in order:\n');
    
    for (let i = 0; i < productNames.length; i++) {
      const productName = productNames[i];
      const matchingProducts = products.data.filter(p => p.name === productName);
      
      console.log(`${i + 1}. ${productName}:`);
      
      if (matchingProducts.length > 0) {
        matchingProducts.forEach((product, index) => {
          console.log(`   Product ID: ${product.id}`);
          console.log(`   Description: ${product.description}`);
          console.log(`   Price: $${(product.default_price?.unit_amount || 0) / 100}`);
          console.log(`   Active: ${product.active}`);
          if (matchingProducts.length > 1) {
            console.log(`   (Instance ${index + 1})`);
          }
          console.log('');
        });
      } else {
        console.log(`   ❌ No product found with name "${productName}"`);
        console.log('');
      }
    }

    console.log('📊 Summary:');
    console.log(`Total products in Stripe: ${products.data.length}`);
    console.log(`Products found: ${productNames.map(name => 
      products.data.filter(p => p.name === name).length
    ).reduce((a, b) => a + b, 0)}`);

  } catch (error) {
    console.error('❌ Error fetching product IDs:', error.message);
  }
}

getProductIds();
