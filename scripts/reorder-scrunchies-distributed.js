require('dotenv').config({ path: '../.env.local' });
const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Scrunchie product IDs and their new positions
const scrunchiePositions = [
  {
    productId: 'prod_SpZCepFTAp96lq', // Scrunchie Set 1
    newPosition: 5 // 5th position
  },
  {
    productId: 'prod_SpZCfSj5geFenN', // Scrunchie Set 2
    newPosition: 8 // 8th position
  },
  {
    productId: 'prod_SpZCr7bvR2rxSN', // Scrunchie Set 3
    newPosition: 11 // 11th position
  },
  {
    productId: 'prod_SpZC30svC5RO6X', // Scrunchie Set 4
    newPosition: 14 // 14th position
  },
  {
    productId: 'prod_SpZCFwJYNFdLq8', // Scrunchie Set 5
    newPosition: 17 // 17th position
  },
  {
    productId: 'prod_SpZC24NwmnBwAM', // Scrunchie Set 6
    newPosition: 20 // 20th position
  },
  {
    productId: 'prod_SpZCgU8DYbwU7K', // Scrunchie Set 7
    newPosition: 23 // 23rd position
  },
  {
    productId: 'prod_SpZCDjhJs4zslC', // Scrunchie Set 8
    newPosition: 26 // 26th position
  }
];

async function reorderScrunchiesDistributed() {
  try {
    console.log('🎀 Reordering scrunchies to be distributed throughout the product catalog...\n');

    // First, get all products to understand current order
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    console.log(`📦 Found ${products.data.length} total products`);

    // Create a map of current positions for non-scrunchie products
    let currentPosition = 1;
    const nonScrunchieProducts = [];

    for (const product of products.data) {
      // Check if this is a scrunchie product
      const isScrunchie = scrunchiePositions.some(sp => sp.productId === product.id);
      
      if (!isScrunchie) {
        nonScrunchieProducts.push({
          productId: product.id,
          name: product.name,
          currentPosition: currentPosition
        });
        currentPosition++;
      }
    }

    console.log(`📋 Non-scrunchie products: ${nonScrunchieProducts.length}`);
    console.log(`🎀 Scrunchie products to reposition: ${scrunchiePositions.length}`);

    // Update scrunchie positions
    for (const scrunchie of scrunchiePositions) {
      console.log(`\n📝 Updating ${scrunchie.productId} to position ${scrunchie.newPosition}...`);
      
      try {
        const product = await stripe.products.retrieve(scrunchie.productId);
        
        // Update the product with new display order
        await stripe.products.update(scrunchie.productId, {
          metadata: {
            ...product.metadata,
            display_order: scrunchie.newPosition.toString()
          }
        });

        console.log(`✅ Updated scrunchie to position ${scrunchie.newPosition}`);
      } catch (error) {
        console.error(`❌ Error updating scrunchie ${scrunchie.productId}:`, error.message);
      }
    }

    // Update non-scrunchie products to fill gaps
    let nonScrunchiePosition = 1;
    for (const product of nonScrunchieProducts) {
      // Skip positions that are reserved for scrunchies
      while (scrunchiePositions.some(sp => sp.newPosition === nonScrunchiePosition)) {
        nonScrunchiePosition++;
      }

      console.log(`\n📝 Updating ${product.name} to position ${nonScrunchiePosition}...`);
      
      try {
        const stripeProduct = await stripe.products.retrieve(product.productId);
        
        // Update the product with new display order
        await stripe.products.update(product.productId, {
          metadata: {
            ...stripeProduct.metadata,
            display_order: nonScrunchiePosition.toString()
          }
        });

        console.log(`✅ Updated ${product.name} to position ${nonScrunchiePosition}`);
        nonScrunchiePosition++;
      } catch (error) {
        console.error(`❌ Error updating ${product.name}:`, error.message);
      }
    }

    console.log('\n🎉 Finished distributing scrunchies throughout the product catalog!');
    console.log('\n📋 New Product Order:');
    console.log('1. [Non-scrunchie product]');
    console.log('2. [Non-scrunchie product]');
    console.log('3. [Non-scrunchie product]');
    console.log('4. [Non-scrunchie product]');
    console.log('5. Scrunchie Set 1');
    console.log('6. [Non-scrunchie product]');
    console.log('7. [Non-scrunchie product]');
    console.log('8. Scrunchie Set 2');
    console.log('... and so on');

  } catch (error) {
    console.error('❌ Error reordering products:', error);
  }
}

// Run the script
reorderScrunchiesDistributed().catch(console.error); 