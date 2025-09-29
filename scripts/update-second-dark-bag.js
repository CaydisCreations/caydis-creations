const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// All images from the rainbow/ folder and modeled/ subfolder
const rainbowBagImages = [
  // Images from the main rainbow/ folder
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6121.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6217.jpeg',
  
  // Images from the modeled/ subfolder
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg'
];

// The specific product ID that needs updating
const productIdToUpdate = 'prod_SlvC49ifPVmHzA';

async function updateSecondDarkBag() {
  try {
    console.log('🔄 Updating the second "Handbag - Multicolor (Dark Bag)" product...\n');
    console.log(`📸 Using ${rainbowBagImages.length} rainbow images:`);
    rainbowBagImages.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    console.log('');

    // Get the specific product
    const product = await stripe.products.retrieve(productIdToUpdate);
    
    console.log(`📝 Updating product: ${product.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Current images: ${product.images?.length || 0} images`);
    console.log(`   New images: ${rainbowBagImages.length} images`);

    // Update the product with new images
    const updatedProduct = await stripe.products.update(productIdToUpdate, {
      images: rainbowBagImages
    });

    console.log(`✅ Successfully updated ${product.name}`);
    console.log(`   New images: ${updatedProduct.images.length} images`);
    console.log(`   First image: ${updatedProduct.images[0]}\n`);

    console.log('🎉 Second "Handbag - Multicolor (Dark Bag)" updated with rainbow images!');
    console.log('\n📋 Summary:');
    console.log(`   - Updated product ID: ${productIdToUpdate}`);
    console.log(`   - Used ${rainbowBagImages.length} rainbow images`);
    console.log('   - Both "Handbag - Multicolor (Dark Bag)" products now have rainbow images');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
updateSecondDarkBag();
