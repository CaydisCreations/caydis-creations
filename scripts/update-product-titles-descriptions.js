const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product updates with new titles and descriptions
const productUpdates = {
  'Scarf - White': {
    newName: 'White Scarf',
    newDescription: 'White',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Shoulder Bag - Brown': {
    newName: 'Brown Shoulder Bag',
    newDescription: 'Brown',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Beanie - Blue with Strands of White': {
    newName: 'Blue Beanie',
    newDescription: 'Blue with strands of white',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Beanie - Multi-color (Blue, White, Green, Beige)': {
    newName: 'Multi-color Beanie',
    newDescription: 'Multicolor: blue, white, green, beige',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Beanie - Multi-color (Pink, Orange, Yellow, Blue)': {
    newName: 'Multi-color Pink Beanie',
    newDescription: 'Multicolor: pink, orange, yellow, blue',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Scarf - Green': {
    newName: 'Green Scarf',
    newDescription: 'Light weight scarf',
    newMetadata: {
      material: '70% alpaca 30% Nylon'
    }
  },
  'Handbag - Multicolor (Light Bag)': {
    newName: 'Light Rainbow Handbag',
    newDescription: 'Inner Lining: Solid White\nMulticolor: white, pink, green, blue, red, orange',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Handbag - Multicolor (Pink Bag - Solid Pink Lining)': {
    newName: 'Pink Handbag',
    newDescription: 'Inner Lining: Solid Pink\nMulticolor: pink, purple, red, orange',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Handbag - Beige/White Lining': {
    newName: 'Beige Handbag',
    newDescription: 'Inner Lining: Solid White\nColor: Beige',
    newMetadata: {
      material: 'Acrylic'
    }
  },
  'Scarf - Green, White': {
    newName: 'Green And White Scarf',
    newDescription: 'Multicolor Scarf',
    newMetadata: {
      material: 'Acrylic'
    }
  }
};

async function updateProductTitlesDescriptions() {
  try {
    console.log('🔄 Updating product titles and descriptions...\n');

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
      const update = productUpdates[product.name];
      
      if (update) {
        console.log(`\n📦 Updating: ${product.name}`);
        console.log(`   New Title: ${update.newName}`);
        console.log(`   New Description: ${update.newDescription}`);
        console.log(`   New Material: ${update.newMetadata.material}`);
        
        // Prepare metadata update
        const metadataUpdate = {
          ...product.metadata,
          ...update.newMetadata
        };

        // Update the product
        await stripe.products.update(product.id, {
          name: update.newName,
          description: update.newDescription,
          metadata: metadataUpdate
        });

        console.log(`✅ Successfully updated: ${update.newName}`);
        
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
    console.log('   - Scarf - White → White Scarf');
    console.log('   - Shoulder Bag - Brown → Brown Shoulder Bag');
    console.log('   - Beanie - Blue with Strands of White → Blue Beanie');
    console.log('   - Beanie - Multi-color (Blue, White, Green, Beige) → Multi-color Beanie');
    console.log('   - Beanie - Multi-color (Pink, Orange, Yellow, Blue) → Multi-color Pink Beanie');
    console.log('   - Scarf - Green → Green Scarf (with new material info)');
    console.log('   - Handbag - Multicolor (Light Bag) → Light Rainbow Handbag');
    console.log('   - Handbag - Multicolor (Pink Bag - Solid Pink Lining) → Pink Handbag');
    console.log('   - Handbag - Beige/White Lining → Beige Handbag');
    console.log('   - Scarf - Green, White → Green And White Scarf');
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

// Run the update
updateProductTitlesDescriptions();
