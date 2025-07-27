require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function checkScrunchieDetails() {
  console.log('=== Checking Scrunchie Product Details ===\n');
  
  try {
    const products = await stripe.products.list({ active: true, limit: 100 });
    const scrunchies = products.data.filter(p => p.name.toLowerCase().includes('scrunchie'));
    
    console.log(`Found ${scrunchies.length} scrunchie products:\n`);
    
    for (const product of scrunchies) {
      console.log(`📦 ${product.name} (${product.id})`);
      console.log(`   Description: ${product.description || 'No description'}`);
      console.log(`   Images: ${product.images?.length || 0} images`);
      console.log(`   Active: ${product.active ? '✅' : '❌'}`);
      
      // Get price information
      const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
      if (prices.data.length > 0) {
        const price = prices.data[0];
        console.log(`   Price: $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()}`);
        console.log(`   Price ID: ${price.id}`);
      } else {
        console.log(`   ❌ No active price found`);
      }
      
      // Show metadata
      console.log(`   Metadata:`);
      console.log(`     Stock: ${product.metadata?.stock || 'Not set'}`);
      console.log(`     Total Sold: ${product.metadata?.total_sold || '0'}`);
      console.log(`     Category: ${product.metadata?.category || 'Not set'}`);
      console.log(`     Tags: ${product.metadata?.tags || 'Not set'}`);
      console.log(`     Parcel: ${product.metadata?.parcel_length || '-'} x ${product.metadata?.parcel_width || '-'} x ${product.metadata?.parcel_height || '-'} in, ${product.metadata?.parcel_weight_oz || '-'} oz`);
      console.log('');
    }
    
  } catch (error) {
    console.error('Error checking scrunchie details:', error.message);
  }
}

checkScrunchieDetails(); 