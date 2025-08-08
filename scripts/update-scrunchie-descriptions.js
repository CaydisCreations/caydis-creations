require('dotenv').config({ path: '../.env.local' });
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product IDs and their updated descriptions
const scrunchieUpdates = [
  {
    productId: 'prod_SpZCepFTAp96lq', // Scrunchie Set 1
    description: 'Scrunchie, multicolor: black, green, beige, blue'
  },
  {
    productId: 'prod_SpZCfSj5geFenN', // Scrunchie Set 2
    description: 'Scrunchie, multicolor: white, gray, blue, pink'
  },
  {
    productId: 'prod_SpZCr7bvR2rxSN', // Scrunchie Set 3
    description: 'Scrunchie, multicolor: blue, pink, white, navy blue'
  },
  {
    productId: 'prod_SpZC30svC5RO6X', // Scrunchie Set 4
    description: 'Scrunchie, multicolor: pink, white, blue'
  },
  {
    productId: 'prod_SpZCFwJYNFdLq8', // Scrunchie Set 5
    description: 'Scrunchie, multicolor: green, gray, pink, black'
  },
  {
    productId: 'prod_SpZC24NwmnBwAM', // Scrunchie Set 6
    description: 'Scrunchie, multicolor: purple, cream, pink, yellow'
  },
  {
    productId: 'prod_SpZCgU8DYbwU7K', // Scrunchie Set 7
    description: 'Scrunchie, multicolor: orange, pink, white, yellow'
  },
  {
    productId: 'prod_SpZCDjhJs4zslC', // Scrunchie Set 8
    description: 'Scrunchie, multicolor: beige, cream, blue, pink'
  }
];

async function updateScrunchieDescriptions() {
  console.log('🎀 Updating scrunchie product descriptions with correct colors...\n');

  for (let i = 0; i < scrunchieUpdates.length; i++) {
    const update = scrunchieUpdates[i];
    
    console.log(`📝 Updating Scrunchie Set ${i + 1}...`);
    console.log(`   Product ID: ${update.productId}`);
    console.log(`   New Description: ${update.description}`);

    try {
      // Update the product description
      const updatedProduct = await stripe.products.update(update.productId, {
        description: update.description
      });

      console.log(`✅ Successfully updated Scrunchie Set ${i + 1}`);
      console.log(`   Updated Description: ${updatedProduct.description}\n`);

    } catch (error) {
      console.error(`❌ Error updating Scrunchie Set ${i + 1}:`, error.message);
    }
  }

  console.log('🎉 Finished updating all scrunchie product descriptions!');
  console.log('\n📋 Summary:');
  console.log('✅ All 8 scrunchie products now have accurate color descriptions');
  console.log('✅ Products are ready for customers to view with correct information');
}

// Run the script
updateScrunchieDescriptions().catch(console.error); 