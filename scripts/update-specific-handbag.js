const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateSpecificHandbag() {
  try {
    const productId = 'prod_SlvC49ifPVmHzA';
    
    console.log('🔄 Updating specific handbag product...\n');
    console.log(`Product ID: ${productId}`);

    // Get the current product
    const product = await stripe.products.retrieve(productId);
    
    console.log(`Current product: ${product.name}`);
    console.log(`Current description: ${product.description}`);
    
    // Update the description - change "Leaf" to "Solid Green"
    const newDescription = product.description.replace('Inner Lining: Leaf', 'Inner Lining: Solid Green');
    
    console.log(`New description: ${newDescription}`);
    
    // Update the product
    const updatedProduct = await stripe.products.update(productId, {
      description: newDescription
    });
    
    console.log('\n✅ Product updated successfully!');
    console.log(`Updated description: ${updatedProduct.description}`);

  } catch (error) {
    console.error('❌ Error updating product:', error.message);
  }
}

updateSpecificHandbag();
