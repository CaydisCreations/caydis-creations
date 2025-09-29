const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product updates with new titles
const productUpdates = [
  {
    id: 'prod_SmePkdpV8FocKE',
    newName: 'Handbag - Multicolor (Dark Bag, Leaf Lining)',
    currentName: 'Handbag - Multicolor (Dark Bag)'
  },
  {
    id: 'prod_SlvC49ifPVmHzA', 
    newName: 'Handbag - Multicolor (Dark Bag, Solid Lining)',
    currentName: 'Handbag - Multicolor (Dark Bag)'
  }
];

async function updateBagTitles() {
  try {
    console.log('🔄 Updating bag product titles...\n');

    for (const update of productUpdates) {
      console.log(`📝 Updating product: ${update.currentName}`);
      console.log(`   Product ID: ${update.id}`);
      console.log(`   New title: ${update.newName}`);

      // Update the product name
      const updatedProduct = await stripe.products.update(update.id, {
        name: update.newName
      });

      console.log(`✅ Successfully updated to: ${updatedProduct.name}`);
      console.log(`   Product ID: ${updatedProduct.id}\n`);
    }

    console.log('🎉 Both bag products have been updated with new titles!');
    console.log('\n📋 Summary:');
    console.log('   - Product 1: "Handbag - Multicolor (Dark Bag, Leaf Lining)"');
    console.log('   - Product 2: "Handbag - Multicolor (Dark Bag, Solid Lining)"');
    console.log('   - Both products now have distinct titles');
    console.log('   - Changes are live on your website');
    
  } catch (error) {
    console.error('❌ Error updating product titles:', error);
  }
}

// Run the update
updateBagTitles();
