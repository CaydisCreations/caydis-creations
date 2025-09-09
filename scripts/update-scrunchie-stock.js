require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateScrunchieStock() {
  try {
    console.log('🎀 Updating scrunchie stock to 1...\n');

    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    console.log(`📦 Found ${products.data.length} total products`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each scrunchie product
    for (const product of products.data) {
      // Check if it's a scrunchie (by name, category, or tags)
      const isScrunchie = 
        product.name.toLowerCase().includes('scrunchie') ||
        product.metadata?.category === 'Accessories' ||
        (product.metadata?.tags && product.metadata.tags.toLowerCase().includes('scrunchies'));

      if (isScrunchie) {
        console.log(`\n🎀 Updating scrunchie: ${product.name}`);
        console.log(`   Current stock: ${product.metadata?.stock || 'not set'}`);
        
        // Update the product with stock = 1
        await stripe.products.update(product.id, {
          metadata: {
            ...product.metadata,
            stock: '1'
          }
        });

        console.log(`✅ Updated ${product.name} - stock set to 1`);
        updatedCount++;
      } else {
        console.log(`⏭️ Skipping: ${product.name} (not a scrunchie)`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Scrunchie stock update completed!');
    console.log(`✅ Updated: ${updatedCount} scrunchies`);
    console.log(`⏭️ Skipped: ${skippedCount} other products`);

  } catch (error) {
    console.error('❌ Error updating scrunchie stock:', error);
  }
}

updateScrunchieStock();
