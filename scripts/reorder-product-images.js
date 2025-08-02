const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function reorderProductImages() {
  try {
    const productId = 'prod_SlvCyL1ArUUcAa'; // Handbag - Multicolor (Pink Bag - Flowers Lining)
    
    // New image order as requested
    const newImageOrder = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6117.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg'
    ];

    console.log('🔄 Reordering images for Handbag - Multicolor (Pink Bag - Flowers Lining)...\n');

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

reorderProductImages(); 