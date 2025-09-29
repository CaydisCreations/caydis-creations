const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product 1 (ID: prod_SmePkdpV8FocKE) - Remove first image
const product1Id = 'prod_SmePkdpV8FocKE';
const product1Images = [
  // Remove first image (IMG_6121.jpeg), keep the rest
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6217.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg'
];

// Product 2 (ID: prod_SlvC49ifPVmHzA) - Remove third image
const product2Id = 'prod_SlvC49ifPVmHzA';
const product2Images = [
  // Remove third image (IMG_6217.jpeg), keep the rest
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6121.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg'
];

async function removeSpecificImages() {
  try {
    console.log('🔄 Removing specific images from both products...\n');

    // Update Product 1 - Remove first image
    console.log('📝 Updating Product 1 (Handbag - Multicolor (Dark Bag, Leaf Lining)):');
    console.log('   - Removing first image (IMG_6121.jpeg)');
    console.log(`   - Keeping ${product1Images.length} images`);
    
    const product1 = await stripe.products.update(product1Id, {
      images: product1Images
    });
    
    console.log(`✅ Product 1 updated: ${product1.name}`);
    console.log(`   - New image count: ${product1.images.length}`);
    console.log(`   - First image now: ${product1.images[0]}\n`);

    // Update Product 2 - Remove third image
    console.log('📝 Updating Product 2 (Handbag - Multicolor (Dark Bag, Solid Lining)):');
    console.log('   - Removing third image (IMG_6217.jpeg)');
    console.log(`   - Keeping ${product2Images.length} images`);
    
    const product2 = await stripe.products.update(product2Id, {
      images: product2Images
    });
    
    console.log(`✅ Product 2 updated: ${product2.name}`);
    console.log(`   - New image count: ${product2.images.length}`);
    console.log(`   - First image now: ${product2.images[0]}\n`);

    console.log('🎉 Both products updated with specific images removed!');
    console.log('\n📋 Summary:');
    console.log('   - Product 1: Removed first image (IMG_6121.jpeg)');
    console.log('   - Product 2: Removed third image (IMG_6217.jpeg)');
    console.log('   - Both products now have 5 images instead of 6');
    console.log('   - Changes are live on your website');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
removeSpecificImages();
