const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// All images from the red_pink_orange_purple folder and modeled subfolder
const redPinkOrangePurpleImages = [
  // Images from the main red_pink_orange_purple folder
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
  
  // Images from the modeled/ subfolder
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
];

// The specific product ID that needs updating
const productIdToUpdate = 'prod_SlvCyL1ArUUcAa';

async function updatePinkBagImages() {
  try {
    console.log('🔄 Updating "Handbag - Multicolor (Pink Bag - Flowers Lining)" product...\n');
    console.log(`📸 Using ${redPinkOrangePurpleImages.length} red/pink/orange/purple images:`);
    redPinkOrangePurpleImages.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    console.log('');

    // Get the specific product
    const product = await stripe.products.retrieve(productIdToUpdate);
    
    console.log(`📝 Updating product: ${product.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Current images: ${product.images?.length || 0} images`);
    console.log(`   New images: ${redPinkOrangePurpleImages.length} images`);

    // Update the product with new images
    const updatedProduct = await stripe.products.update(productIdToUpdate, {
      images: redPinkOrangePurpleImages
    });

    console.log(`✅ Successfully updated ${product.name}`);
    console.log(`   New images: ${updatedProduct.images.length} images`);
    console.log(`   First image: ${updatedProduct.images[0]}\n`);

    console.log('🎉 "Handbag - Multicolor (Pink Bag - Flowers Lining)" updated with red/pink/orange/purple images!');
    console.log('\n📋 Summary:');
    console.log(`   - Updated product ID: ${productIdToUpdate}`);
    console.log(`   - Used ${redPinkOrangePurpleImages.length} red/pink/orange/purple images`);
    console.log('   - Product now shows the correct color scheme images');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
updatePinkBagImages();
