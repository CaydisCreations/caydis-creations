require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Define your local product data here or load from another source if needed
const productsData = [
  // Example:
  // { name: 'Handbag - Beige/White Lining', price: 50 },
  // ...
];

async function main() {
  // Fetch all products from Stripe
  const stripeProducts = await stripe.products.list({ limit: 100, active: true });
  for (const stripeProduct of stripeProducts.data) {
    // Get all active prices for this product
    const prices = await stripe.prices.list({ product: stripeProduct.id, active: true, limit: 10 });
    for (const price of prices.data) {
      // Only update if price is less than $1 (i.e., needs decimal correction)
      if (price.unit_amount && price.unit_amount < 100) {
        const correctedAmount = price.unit_amount * 100;
        // Deactivate old price
        await stripe.prices.update(price.id, { active: false });
        // Create new price with corrected amount
        const newPrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: correctedAmount,
          currency: price.currency,
        });
        console.log(`Updated price for: ${stripeProduct.name} (Old: $${(price.unit_amount/100).toFixed(2)}, New: $${(correctedAmount/100).toFixed(2)})`);
      } else {
        console.log(`No update needed for: ${stripeProduct.name} (Current: $${(price.unit_amount/100).toFixed(2)})`);
      }
    }
  }
  console.log('All product prices processed.');
}

main().catch(err => {
  console.error('Error uploading products to Stripe:', err);
  process.exit(1);
}); 