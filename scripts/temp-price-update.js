require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateScrunchieSet8Price() {
  try {
    console.log('🎀 Temporarily updating Scrunchie Set 8 price to $0.50...\n');

    // Get all products
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    // Find Scrunchie Set 8
    const scrunchieSet8 = products.data.find(product => 
      product.name === 'Scrunchie Set 8'
    );

    if (!scrunchieSet8) {
      console.log('❌ Scrunchie Set 8 not found!');
      return;
    }

    console.log(`📦 Found: ${scrunchieSet8.name}`);
    console.log(`💰 Current price: $${scrunchieSet8.metadata?.current_price || 'unknown'}`);

    // Get the current price
    const prices = await stripe.prices.list({
      product: scrunchieSet8.id,
      active: true,
      limit: 1
    });

    if (prices.data.length === 0) {
      console.log('❌ No active price found for this product!');
      return;
    }

    const currentPrice = prices.data[0];
    console.log(`💰 Current Stripe price: $${(currentPrice.unit_amount / 100).toFixed(2)}`);

    // Create new price for $0.50
    const newPrice = await stripe.prices.create({
      product: scrunchieSet8.id,
      unit_amount: 50, // $0.50 in cents
      currency: 'usd',
    });

    // Deactivate the old price
    await stripe.prices.update(currentPrice.id, {
      active: false
    });

    // Update product metadata to remember the original price
    await stripe.products.update(scrunchieSet8.id, {
      metadata: {
        ...scrunchieSet8.metadata,
        original_price: '8.00',
        temp_price: '0.50',
        price_changed_at: new Date().toISOString()
      }
    });

    console.log(`✅ Updated Scrunchie Set 8 price to $0.50`);
    console.log(`💾 Original price ($8.00) saved in metadata for easy restoration`);
    console.log(`🆔 New price ID: ${newPrice.id}`);

  } catch (error) {
    console.error('❌ Error updating price:', error);
  }
}

updateScrunchieSet8Price();
