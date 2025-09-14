require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateScrunchiePrices() {
  try {
    console.log('🔍 Finding all scrunchie products...');
    
    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      expand: ['data.default_price']
    });

    console.log(`📦 Found ${products.data.length} total products`);

    // Filter for scrunchie products
    const scrunchieProducts = products.data.filter(product => 
      product.name.toLowerCase().includes('scrunchie') ||
      product.description?.toLowerCase().includes('scrunchie')
    );

    console.log(`🎀 Found ${scrunchieProducts.length} scrunchie products:`);
    scrunchieProducts.forEach(product => {
      console.log(`  - ${product.name} (ID: ${product.id})`);
    });

    if (scrunchieProducts.length === 0) {
      console.log('❌ No scrunchie products found!');
      return;
    }

    console.log('\n💰 Updating prices to $20.00...');

    for (const product of scrunchieProducts) {
      try {
        console.log(`\n🔄 Updating ${product.name}...`);
        
        // Get current price info
        const currentPrice = product.default_price;
        if (currentPrice) {
          console.log(`  Current price: $${(currentPrice.unit_amount / 100).toFixed(2)}`);
        }

        // Create new price of $20.00
        const newPrice = await stripe.prices.create({
          unit_amount: 2000, // $20.00 in cents
          currency: 'usd',
          product: product.id,
        });

        console.log(`  ✅ Created new price: $${(newPrice.unit_amount / 100).toFixed(2)} (ID: ${newPrice.id})`);

        // Update product to use new price
        await stripe.products.update(product.id, {
          default_price: newPrice.id,
        });

        console.log(`  ✅ Updated ${product.name} to use new price`);

        // Archive old price if it exists
        if (currentPrice && currentPrice.id !== newPrice.id) {
          await stripe.prices.update(currentPrice.id, {
            active: false,
          });
          console.log(`  ✅ Archived old price (ID: ${currentPrice.id})`);
        }

      } catch (error) {
        console.error(`  ❌ Error updating ${product.name}:`, error.message);
      }
    }

    console.log('\n🎉 All scrunchie prices updated to $20.00!');
    console.log('\n📋 Summary:');
    scrunchieProducts.forEach(product => {
      console.log(`  - ${product.name}: $20.00`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the update
updateScrunchiePrices();
