require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function addParcelDimensionsToScrunchies() {
  try {
    console.log('🔍 Finding all scrunchie products...');
    
    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

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

    console.log('\n📦 Adding parcel dimensions to scrunchie products...');

    for (const product of scrunchieProducts) {
      try {
        console.log(`\n🔄 Updating ${product.name}...`);
        
        // Add default parcel dimensions for scrunchies
        const updatedMetadata = {
          ...product.metadata,
          parcel_length: '8',      // 8 inches
          parcel_width: '6',       // 6 inches  
          parcel_height: '2',      // 2 inches
          parcel_weight_oz: '4'    // 4 ounces
        };

        await stripe.products.update(product.id, {
          metadata: updatedMetadata
        });

        console.log(`  ✅ Added parcel dimensions: 8" x 6" x 2", 4 oz`);

      } catch (error) {
        console.error(`  ❌ Error updating ${product.name}:`, error.message);
      }
    }

    console.log('\n🎉 All scrunchie products updated with parcel dimensions!');
    console.log('\n📋 Summary:');
    scrunchieProducts.forEach(product => {
      console.log(`  - ${product.name}: 8" x 6" x 2", 4 oz`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the update
addParcelDimensionsToScrunchies();
