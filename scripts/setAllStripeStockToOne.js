require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function main() {
  const products = await stripe.products.list({ active: true, limit: 100 });
  for (const product of products.data) {
    await stripe.products.update(product.id, {
      metadata: { ...product.metadata, stock: '1' }
    });
    console.log(`Set stock to 1 for: ${product.name} (${product.id})`);
  }
  console.log('All products updated with stock = 1.');
}

main().catch(err => {
  console.error('Error updating stock:', err);
  process.exit(1);
}); 