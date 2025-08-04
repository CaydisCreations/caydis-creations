const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product updates with new descriptions and image reordering
const productUpdates = {
  // BAG PRODUCTS
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
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6151.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6152.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6156.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6124.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6125.jpeg'
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
  'Handbag - Light Brown': {
    description: 'Handbag, acrylic, light-brown',
    material: 'Acrylic',
    size: 'Length: 22 inches, Width: 15.5 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6143.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6144.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/IMG_6128.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/IMG_6129.jpeg'
    ]
  },

  // BEANIE PRODUCTS
  'Beanie - Blue': {
    description: 'Beanie, acrylic, blue',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6186.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/IMG_6109.jpeg'
    ]
  },
  'Beanie - Multi-color (Green, Blue, White, Brown)': {
    description: 'Beanie, acrylic, multicolor: green, blue, white, brown',
    material: 'Acrylic',
    size: 'Length: 10 inches, Width: 11 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/multicolor/modeled/IMG_6183.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/multicolor/modeled/IMG_6187.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/multicolor/IMG_6110.jpeg'
    ]
  },

  // SCARF PRODUCTS
  'Scarf - White': {
    description: 'Scarf, acrylic, white',
    material: 'Acrylic',
    size: 'Length: 59 inches, Width: 7 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/white/modeled/IMG_6174.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/white/modeled/IMG_6175.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/white/IMG_6111.jpeg'
    ]
  },
  'Scarf - Green': {
    description: 'Scarf, cotton, green',
    material: 'Cotton',
    size: 'Length: 60 inches, Width: 8 inches',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green/modeled/IMG_6176.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green/modeled/IMG_6177.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green/IMG_6112.jpeg'
    ]
  },

  // SCRUNCHIE PRODUCTS
  'Scrunchie Set 2': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set2/IMG_6113.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set2/IMG_6114.jpeg'
    ]
  },
  'Scrunchie Set 3': {
    description: 'Scrunchie set, acrylic, multicolor',
    material: 'Acrylic',
    size: 'Standard size set',
    images: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set3/IMG_6115.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/set3/IMG_6116.jpeg'
    ]
  }
};

async function updateAllProducts() {
  try {
    console.log('🔄 Updating all products with new descriptions and reordered images...\n');

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
      const update = productUpdates[product.name];
      
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
        console.log(`   Images: ${update.images.length} images (modeled first)`);
        
        updatedCount++;
      } else {
        console.log(`⏭️ Skipping: ${product.name} (no update defined)`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Product updates completed!');
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

updateAllProducts(); 