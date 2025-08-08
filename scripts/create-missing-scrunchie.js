require('dotenv').config({ path: '../.env.local' });
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createMissingScrunchie() {
  console.log('🎀 Creating missing Scrunchie Set 4...\n');

  try {
    // Create the product
    const stripeProduct = await stripe.products.create({
      name: "Scrunchie Set 4",
      description: "Scrunchie, multicolor: [COLORS TO BE DETERMINED]",
      images: ['https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/5ebe3346-72ad-4750-8466-bd3ba14da425%20(1).jpeg'],
      metadata: {
        category: 'Accessories',
        tags: 'Scrunchies,Accessories,Hair',
        material: 'Acrylic',
        size: 'Standard',
        stock: '10',
        total_sold: '0'
      }
    });

    // Create the price
    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: 800, // $8.00 in cents
      currency: 'usd',
    });

    console.log(`✅ Created: Scrunchie Set 4`);
    console.log(`   Product ID: ${stripeProduct.id}`);
    console.log(`   Price ID: ${price.id}`);
    console.log(`   Price: $8.00\n`);

  } catch (error) {
    console.error(`❌ Error creating Scrunchie Set 4:`, error.message);
  }

  console.log('🎉 Finished creating missing scrunchie product!');
}

// Run the script
createMissingScrunchie().catch(console.error); 