const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createBabyCardigansProducts() {
  try {
    console.log('🧶 Creating Baby Cardigan products...\n');

    // Toddler Cardigan images (4 images from the folder)
    const toddlerCardiganImages = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/Toddler_Cardigan_light_blue/IMG_6748.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/Toddler_Cardigan_light_blue/IMG_6749.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/Toddler_Cardigan_light_blue/IMG_6752.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/Toddler_Cardigan_light_blue/IMG_6771.jpeg'
    ];

    // Baby Cardigan images (4 images from the folder)
    const babyCardiganImages = [
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/baby_cardigan_light_blue/IMG_6742.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/baby_cardigan_light_blue/IMG_6743.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/baby_cardigan_light_blue/IMG_6745.jpeg',
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/baby/baby_cardigan_light_blue/IMG_6773.jpeg'
    ];

    // Create Toddler Cardigan Product
    console.log('📦 Creating Toddler Cardigan product...');
    const toddlerProductData = {
      name: "Toddler Cardigan",
      description: "A beautiful baby blue cardigan perfect for toddlers",
      images: toddlerCardiganImages,
      metadata: {
        category: 'Baby Clothes',
        tags: 'Cardigan,Baby Clothes,Clothing,Baby Blue,Toddler',
        material: 'Acrylic',
        color: 'Baby blue',
        size: '18M-2T or 12-18 months old',
        stock: '1'
      }
    };

    console.log(`   Name: ${toddlerProductData.name}`);
    console.log(`   Price: $70`);
    console.log(`   Size: ${toddlerProductData.metadata.size}`);
    console.log(`   Images: ${toddlerProductData.images.length} images\n`);

    const toddlerProduct = await stripe.products.create({
      name: toddlerProductData.name,
      description: toddlerProductData.description,
      images: toddlerProductData.images,
      metadata: toddlerProductData.metadata
    });

    const toddlerPrice = await stripe.prices.create({
      product: toddlerProduct.id,
      unit_amount: 7000, // $70.00 in cents
      currency: 'usd',
    });

    await stripe.products.update(toddlerProduct.id, {
      default_price: toddlerPrice.id
    });

    console.log(`✅ Toddler Cardigan created!`);
    console.log(`   Product ID: ${toddlerProduct.id}`);
    console.log(`   Price ID: ${toddlerPrice.id}\n`);

    // Create Baby Cardigan Product
    console.log('📦 Creating Baby Cardigan product...');
    const babyProductData = {
      name: "Baby Cardigan",
      description: "A beautiful baby blue cardigan perfect for babies",
      images: babyCardiganImages,
      metadata: {
        category: 'Baby Clothes',
        tags: 'Cardigan,Baby Clothes,Clothing,Baby Blue,Baby',
        material: 'Acrylic',
        color: 'Baby blue',
        size: '3-6 months old',
        stock: '1'
      }
    };

    console.log(`   Name: ${babyProductData.name}`);
    console.log(`   Price: $50`);
    console.log(`   Size: ${babyProductData.metadata.size}`);
    console.log(`   Images: ${babyProductData.images.length} images\n`);

    const babyProduct = await stripe.products.create({
      name: babyProductData.name,
      description: babyProductData.description,
      images: babyProductData.images,
      metadata: babyProductData.metadata
    });

    const babyPrice = await stripe.prices.create({
      product: babyProduct.id,
      unit_amount: 5000, // $50.00 in cents
      currency: 'usd',
    });

    await stripe.products.update(babyProduct.id, {
      default_price: babyPrice.id
    });

    console.log(`✅ Baby Cardigan created!`);
    console.log(`   Product ID: ${babyProduct.id}`);
    console.log(`   Price ID: ${babyPrice.id}\n`);

    console.log('🎉 Baby Cardigan products creation completed!');
    
  } catch (error) {
    console.error('❌ Error creating baby cardigan products:', error.message);
  }
}

// Run the script
createBabyCardigansProducts();

