const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Remaining product updates
const remainingProductUpdates = {
  'Shoulder Bag - Brown': {
    description: 'Shoulder bag, acrylic, brown',
    material: 'Acrylic',
    size: 'Length: 21 inches, Width: 10 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/brown/modeled/IMG_6147.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/brown/modeled/IMG_6148.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/brown/IMG_6126.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/brown/IMG_6127.jpeg'
    ]
  },
  'Beanie - Blue with Strands of White': {
    description: 'Beanie, acrylic, blue with strands of white',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white/modeled/IMG_6184.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white/modeled/IMG_6188.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white/IMG_6108.jpeg'
    ]
  },
  'Beanie - Multi-color (Blue, White, Green, Beige)': {
    description: 'Beanie, acrylic, multicolor: blue, white, green, beige',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white_green_beige/modeled/IMG_6185.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white_green_beige/modeled/IMG_6189.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white_green_beige/IMG_6107.jpeg'
    ]
  },
  'Beanie - Multi-color (Pink, Orange, Yellow, Blue)': {
    description: 'Beanie, acrylic, multicolor: pink, orange, yellow, blue',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/pink_orange_yellow_blue/modeled/IMG_6181.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/pink_orange_yellow_blue/modeled/IMG_6180.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/pink_orange_yellow_blue/IMG_6106.jpeg'
    ]
  },
  'Scrunchie: Purple Pink Orange': {
    description: 'Scrunchie, acrylic, multicolor: purple, pink, orange',
    material: 'Acrylic',
    size: 'Standard size',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/purple_pink_orange/IMG_6117.jpeg'
    ]
  },
  'Scrunchie: Pink Orange White': {
    description: 'Scrunchie, acrylic, multicolor: pink, orange, white',
    material: 'Acrylic',
    size: 'Standard size',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/pink_orange_white/IMG_6118.jpeg'
    ]
  },
  'Scrunchie Set 6': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set6/IMG_6120.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set6/IMG_6121.jpeg'
    ]
  },
  'Scrunchie Set 5': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set5/IMG_6123.jpeg'
    ]
  },
  'Scrunchie Set 4': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set4/IMG_6122.jpeg'
    ]
  },
  'Scrunchie Set 1': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set1/IMG_6113.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set1/IMG_6114.jpeg'
    ]
  },
  'Scarf - Green, White': {
    description: 'Scarf, cotton, green and white',
    material: 'Cotton',
    size: 'Length: 60 inches, Width: 8 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/modeled/IMG_6178.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/modeled/IMG_6179.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/IMG_6112.jpeg'
    ]
  }
};

async function updateRemainingProducts() {
  try {
    console.log('🔄 Updating remaining products with new descriptions and reordered images...\n');

    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    console.log(`📦 Found ${products.data.length} total products`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each product
    for (const product of products.data) {
      const update = remainingProductUpdates[product.name];
      
      if (update) {
        console.log(`\n📦 Updating: ${product.name}`);
        
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

        console.log(`✅ Updated ${product.name}`);
        console.log(`   Description: ${update.description}`);
        console.log(`   Material: ${update.material}`);
        console.log(`   Size: ${update.size}`);
        console.log(`   Images: ${update.images.length} images`);
        
        updatedCount++;
      } else {
        console.log(`⏭️ Skipping: ${product.name} (no update defined)`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Remaining product updates completed!');
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

updateRemainingProducts(); 