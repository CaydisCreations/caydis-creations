const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define the products and their new images
const productUpdates = [
  {
    productName: 'Product Name 1', // Replace with actual product name
    newImages: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/NewFolder/new-image-1.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/NewFolder/new-image-2.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/NewFolder/new-image-3.jpeg'
    ]
  },
  {
    productName: 'Product Name 2', // Replace with actual product name
    newImages: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/NewFolder/new-image-4.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/NewFolder/new-image-5.jpeg'
    ]
  },
  {
    productName: 'Product Name 3', // Replace with actual product name
    newImages: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/NewFolder/new-image-6.jpeg'
    ]
  }
];

async function updateProductImages() {
  try {
    console.log('🔄 Starting product image updates...\n');

    // Get all products to find the ones we want to update
    const products = await stripe.products.list({ active: true, limit: 100 });
    
    for (const update of productUpdates) {
      const product = products.data.find(p => p.name === update.productName);
      
      if (!product) {
        console.log(`❌ Product "${update.productName}" not found`);
        continue;
      }

      console.log(`📝 Updating images for: ${product.name}`);
      console.log(`   Old images: ${product.images?.length || 0} images`);
      console.log(`   New images: ${update.newImages.length} images`);

      // Update the product with new images
      const updatedProduct = await stripe.products.update(product.id, {
        images: update.newImages
      });

      console.log(`✅ Successfully updated ${product.name}`);
      console.log(`   New images: ${updatedProduct.images.length} images\n`);
    }

    console.log('🎉 All product image updates completed!');
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

// Run the update
updateProductImages();
