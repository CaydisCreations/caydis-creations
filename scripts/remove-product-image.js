const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function listProductImages() {
  try {
    console.log('🔍 Listing all products with their images...\n');
    
    // Get all active products
    const products = await stripe.products.list({ limit: 100, active: true });
    
    console.log('📋 Products with images:');
    products.data.forEach(product => {
      if (product.images && product.images.length > 0) {
        console.log(`\n👜 ${product.name} (${product.id})`);
        console.log(`💰 Price: $${product.metadata?.price || 'N/A'}`);
        console.log(`🖼️ Images (${product.images.length}):`);
        product.images.forEach((url, index) => {
          console.log(`  ${index + 1}. ${url}`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error listing products:', error);
  }
}

async function removeImageFromProduct(productId, imageUrlToRemove) {
  try {
    console.log(`🔄 Removing image from product ${productId}...`);
    
    // Get the product
    const product = await stripe.products.retrieve(productId);
    
    if (!product.images || product.images.length === 0) {
      console.log('❌ Product has no images');
      return;
    }
    
    // Find the image to remove
    const imageIndex = product.images.findIndex(url => url === imageUrlToRemove);
    
    if (imageIndex === -1) {
      console.log('❌ Image not found in product');
      console.log('Available images:');
      product.images.forEach((url, index) => {
        console.log(`  ${index + 1}. ${url}`);
      });
      return;
    }
    
    // Remove the image
    const updatedImages = product.images.filter(url => url !== imageUrlToRemove);
    
    console.log(`✅ Removing image: ${imageUrlToRemove}`);
    console.log(`📊 Images before: ${product.images.length}, after: ${updatedImages.length}`);
    
    // Update the product
    const updatedProduct = await stripe.products.update(productId, {
      images: updatedImages
    });
    
    console.log(`✅ Successfully updated ${updatedProduct.name}`);
    console.log('📋 Remaining images:');
    updatedProduct.images.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
  } catch (error) {
    console.error('❌ Error removing image:', error);
  }
}

async function removeImageByProductName(productName, imageUrlToRemove) {
  try {
    console.log(`🔍 Finding product: ${productName}`);
    
    // Get all active products
    const products = await stripe.products.list({ limit: 100, active: true });
    const product = products.data.find(p => p.name === productName);
    
    if (!product) {
      console.log('❌ Product not found');
      return;
    }
    
    await removeImageFromProduct(product.id, imageUrlToRemove);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Usage:');
    console.log('  node scripts/remove-product-image.js list');
    console.log('  node scripts/remove-product-image.js remove <productId> <imageUrl>');
    console.log('  node scripts/remove-product-image.js removeByName <productName> <imageUrl>');
    console.log('\nExamples:');
    console.log('  node scripts/remove-product-image.js list');
    console.log('  node scripts/remove-product-image.js remove prod_123 https://example.com/image.jpg');
    console.log('  node scripts/remove-product-image.js removeByName "Handbag - Light Brown" https://example.com/image.jpg');
    return;
  }
  
  const command = args[0];
  
  if (command === 'list') {
    await listProductImages();
  } else if (command === 'remove' && args.length === 3) {
    await removeImageFromProduct(args[1], args[2]);
  } else if (command === 'removeByName' && args.length === 3) {
    await removeImageByProductName(args[1], args[2]);
  } else {
    console.log('❌ Invalid command or missing arguments');
    console.log('Use: node scripts/remove-product-image.js list');
  }
}

main(); 