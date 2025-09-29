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

// Define the two products you want to update
const productsToUpdate = [
  'Handbag - Multicolor (Dark Bag)', // Product 1
  'Handbag - Multicolor (Pink Bag - Flowers Lining)' // Product 2 - adjust this name if different
];

async function updateRainbowBagImages() {
  try {
    console.log('🔄 Starting rainbow bag image updates...\n');
    console.log(`📸 Found ${rainbowBagImages.length} images to use:`);
    rainbowBagImages.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    console.log('');

    // Get all products to find the ones we want to update
    const products = await stripe.products.list({ active: true, limit: 100 });
    
    for (const productName of productsToUpdate) {
      const product = products.data.find(p => p.name === productName);
      
      if (!product) {
        console.log(`❌ Product "${productName}" not found`);
        console.log('Available products:');
        products.data.forEach(p => console.log(`   - ${p.name}`));
        continue;
      }

      console.log(`📝 Updating images for: ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Current images: ${product.images?.length || 0} images`);
      console.log(`   New images: ${rainbowBagImages.length} images`);

      // Update the product with new images
      const updatedProduct = await stripe.products.update(product.id, {
        images: rainbowBagImages
      });

      console.log(`✅ Successfully updated ${product.name}`);
      console.log(`   New images: ${updatedProduct.images.length} images`);
      console.log(`   First image: ${updatedProduct.images[0]}\n`);
    }

    console.log('🎉 All rainbow bag image updates completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Updated ${productsToUpdate.length} products`);
    console.log(`   - Used ${rainbowBagImages.length} images from rainbow/ folder`);
    console.log('   - Images are now live on your website');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
updateRainbowBagImages();
