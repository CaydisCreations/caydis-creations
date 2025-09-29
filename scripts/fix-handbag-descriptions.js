const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product updates to fix handbag descriptions with proper line breaks
const handbagDescriptionFixes = {
  'Dark Rainbow Handbag': {
    newDescription: 'Inner Lining: Solid Green Lining\nMulticolor: red, orange, pink, purple, green, blue'
  },
  'Pink Handbag': {
    newDescription: 'Inner Lining: Leaf Lining\nMulticolor: pink, purple, red, orange'
  },
  'Light Rainbow Handbag': {
    newDescription: 'Inner Lining: Solid White\nMulticolor: white, pink, green, blue, red, orange'
  },
  'Beige Handbag': {
    newDescription: 'Inner Lining: Solid White\nColor: Beige'
  }
};

async function fixHandbagDescriptions() {
  try {
    console.log('🔄 Fixing handbag descriptions with proper line breaks...\n');

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
      const fix = handbagDescriptionFixes[product.name];
      
      if (fix) {
        console.log(`\n📦 Fixing Handbag: ${product.name}`);
        console.log(`   Current Description: ${product.description}`);
        console.log(`   New Description: ${fix.newDescription}`);
        
        // Update the product description
        await stripe.products.update(product.id, {
          description: fix.newDescription
        });

        console.log(`✅ Successfully updated: ${product.name}`);
        updatedCount++;
        
      } else {
        console.log(`⏭️ Skipping: ${product.name} (no fix needed)`);
        skippedCount++;
      }
    }

    console.log('\n🎉 Handbag description fixes completed!');
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products`);

    console.log('\n📋 Summary of Fixed Descriptions:');
    console.log('   - Dark Rainbow Handbag: "Inner Lining: Solid Green Lining\\nMulticolor: red, orange, pink, purple, green, blue"');
    console.log('   - Pink Handbag: "Inner Lining: Leaf Lining\\nMulticolor: pink, purple, red, orange"');
    console.log('   - Light Rainbow Handbag: "Inner Lining: Solid White\\nMulticolor: white, pink, green, blue, red, orange"');
    console.log('   - Beige Handbag: "Inner Lining: Solid White\\nColor: Beige"');
    
  } catch (error) {
    console.error('❌ Error fixing handbag descriptions:', error);
  }
}

// Run the fix
fixHandbagDescriptions();
