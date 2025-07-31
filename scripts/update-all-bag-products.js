const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Image mappings for each product
const imageMappings = {
  'light_rainbow': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6124.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6125.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6151.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6152.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6156.jpeg'
  ],
  'red_pink_orange_purple': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6117.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6119.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/IMG_6216.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6159.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6163.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6164.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6167.jpeg'
  ],
  'rainbow': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6121.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6122.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/IMG_6217.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6169.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6171.jpeg'
  ],
  'light_brown': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6141.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6143.jpeg'
  ],
  'cream_colored': [
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/IMG_6130.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
    'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6149.jpeg'
  ]
};

async function updateAllBagProducts() {
  try {
    console.log('🔄 Updating all bag products with correct images and descriptions...\n');

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

    // Update each product
    for (const product of bagProducts) {
      console.log(`\n📦 Processing: ${product.name}`);
      
      let updateData = {};
      
      // Map products to their updates
      if (product.name === 'Handbag - Light Rainbow') {
        updateData = {
          name: 'Handbag - Multicolor (Light Bag)',
          description: 'Handbag, acrylic, multicolor: white, pink, green, blue, red, orange. Inner lining: white. Length: 22.5 inches, Width: 15 inches.',
          images: imageMappings.light_rainbow,
          metadata: {
            category: 'Bags',
            colors: 'White,Pink,Green,Blue,Red,Orange',
            dimensions: JSON.stringify({length: '22.5 inches', width: '15 inches'}),
            inner_lining: 'white',
            local_id: '9',
            material: 'Acrylic',
            parcel_height: '2',
            parcel_length: '13',
            parcel_weight_oz: '12.8',
            parcel_width: '8',
            stock: '2',
            tags: 'bag,light_rainbow,multicolor'
          }
        };
        console.log(`🖼️ Adding ${imageMappings.light_rainbow.length} light_rainbow images`);
      } else if (product.name === 'Handbag - Multicolor (Pink Bag - Flowers Lining)') {
        updateData = {
          images: imageMappings.red_pink_orange_purple,
          metadata: {
            ...product.metadata,
            tags: 'bag,pink,multicolor,flowers'
          }
        };
        console.log(`🖼️ Adding ${imageMappings.red_pink_orange_purple.length} red_pink_orange_purple images`);
      } else if (product.name === 'Handbag - Multicolor (Pink Bag - Solid Pink Lining)') {
        updateData = {
          images: imageMappings.red_pink_orange_purple,
          metadata: {
            ...product.metadata,
            tags: 'bag,pink,multicolor'
          }
        };
        console.log(`🖼️ Adding ${imageMappings.red_pink_orange_purple.length} red_pink_orange_purple images`);
      } else if (product.name === 'Handbag - Multicolor (Dark Bag)') {
        updateData = {
          description: 'Handbag, acrylic, multicolor: white, pink, green, blue, red, orange. Inner lining: green leaf pattern. Length: 22.5 inches, Width: 15 inches.',
          images: imageMappings.rainbow,
          metadata: {
            category: 'Bags',
            colors: 'White,Pink,Green,Blue,Red,Orange',
            dimensions: JSON.stringify({length: '22.5 inches', width: '15 inches'}),
            inner_lining: 'green leaf pattern',
            local_id: '9',
            material: 'Acrylic',
            parcel_height: '2',
            parcel_length: '13',
            parcel_weight_oz: '12.8',
            parcel_width: '8',
            stock: '1',
            tags: 'bag,rainbow,multicolor'
          }
        };
        console.log(`🖼️ Adding ${imageMappings.rainbow.length} rainbow images and updating to green leaf pattern`);
      } else if (product.name === 'Handbag - Light Brown') {
        updateData = {
          name: 'Handbag - Light Brown',
          description: 'Handbag, acrylic, light-brown. Length: 22 inches, Width: 15.5 inches.',
          images: imageMappings.light_brown,
          metadata: {
            category: 'Bags',
            colors: 'Light Brown',
            dimensions: JSON.stringify({length: '22 inches', width: '15.5 inches'}),
            material: 'Acrylic',
            parcel_height: '2',
            parcel_length: '13',
            parcel_weight_oz: '12.8',
            parcel_width: '8',
            stock: '1',
            tags: 'bag,light_brown'
          }
        };
        console.log(`🖼️ Adding ${imageMappings.light_brown.length} light_brown images`);
      } else if (product.name === 'Handbag - Beige/White Lining') {
        updateData = {
          images: imageMappings.cream_colored,
          metadata: {
            ...product.metadata,
            tags: 'bag,cream,beige'
          }
        };
        console.log(`🖼️ Adding ${imageMappings.cream_colored.length} cream_colored images`);
      } else {
        console.log(`⏭️ Skipping ${product.name} (no updates needed)`);
        continue;
      }

      // Update the product
      const updatedProduct = await stripe.products.update(product.id, updateData);
      console.log(`✅ Updated ${updatedProduct.name} with ${updatedProduct.images.length} images`);
    }

    console.log('\n🎉 All bag products updated successfully!');
    console.log('\n📋 Summary of updates:');
    console.log('- Handbag - Light Rainbow → Handbag - Multicolor (Light Bag)');
    console.log('- Updated Pink Bag products with red_pink_orange_purple images');
    console.log('- Updated Dark Bag with rainbow images and green leaf pattern');
    console.log('- Updated Light Brown bag with correct description');
    console.log('- Updated Beige/White Lining with cream_colored images');

  } catch (error) {
    console.error('❌ Error updating bag products:', error);
  }
}

updateAllBagProducts(); 