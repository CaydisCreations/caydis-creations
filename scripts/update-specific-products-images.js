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

// CUSTOMIZE THESE: Replace with the exact product names you want to update
const productsToUpdate = [
  'Handbag - Multicolor (Dark Bag)', // Replace with your first product name
  'Handbag - Multicolor (Pink Bag - Flowers Lining)' // Replace with your second product name
];

async function updateSpecificProductsImages() {
  try {
    console.log('🔄 Starting product image updates...\n');
    console.log(`📸 Using ${rainbowBagImages.length} images from rainbow/ folder:`);
    rainbowBagImages.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    console.log('');

    // Get all products to find the ones we want to update
    const products = await stripe.products.list({ active: true, limit: 100 });
    
    console.log('🔍 Available products:');
    products.data.forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name} (ID: ${p.id})`);
    });
    console.log('');

    for (const productName of productsToUpdate) {
      const product = products.data.find(p => p.name === productName);
      
      if (!product) {
        console.log(`❌ Product "${productName}" not found`);
        console.log('Please check the product name and try again.\n');
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

    console.log('🎉 All product image updates completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Updated ${productsToUpdate.length} products`);
    console.log(`   - Used ${rainbowBagImages.length} images from rainbow/ folder`);
    console.log('   - Images are now live on your website');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
updateSpecificProductsImages();
