require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function updateShoulderBagPrice() {
  try {
    console.log('🔧 Updating Shoulder Bag - Brown price to $30...\n');

    // First, find the product
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const shoulderBag = products.data.find(p => p.name === 'Shoulder Bag - Brown');
    
    if (!shoulderBag) {
      console.log('❌ Shoulder Bag - Brown not found');
      return;
    }

    console.log(`✅ Found product: ${shoulderBag.name} (ID: ${shoulderBag.id})`);

    // Get the current price
    const prices = await stripe.prices.list({
      product: shoulderBag.id,
      active: true
    });

    if (prices.data.length === 0) {
      console.log('❌ No active prices found for this product');
      return;
    }

    const currentPrice = prices.data[0];
    console.log(`📊 Current price: $${(currentPrice.unit_amount / 100).toFixed(2)}`);

    // Create new price at $30
    const newPrice = await stripe.prices.create({
      product: shoulderBag.id,
      unit_amount: 3000, // $30.00 in cents
      currency: 'usd',
      active: true
    });

    console.log(`✅ Created new price: $${(newPrice.unit_amount / 100).toFixed(2)} (ID: ${newPrice.id})`);

    // Deactivate the old price
    await stripe.prices.update(currentPrice.id, {
      active: false
    });

    console.log(`✅ Deactivated old price: ${currentPrice.id}`);

    console.log('\n🎉 Shoulder Bag - Brown price successfully updated to $30!');

  } catch (error) {
    console.error('❌ Error updating price:', error.message);
  }
}

// Run the script
updateShoulderBagPrice(); 