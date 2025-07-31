const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Bag image mappings
const bagImageMappings = {
  'rainbow': {
    main: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg'],
    modeled: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg'
    ]
  },
  'white_blue_green_yellow_red': {
    main: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6124.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/IMG_6125.jpeg'
    ],
    modeled: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6151.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6152.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/white_blue_green_yellow_red/modeled/IMG_6156.jpeg'
    ]
  },
  'red_pink_orange_purple': {
    main: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg'],
    modeled: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
    ]
  },
  'cream_colored': {
    main: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg'],
    modeled: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg'
    ]
  },
  'gray': {
    main: [], // No main images available
    modeled: [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/gray/modeled/IMG_6141.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/gray/modeled/IMG_6143.jpeg'
    ]
  }
};

async function fixBagProducts() {
  try {
    console.log('🔧 Starting bag product fixes...\n');

    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const bagProducts = products.data.filter(p => 
      p.metadata?.category === 'Bags' || 
      p.name.toLowerCase().includes('bag') ||
      p.name.toLowerCase().includes('handbag')
    );

    console.log(`📦 Found ${bagProducts.length} bag products`);

    // 1. Deactivate duplicate "Handbag - Multicolor (Dark Bag)" products
    const darkBagProducts = bagProducts.filter(p => 
      p.name === 'Handbag - Multicolor (Dark Bag)'
    );

    if (darkBagProducts.length > 1) {
      console.log(`🗑️ Found ${darkBagProducts.length} duplicate "Dark Bag" products`);
      
      // Keep the first one active, deactivate the rest
      const toDeactivate = darkBagProducts.slice(1);
      for (const product of toDeactivate) {
        console.log(`🚫 Deactivating duplicate product: ${product.name} (${product.id})`);
        
        // Deactivate the product
        await stripe.products.update(product.id, { active: false });
        console.log(`✅ Deactivated product: ${product.id}`);
      }
      console.log(`✅ Deactivated ${toDeactivate.length} duplicate products\n`);
    }

    // 2. Create new gray bag product
    console.log('🆕 Creating new gray bag product...');
    const grayBagProduct = await stripe.products.create({
      name: 'Handbag - Gray',
      description: 'Handbag, acrylic, gray. Length: 22 inches, Width: 15.5 inches.',
      metadata: {
        category: 'Bags',
        colors: 'Gray',
        dimensions: JSON.stringify({length: '22 inches', width: '15.5 inches'}),
        material: 'Acrylic',
        parcel_height: '2',
        parcel_length: '13',
        parcel_weight_oz: '12.8',
        parcel_width: '8',
        stock: '1',
        tags: 'bag,gray'
      }
    });

    // Create price for gray bag
    await stripe.prices.create({
      product: grayBagProduct.id,
      unit_amount: 5000, // $50.00
      currency: 'usd',
      metadata: {
        category: 'Bags'
      }
    });

    console.log(`✅ Created gray bag product: ${grayBagProduct.id}`);

    // 3. Update all bag products with correct images
    console.log('\n🖼️ Updating bag products with correct images...');

    const updatedBagProducts = await stripe.products.list({
      limit: 100,
      active: true
    });

    const currentBagProducts = updatedBagProducts.data.filter(p => 
      p.metadata?.category === 'Bags' || 
      p.name.toLowerCase().includes('bag') ||
      p.name.toLowerCase().includes('handbag')
    );

    for (const product of currentBagProducts) {
      console.log(`\n📦 Processing: ${product.name}`);
      
      let imagesToAdd = [];
      
      // Map products to their correct images
      if (product.name.includes('Pink Bag - Flowers Lining')) {
        imagesToAdd = [...bagImageMappings.rainbow.main, ...bagImageMappings.rainbow.modeled];
        console.log(`🖼️ Adding ${imagesToAdd.length} rainbow bag images`);
      } else if (product.name.includes('Light Bag')) {
        imagesToAdd = [...bagImageMappings.white_blue_green_yellow_red.main, ...bagImageMappings.white_blue_green_yellow_red.modeled];
        console.log(`🖼️ Adding ${imagesToAdd.length} white_blue_green_yellow_red bag images`);
      } else if (product.name.includes('Pink Bag - Solid Pink Lining')) {
        imagesToAdd = [...bagImageMappings.red_pink_orange_purple.main, ...bagImageMappings.red_pink_orange_purple.modeled];
        console.log(`🖼️ Adding ${imagesToAdd.length} red_pink_orange_purple bag images`);
      } else if (product.name.includes('Beige/White Lining')) {
        imagesToAdd = [...bagImageMappings.cream_colored.main, ...bagImageMappings.cream_colored.modeled];
        console.log(`🖼️ Adding ${imagesToAdd.length} cream_colored bag images`);
      } else if (product.name.includes('Dark Bag')) {
        imagesToAdd = [...bagImageMappings.red_pink_orange_purple.main, ...bagImageMappings.red_pink_orange_purple.modeled];
        console.log(`🖼️ Adding ${imagesToAdd.length} red_pink_orange_purple bag images (for dark bag)`);
      } else if (product.name === 'Handbag - Gray') {
        imagesToAdd = [...bagImageMappings.gray.modeled]; // Only modeled images available
        console.log(`🖼️ Adding ${imagesToAdd.length} gray bag modeled images`);
      } else if (product.name === 'Shoulder Bag - Brown') {
        console.log(`⏭️ Skipping Shoulder Bag - Brown (keeping existing images)`);
        continue;
      } else {
        console.log(`❓ Unknown bag product: ${product.name}`);
        continue;
      }

      // Update product with new images
      if (imagesToAdd.length > 0) {
        await stripe.products.update(product.id, {
          images: imagesToAdd
        });
        console.log(`✅ Updated ${product.name} with ${imagesToAdd.length} images`);
      }
    }

    console.log('\n🎉 Bag product fixes completed!');
    console.log('\n📋 Summary:');
    console.log('- Deactivated duplicate Dark Bag products');
    console.log('- Created new Gray Bag product');
    console.log('- Updated all bag products with correct images');
    console.log('- Left Shoulder Bag - Brown unchanged');

  } catch (error) {
    console.error('❌ Error fixing bag products:', error);
  }
}

fixBagProducts(); 