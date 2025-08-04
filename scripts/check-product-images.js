const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkProductImages() {
  try {
    console.log('🔍 Checking product images...\n');

    // Get all active products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    console.log(`📦 Found ${products.data.length} active products\n`);

    // Check first few products
    for (let i = 0; i < Math.min(5, products.data.length); i++) {
      const product = products.data[i];
      console.log(`\n📦 Product: ${product.name}`);
      console.log(`🆔 ID: ${product.id}`);
      console.log(`📝 Description: ${product.description}`);
      
      if (product.images && product.images.length > 0) {
        console.log(`🖼️ Images (${product.images.length}):`);
        product.images.forEach((image, index) => {
          console.log(`   ${index + 1}. ${image}`);
        });
      } else {
        console.log('❌ No images found');
      }
      
      if (product.metadata) {
        console.log(`🏷️ Material: ${product.metadata.material || 'Not set'}`);
        console.log(`📏 Size: ${product.metadata.size || 'Not set'}`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking products:', error);
  }
}

checkProductImages(); 