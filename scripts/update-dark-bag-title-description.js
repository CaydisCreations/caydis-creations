const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product ID for the Dark Bag with Leaf Lining
const productId = 'prod_SmePkdpV8FocKE';

// New title and description
const newTitle = 'Dark Rainbow Handbag';
const newDescription = 'Inner Lining: Leaf Lining\nMulticolor: red, orange, pink, purple, green, blue';

async function updateDarkBagTitleDescription() {
  try {
    console.log('🔄 Updating "Handbag - Multicolor (Dark Bag, Leaf Lining)" title and description...\n');

    // Get the current product
    const product = await stripe.products.retrieve(productId);
    
    console.log(`📝 Updating product: ${product.name}`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Current title: ${product.name}`);
    console.log(`   New title: ${newTitle}`);
    console.log(`   Current description: ${product.description || 'None'}`);
    console.log(`   New description: ${newDescription}`);

    // Update the product with new title and description
    const updatedProduct = await stripe.products.update(productId, {
      name: newTitle,
      description: newDescription
    });

    console.log(`✅ Successfully updated product`);
    console.log(`   New title: ${updatedProduct.name}`);
    console.log(`   New description: ${updatedProduct.description}\n`);

    console.log('🎉 "Dark Rainbow Handbag" updated with new title and description!');
    console.log('\n📋 Summary:');
    console.log('   - Title changed to: "Dark Rainbow Handbag"');
    console.log('   - Description updated with two lines:');
    console.log('     • Inner Lining: Leaf Lining');
    console.log('     • Multicolor: red, orange, pink, purple, green, blue');
    console.log('   - Changes are live on your website');
    
  } catch (error) {
    console.error('❌ Error updating product title and description:', error);
  }
}

// Run the update
updateDarkBagTitleDescription();
