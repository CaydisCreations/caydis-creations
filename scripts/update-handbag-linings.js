const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product updates for handbag lining changes
const handbagLiningUpdates = {
  'Dark Rainbow Handbag': {
    newDescription: 'Inner Lining: Leaf\nMulticolor: red, orange, pink, purple, green, blue'
  },
  'Pink Handbag': {
    newDescription: 'Inner Lining: Flower\nMulticolor: pink, purple, red, orange'
  }
};

async function updateHandbagLinings() {
  try {
    console.log('🔄 Updating handbag lining descriptions...\n');

    // Get all products
    const products = await stripe.products.list({ limit: 100 });
    let updatedCount = 0;

    for (const product of products.data) {
      const updateInfo = handbagLiningUpdates[product.name];
      
      if (updateInfo) {
        console.log(`📝 Updating: ${product.name}`);
        console.log(`   Old: ${product.description}`);
        console.log(`   New: ${updateInfo.newDescription}`);
        
        await stripe.products.update(product.id, {
          description: updateInfo.newDescription
        });
        
        console.log(`   ✅ Updated successfully!\n`);
        updatedCount++;
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} handbag products!`);
    
    if (updatedCount === 0) {
      console.log('⚠️  No matching products found. Please check the product names.');
    }

  } catch (error) {
    console.error('❌ Error updating handbag linings:', error.message);
  }
}

updateHandbagLinings();
