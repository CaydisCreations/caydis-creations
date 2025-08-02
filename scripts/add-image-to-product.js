const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function addImageToProduct() {
  try {
    console.log('🖼️ Adding image to Handbag - Multicolor (Dark Bag) product...');

    // Find the first Handbag - Multicolor (Dark Bag) product
    const products = await stripe.products.list({ limit: 100, active: true });
    const targetProduct = products.data.find(p => p.name === 'Handbag - Multicolor (Dark Bag)' && p.id === 'prod_SmePkdpV8FocKE');
    
    if (!targetProduct) {
      console.error('❌ Handbag - Multicolor (Dark Bag) product not found');
      return;
    }

    console.log(`📦 Found product: ${targetProduct.name} (${targetProduct.id})`);
    console.log(`📸 Current images: ${targetProduct.images ? targetProduct.images.length : 0}`);

    // The image to add
    const newImageUrl = 'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6121.jpeg';
    
    // Add the new image to the existing images array
    const updatedImages = [...(targetProduct.images || []), newImageUrl];
    
    // Update the product with the new image
    const updatedProduct = await stripe.products.update(targetProduct.id, {
      images: updatedImages
    });

    console.log('✅ Image added successfully!');
    console.log(`📸 Updated images: ${updatedProduct.images.length}`);
    console.log('📋 New image list:');
    updatedProduct.images.forEach((img, index) => {
      console.log(`   ${index + 1}. ${img}`);
    });

  } catch (error) {
    console.error('❌ Error adding image to product:', error);
  }
}

addImageToProduct(); 