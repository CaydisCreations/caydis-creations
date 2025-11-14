const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createAdultCardiganProduct() {
  try {
    console.log('🧶 Creating Adult Cardigan product...\n');

    // All images from the blue_long_sleeve folder
    const cardiganImages = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_long_sleeve/IMG_6755.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_long_sleeve/IMG_6757.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_long_sleeve/IMG_6759.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_long_sleeve/IMG_6760.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_long_sleeve/IMG_6766.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Cardigan/blue_long_sleeve/IMG_6767.jpeg'
    ];

    // Product details
    const productData = {
      name: "Adult Cardigan",
      description: "A nice stretchy cardigan for a nice night out",
      images: cardiganImages,
      metadata: {
        category: 'Wearables',
        tags: 'Cardigan,Clothing,Wearables,Baby Blue,Stretchy',
        material: 'Acrylic',
        color: 'Baby blue',
        size: 'Oversized XL or XXL',
        stock: '1',
        price_range: '$250-$350'
      }
    };

    console.log(`📦 Creating product: ${productData.name}`);
    console.log(`📝 Description: ${productData.description}`);
    console.log(`🎨 Color: ${productData.metadata.color}`);
    console.log(`📏 Size: ${productData.metadata.size}`);
    console.log(`💰 Price Range: ${productData.metadata.price_range}`);
    console.log(`🧵 Material: ${productData.metadata.material}`);
    console.log(`📦 Stock: ${productData.metadata.stock}`);
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
    console.log(`   Name: ${stripeProduct.name}\n`);

    // Create price - using $300 as the base price (middle of the range)
    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: 30000, // $300.00 in cents
      currency: 'usd',
    });

    console.log(`✅ Price created successfully!`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Amount: $${price.unit_amount / 100}`);
    console.log(`   Currency: ${price.currency}\n`);

    // Update product to set default price
    await stripe.products.update(stripeProduct.id, {
      default_price: price.id
    });

    console.log('🎉 Adult Cardigan product created successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Product: ${productData.name}`);
    console.log(`   - Price: $300 (range: ${productData.metadata.price_range})`);
    console.log(`   - Images: ${cardiganImages.length} images`);
    console.log(`   - Product ID: ${stripeProduct.id}`);
    console.log(`   - Price ID: ${price.id}`);
    
  } catch (error) {
    console.error('❌ Error creating Adult Cardigan product:', error.message);
  }
}

// Run the script
createAdultCardiganProduct();

