const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product updates for scrunchies (remove "scrunchie" from descriptions)
const scrunchieUpdates = {
  'Scrunchie Set 1': {
    newDescription: 'Multicolor: green, gray, pink, black'
  },
  'Scrunchie Set 2': {
    newDescription: 'Multicolor: blue, purple, pink, white'
  },
  'Scrunchie Set 3': {
    newDescription: 'Multicolor: red, orange, yellow, green'
  },
  'Scrunchie Set 4': {
    newDescription: 'Multicolor: purple, blue, pink, white'
  },
  'Scrunchie Set 5': {
    newDescription: 'Multicolor: green, yellow, orange, red'
  },
  'Scrunchie Set 6': {
    newDescription: 'Multicolor: pink, purple, blue, white'
  },
  'Scrunchie Set 7': {
    newDescription: 'Multicolor: black, gray, white, beige'
  },
  'Scrunchie Set 8': {
    newDescription: 'Multicolor: rainbow colors'
  }
};

// Product updates for handbags
const handbagUpdates = {
  'Handbag - Multicolor (Pink Bag - Flowers Lining)': {
    newName: 'Pink Handbag',
    newDescription: 'Inner Lining: Leaf Lining\nMulticolor: pink, purple, red, orange'
  },
  'Handbag - Multicolor (Dark Bag, Solid Lining)': {
    newName: 'Dark Rainbow Handbag',
    newDescription: 'Inner Lining: Solid Green Lining\nMulticolor: red, orange, pink, purple, green, blue'
  }
};

async function updateScrunchieAndHandbagProducts() {
  try {
    console.log('🔄 Updating scrunchie and handbag products...\n');

    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    console.log(`📦 Found ${products.data.length} total products`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Update each product
    for (const product of products.data) {
      const scrunchieUpdate = scrunchieUpdates[product.name];
      const handbagUpdate = handbagUpdates[product.name];
      
      if (scrunchieUpdate) {
        console.log(`\n📦 Updating Scrunchie: ${product.name}`);
        console.log(`   New Description: ${scrunchieUpdate.newDescription}`);
        
        // Update the product description
        await stripe.products.update(product.id, {
          description: scrunchieUpdate.newDescription
        });

        console.log(`✅ Successfully updated: ${product.name}`);
        updatedCount++;
        
      } else if (handbagUpdate) {
        console.log(`\n📦 Updating Handbag: ${product.name}`);
        console.log(`   New Title: ${handbagUpdate.newName}`);
        console.log(`   New Description: ${handbagUpdate.newDescription}`);
        
        // Update the product name and description
        await stripe.products.update(product.id, {
          name: handbagUpdate.newName,
          description: handbagUpdate.newDescription
        });

        console.log(`✅ Successfully updated: ${handbagUpdate.newName}`);
        updatedCount++;
        
      } else {
        console.log(`⏭️ Skipping: ${product.name} (no update defined)`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Product updates completed!');
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

    console.log('\n📋 Summary of Changes:');
    console.log('\n🎀 Scrunchie Updates (removed "scrunchie" from descriptions):');
    console.log('   - Scrunchie Set 1: "Multicolor: green, gray, pink, black"');
    console.log('   - Scrunchie Set 2: "Multicolor: blue, purple, pink, white"');
    console.log('   - Scrunchie Set 3: "Multicolor: red, orange, yellow, green"');
    console.log('   - Scrunchie Set 4: "Multicolor: purple, blue, pink, white"');
    console.log('   - Scrunchie Set 5: "Multicolor: green, yellow, orange, red"');
    console.log('   - Scrunchie Set 6: "Multicolor: pink, purple, blue, white"');
    console.log('   - Scrunchie Set 7: "Multicolor: black, gray, white, beige"');
    console.log('   - Scrunchie Set 8: "Multicolor: rainbow colors"');
    
    console.log('\n👜 Handbag Updates:');
    console.log('   - Handbag - Multicolor (Pink Bag - Flowers Lining) → Pink Handbag');
    console.log('   - Handbag - Multicolor (Dark Bag, Solid Lining) → Dark Rainbow Handbag');
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

// Run the update
updateScrunchieAndHandbagProducts();
