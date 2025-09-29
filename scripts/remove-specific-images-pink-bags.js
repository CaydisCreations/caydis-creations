const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product 1 (ID: prod_SlvCyL1ArUUcAa) - Remove third image
const product1Id = 'prod_SlvCyL1ArUUcAa';
const product1Images = [
  // Remove third image (IMG_6216.jpeg), keep the rest
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6117.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
];

// Product 2 (ID: prod_ScqwTo3jjqx8Kc) - Remove first image
const product2Id = 'prod_ScqwTo3jjqx8Kc';
const product2Images = [
  // Remove first image (IMG_6117.jpeg), keep the rest
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6216.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
];

async function removeSpecificImagesFromPinkBags() {
  try {
    console.log('🔄 Removing specific images from both pink bag products...\n');

    // Update Product 1 - Remove third image
    console.log('📝 Updating Product 1 (Handbag - Multicolor (Pink Bag - Flowers Lining)):');
    console.log('   - Removing third image (IMG_6216.jpeg)');
    console.log(`   - Keeping ${product1Images.length} images`);
    
    const product1 = await stripe.products.update(product1Id, {
      images: product1Images
    });
    
    console.log(`✅ Product 1 updated: ${product1.name}`);
    console.log(`   - New image count: ${product1.images.length}`);
    console.log(`   - First image now: ${product1.images[0]}\n`);

    // Update Product 2 - Remove first image
    console.log('📝 Updating Product 2 (Handbag - Multicolor (Pink Bag - Solid Pink Lining)):');
    console.log('   - Removing first image (IMG_6117.jpeg)');
    console.log(`   - Keeping ${product2Images.length} images`);
    
    const product2 = await stripe.products.update(product2Id, {
      images: product2Images
    });
    
    console.log(`✅ Product 2 updated: ${product2.name}`);
    console.log(`   - New image count: ${product2.images.length}`);
    console.log(`   - First image now: ${product2.images[0]}\n`);

    console.log('🎉 Both pink bag products updated with specific images removed!');
    console.log('\n📋 Summary:');
    console.log('   - Product 1: Removed third image (IMG_6216.jpeg)');
    console.log('   - Product 2: Removed first image (IMG_6117.jpeg)');
    console.log('   - Both products now have 7 images instead of 8');
    console.log('   - Changes are live on your website');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
removeSpecificImagesFromPinkBags();
