const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function reorderLightBagImages() {
  try {
    const productId = 'prod_ScqwhWrHtkiqzn'; // Handbag - Multicolor (Light Bag)
    
    // New image order - making a modeled image first
    const newImageOrder = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6151.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6124.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6125.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6152.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6156.jpeg'
    ];

    console.log('🔄 Reordering images for Handbag - Multicolor (Light Bag)...\n');

    // Get current product
    const product = await stripe.products.retrieve(productId);
    console.log(`📦 Product: ${product.name}`);
    console.log(`📸 Current images: ${product.images.length}`);
    console.log('');

    // Update product with new image order
    await stripe.products.update(productId, {
      images: newImageOrder
    });

    console.log('✅ Successfully reordered images!');
    console.log('');
    console.log('📋 New image order:');
    newImageOrder.forEach((image, index) => {
      const fileName = image.split('/').pop();
      console.log(`  ${index + 1}. ${fileName}`);
    });

    // Verify the update
    const updatedProduct = await stripe.products.retrieve(productId);
    console.log(`\n📊 Verification: Product now has ${updatedProduct.images.length} images`);

  } catch (error) {
    console.error('❌ Error reordering images:', error);
  }
}

reorderLightBagImages(); 