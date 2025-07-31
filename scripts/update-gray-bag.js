const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateGrayBag() {
  try {
    console.log('🔄 Updating gray bag product to light brown...');

    // Find the gray bag product
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const grayBagProduct = products.data.find(p => p.name === 'Handbag - Gray');
    
    if (!grayBagProduct) {
      console.log('❌ Gray bag product not found');
      return;
    }

    console.log(`📦 Found gray bag product: ${grayBagProduct.id}`);

    // Update the product with new name, description, and images
    const updatedProduct = await stripe.products.update(grayBagProduct.id, {
      name: 'Handbag - Light Brown',
      description: 'Handbag, acrylic, light brown. Length: 22 inches, Width: 15.5 inches.',
      images: [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6141.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6143.jpeg'
      ],
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
    });

    console.log('✅ Successfully updated gray bag product to light brown');
    console.log(`📦 New product name: ${updatedProduct.name}`);
    console.log(`🖼️ Updated images: ${updatedProduct.images.length} images`);
    console.log(`🏷️ Updated metadata: ${updatedProduct.metadata.colors}`);

  } catch (error) {
    console.error('❌ Error updating gray bag product:', error);
  }
}

updateGrayBag(); 