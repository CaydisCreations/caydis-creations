const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Corrected image mappings with proper S3 paths
const correctedImageMappings = {
  // BEANIE PRODUCTS
  'Beanie - Blue with Strands of White': {
    description: 'Beanie, acrylic, blue with strands of white',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6186.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/IMG_6109.jpeg'
    ]
  },
  'Beanie - Multi-color (Blue, White, Green, Beige)': {
    description: 'Beanie, acrylic, multicolor: blue, white, green, beige',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/IMG_6183.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/IMG_6187.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/IMG_6110.jpeg'
    ]
  },
  'Beanie - Multi-color (Pink, Orange, Yellow, Blue)': {
    description: 'Beanie, acrylic, multicolor: pink, orange, yellow, blue',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6181.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6180.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/IMG_6106.jpeg'
    ]
  },

  // SCARF PRODUCTS
  'Scarf - White': {
    description: 'Scarf, acrylic, white',
    material: 'Acrylic',
    size: 'Length: 59 inches, Width: 7 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6236.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6240.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6248.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6251.jpeg'
    ]
  },
  'Scarf - Green, White': {
    description: 'Scarf, cotton, green and white',
    material: 'Cotton',
    size: 'Length: 60 inches, Width: 8 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6260.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6280.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6281.jpeg'
    ]
  }
};

async function fixImagePaths() {
  try {
    console.log('🔧 Fixing incorrect image paths...\n');

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
      const update = correctedImageMappings[product.name];
      
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

    console.log('\n🎉 Image path fixes completed!');
    console.log(`✅ Fixed: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  }
}

fixImagePaths(); 