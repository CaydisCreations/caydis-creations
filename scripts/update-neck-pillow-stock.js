const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateNeckPillowStock() {
  try {
    console.log('🛏️ Updating Packable Travel Neck Pillow stock to 1...\n');

    // Find the neck pillow product
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const neckPillowProduct = products.data.find(product => 
      product.name === "Packable Travel Neck Pillow"
    );

    if (!neckPillowProduct) {
      console.error('❌ Packable Travel Neck Pillow product not found!');
      return;
    }

    console.log(`📦 Found product: ${neckPillowProduct.name}`);
    console.log(`   Current stock: ${neckPillowProduct.metadata?.stock || 'not set'}`);
    console.log(`   Product ID: ${neckPillowProduct.id}\n`);

    // Update the stock to 1
    await stripe.products.update(neckPillowProduct.id, {
      metadata: {
        ...neckPillowProduct.metadata,
        stock: '1'
      }
    });

    console.log('✅ Stock updated successfully!');
    console.log('   New stock: 1');
    console.log('\n🎉 Packable Travel Neck Pillow stock updated to 1!');

  } catch (error) {
    console.error('❌ Error updating neck pillow stock:', error.message);
  }
}

// Run the script
updateNeckPillowStock().catch(console.error);
