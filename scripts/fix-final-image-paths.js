const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Final corrected image mappings with proper S3 paths
const finalImageMappings = {
  // BEANIE PRODUCTS
  'Beanie - Multi-color (Blue, White, Green, Beige)': {
    description: 'Beanie, acrylic, multicolor: blue, white, green, beige',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%202.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%203.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/IMG_6201.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/IMG_6104.jpeg'
    ]
  },
  'Beanie - Multi-color (Pink, Orange, Yellow, Blue)': {
    description: 'Beanie, acrylic, multicolor: pink, orange, yellow, blue',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6207.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6210.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6212.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/IMG_6107.jpeg'
    ]
  }
};

async function fixFinalImagePaths() {
  try {
    console.log('🔧 Fixing final incorrect image paths...\n');

    // Get all active products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    console.log(`📦 Found ${products.data.length} active products`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each product
    for (const product of products.data) {
      const update = finalImageMappings[product.name];
      
      if (update) {
        console.log(`\n📦 Fixing: ${product.name}`);
        
        // Prepare metadata update
        const metadataUpdate = {
          ...product.metadata,
          material: update.material,
          size: update.size
        };

        // Update the product
        await stripe.products.update(product.id, {
          description: update.description,
          images: update.images,
          metadata: metadataUpdate
        });

        console.log(`✅ Fixed ${product.name}`);
        console.log(`   Description: ${update.description}`);
        console.log(`   Material: ${update.material}`);
        console.log(`   Size: ${update.size}`);
        console.log(`   Images: ${update.images.length} images`);
        
        updatedCount++;
      } else {
        console.log(`⏭️ Skipping: ${product.name} (no fix needed)`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Final image path fixes completed!');
    console.log(`✅ Fixed: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  }
}

fixFinalImagePaths(); 