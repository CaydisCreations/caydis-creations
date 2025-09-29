const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function reorderHandbagImages() {
  try {
    console.log('🔄 Reordering handbag product images to put model images first...\n');

    // Get all products
    const products = await stripe.products.list({ limit: 100 });
    
    // Find all handbag products
    const handbagProducts = products.data.filter(product => 
      product.name.toLowerCase().includes('handbag') || 
      product.name.toLowerCase().includes('bag')
    );

    console.log(`Found ${handbagProducts.length} handbag products to process:\n`);

    let updatedCount = 0;

    for (const product of handbagProducts) {
      console.log(`📝 Processing: ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      
      // Get current images
      const currentImages = product.images || [];
      console.log(`   Current images: ${currentImages.length}`);
      
      if (currentImages.length === 0) {
        console.log(`   ⚠️  No images to reorder\n`);
        continue;
      }

      // Separate model images from other images
      const modelImages = currentImages.filter(image => 
        image.includes('/model/') || 
        image.includes('model/') ||
        image.toLowerCase().includes('model')
      );
      
      const otherImages = currentImages.filter(image => 
        !image.includes('/model/') && 
        !image.includes('model/') &&
        !image.toLowerCase().includes('model')
      );

      console.log(`   Model images found: ${modelImages.length}`);
      console.log(`   Other images: ${otherImages.length}`);

      // Create new order: model images first, then others
      const reorderedImages = [...modelImages, ...otherImages];
      
      // Check if reordering is needed
      const needsUpdate = JSON.stringify(currentImages) !== JSON.stringify(reorderedImages);
      
      if (needsUpdate) {
        console.log(`   🔄 Reordering images...`);
        
        // Update the product with reordered images
        await stripe.products.update(product.id, {
          images: reorderedImages
        });
        
        console.log(`   ✅ Updated successfully!`);
        console.log(`   New order: ${reorderedImages.length} images`);
        updatedCount++;
      } else {
        console.log(`   ✅ Already in correct order`);
      }
      
      console.log('');
    }

    console.log(`🎉 Successfully processed ${handbagProducts.length} handbag products!`);
    console.log(`📊 Products updated: ${updatedCount}`);

  } catch (error) {
    console.error('❌ Error reordering handbag images:', error.message);
  }
}

reorderHandbagImages();