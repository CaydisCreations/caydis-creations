const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createNeckPillowProduct() {
  try {
    console.log('🛏️ Creating Packable Travel Neck Pillow product...\n');

    // Product details
    const productData = {
      name: "Packable Travel Neck Pillow",
      description: "Use your clothes as the filling for the pillow. It can fit around 4-8 pieces of clothing depending on size!",
      price: 75.00, // $75.00
      images: [
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/TravelPillows/NeckPillow_tan_brown_orange_red/IMG_6637.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/TravelPillows/NeckPillow_tan_brown_orange_red/IMG_6638.jpeg',
        'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/TravelPillows/NeckPillow_tan_brown_orange_red/IMG_6640.jpeg'
      ],
      metadata: {
        category: 'Travel Pillows',
        tags: 'Travel Pillows,Accessories,Comfort,Travel',
        material: 'Polyester',
        color: 'Multi-color: red, orange, brown, tan',
        stock: '5',
        total_sold: '0',
        // Parcel dimensions for shipping
        parcel_length: '12',      // 12 inches
        parcel_width: '8',        // 8 inches  
        parcel_height: '4',        // 4 inches
        parcel_weight_oz: '8'      // 8 ounces
      }
    };

    console.log(`📦 Creating product: ${productData.name}`);
    console.log(`💰 Price: $${productData.price}`);
    console.log(`📝 Description: ${productData.description}`);
    console.log(`🎨 Color: ${productData.metadata.color}`);
    console.log(`🧵 Material: ${productData.metadata.material}`);
    console.log(`📦 Stock: ${productData.metadata.stock}`);
    console.log(`📏 Dimensions: ${productData.metadata.parcel_length}" x ${productData.metadata.parcel_width}" x ${productData.metadata.parcel_height}", ${productData.metadata.parcel_weight_oz} oz`);
    console.log(`🖼️ Images: ${productData.images.length} images\n`);

    // Create the product
    const stripeProduct = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      images: productData.images,
      metadata: productData.metadata
    });

    console.log(`✅ Product created successfully!`);
    console.log(`   Product ID: ${stripeProduct.id}`);

    // Create the price
    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(productData.price * 100), // Convert to cents
      currency: 'usd',
    });

    console.log(`✅ Price created successfully!`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Price: $${productData.price}\n`);

    console.log('🎉 Packable Travel Neck Pillow product created successfully!');
    console.log('\n📋 Product Details:');
    console.log(`   Name: ${productData.name}`);
    console.log(`   Description: ${productData.description}`);
    console.log(`   Price: $${productData.price}`);
    console.log(`   Material: ${productData.metadata.material}`);
    console.log(`   Color: ${productData.metadata.color}`);
    console.log(`   Stock: ${productData.metadata.stock}`);
    console.log(`   Category: ${productData.metadata.category}`);
    console.log(`   Product ID: ${stripeProduct.id}`);
    console.log(`   Price ID: ${price.id}`);

    console.log('\n🚀 The product should now appear on your frontend product page!');

  } catch (error) {
    console.error('❌ Error creating neck pillow product:', error.message);
    console.error('Full error:', error);
  }
}

// Run the script
createNeckPillowProduct().catch(console.error);
