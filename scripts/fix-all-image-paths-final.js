const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Corrected image mappings based on actual S3 structure
const correctImageMappings = {
  // BAG PRODUCTS - These are working correctly
  'Handbag - Multicolor (Dark Bag)': {
    description: 'Handbag, acrylic, multicolor: red, orange, pink, purple, green, blue',
    material: 'Acrylic',
    size: 'Length: 23 inches, Width: 15.5 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg'
    ]
  },
  'Handbag - Multicolor (Pink Bag - Flowers Lining)': {
    description: 'Handbag, acrylic, multicolor: pink, purple, red, orange',
    material: 'Acrylic',
    size: 'Length: 22 inches, Width: 15.5 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg'
    ]
  },
  'Handbag - Multicolor (Pink Bag - Solid Pink Lining)': {
    description: 'Handbag, acrylic, multicolor: pink, purple, red, orange',
    material: 'Acrylic',
    size: 'Length: 22 inches, Width: 15.5 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg'
    ]
  },
  'Handbag - Multicolor (Light Bag)': {
    description: 'Handbag, acrylic, multicolor: white, pink, green, blue, red, orange',
    material: 'Acrylic',
    size: 'Length: 22.5 inches, Width: 15 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6151.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6152.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6156.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6124.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6125.jpeg'
    ]
  },
  'Handbag - Beige/White Lining': {
    description: 'Handbag, acrylic, beige',
    material: 'Acrylic',
    size: 'Length: 23 inches, Width: 16 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg'
    ]
  },
  'Shoulder Bag - Brown': {
    description: 'Shoulder bag, acrylic, brown',
    material: 'Acrylic',
    size: 'Length: 21 inches, Width: 10 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6143.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6141.jpeg'
    ]
  },

  // BEANIE PRODUCTS - Fixed with correct paths
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
  },

  // SCARF PRODUCTS - Fixed with correct paths
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
  },
  'Scarf - Green': {
    description: 'Scarf, cotton, green',
    material: 'Cotton',
    size: 'Length: 60 inches, Width: 8 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6293.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6295.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6299.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6302.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6317.jpeg'
    ]
  },

  // SCRUNCHIE PRODUCTS - Using actual S3 files
  'Scrunchie: Purple Pink Orange': {
    description: 'Scrunchie, acrylic, multicolor: purple, pink, orange',
    material: 'Acrylic',
    size: 'Standard size',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg'
    ]
  },
  'Scrunchie: Pink Orange White': {
    description: 'Scrunchie, acrylic, multicolor: pink, orange, white',
    material: 'Acrylic',
    size: 'Standard size',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/32384b1b-d9d7-4134-9161-4a8397c020d9.jpeg'
    ]
  },
  'Scrunchie Set 1': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5956c54e-731a-4c33-8490-130c94bb2ed2.jpeg'
    ]
  },
  'Scrunchie Set 2': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/60aecdee-8a22-4b8a-92c2-6a53df9f8ac9.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/8650dfcb-9445-4ab0-aa60-879e02b08147.jpeg'
    ]
  },
  'Scrunchie Set 3': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/943b5fbd-159b-4128-90b4-cc1f86812669.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/bbed883a-94b1-4eb7-a0bc-091b39e251c9.jpeg'
    ]
  },
  'Scrunchie Set 4': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/c4696fba-0026-4f00-ba40-8eb9bc1d24a0.jpeg'
    ]
  },
  'Scrunchie Set 5': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg'
    ]
  },
  'Scrunchie Set 6': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/32384b1b-d9d7-4134-9161-4a8397c020d9.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg'
    ]
  }
};

async function fixAllImagePaths() {
  try {
    console.log('🔧 Fixing ALL image paths based on actual S3 structure...\n');

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
      const update = correctImageMappings[product.name];
      
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

    console.log('\n🎉 ALL image path fixes completed!');
    console.log(`✅ Fixed: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  }
}

fixAllImagePaths(); 