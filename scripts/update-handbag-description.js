require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function updateHandbagDescription() {
  try {
    console.log('🔧 Updating Handbag - Multi-color (Pink, Purple, Red, Orange) description...\n');

    const productId = 'prod_ScqwTo3jjqx8Kc';
    
    // Update the product description
    const updatedProduct = await stripe.products.update(productId, {
      description: 'Handbag, acrylic, multi-color: pink, purple, red, orange. Inner lining: solid pink. Length: 22 inches, Width: 15.5 inches.'
    });

    console.log('✅ Product updated successfully!');
    console.log(`📦 Name: ${updatedProduct.name}`);
    console.log(`📝 New Description: ${updatedProduct.description}`);
    console.log(`🆔 ID: ${updatedProduct.id}`);

    console.log('\n🎉 Handbag description has been updated to match your specifications!');

  } catch (error) {
    console.error('❌ Error updating product:', error.message);
  }
}

updateHandbagDescription(); 