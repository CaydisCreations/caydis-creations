const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function reorderDarkBagImages2() {
  try {
    const productId = 'prod_SmePkdpV8FocKE'; // Handbag - Multicolor (Dark Bag) - second product
    
    // New image order - making a modeled image first
    const newImageOrder = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6121.jpeg'
    ];

    console.log('🔄 Reordering images for Handbag - Multicolor (Dark Bag) - Second Product...\n');

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

reorderDarkBagImages2(); 