const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updatePinkHandbagLining() {
  try {
    const productId = 'prod_ScqwTo3jjqx8Kc';
    
    console.log('🔄 Updating Pink Handbag lining...\n');
    console.log(`Product ID: ${productId}`);

    // Get the current product
    const product = await stripe.products.retrieve(productId);
    
    console.log(`Current product: ${product.name}`);
    console.log(`Current description: ${product.description}`);
    
    // Update the description - change "Flower" to "Solid Pink"
    const newDescription = product.description.replace('Inner Lining: Flower', 'Inner Lining: Solid Pink');
    
    console.log(`New description: ${newDescription}`);
    
    // Update the product
    const updatedProduct = await stripe.products.update(productId, {
      description: newDescription
    });
    
    console.log('\n✅ Pink Handbag updated successfully!');
    console.log(`Updated description: ${updatedProduct.description}`);

  } catch (error) {
    console.error('❌ Error updating Pink Handbag:', error.message);
  }
}

updatePinkHandbagLining();
