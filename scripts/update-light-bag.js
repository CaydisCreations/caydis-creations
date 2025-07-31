const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateLightBag() {
  try {
    console.log('🔄 Updating Light Bag product with new light_rainbow folder...');

    // Find the Light Bag product
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const lightBagProduct = products.data.find(p => p.name === 'Handbag - Multicolor (Light Bag)');
    
    if (!lightBagProduct) {
      console.log('❌ Light Bag product not found');
      return;
    }

    console.log(`📦 Found Light Bag product: ${lightBagProduct.id}`);

    // Update the product with new images and description
    const updatedProduct = await stripe.products.update(lightBagProduct.id, {
      name: 'Handbag - Light Rainbow',
      description: 'Handbag, acrylic, light rainbow: white, pink, green, blue, red, orange. Inner lining: white. Length: 22.5 inches, Width: 15 inches.',
      images: [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6124.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/IMG_6125.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6151.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6152.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6156.jpeg'
      ],
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
    });

    console.log('✅ Successfully updated Light Bag product to Light Rainbow');
    console.log(`📦 New product name: ${updatedProduct.name}`);
    console.log(`🖼️ Updated images: ${updatedProduct.images.length} images`);
    console.log(`🏷️ Updated metadata: ${updatedProduct.metadata.colors}`);

  } catch (error) {
    console.error('❌ Error updating Light Bag product:', error);
  }
}

updateLightBag(); 