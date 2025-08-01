const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateHandbagToShoulderBag() {
  try {
    console.log('🔄 Updating Handbag - Light Brown to Shoulder Bag - Brown details...');

    // Find the Handbag - Light Brown product
    const products = await stripe.products.list({ limit: 100, active: true });
    const handbagProduct = products.data.find(p => p.name === 'Handbag - Light Brown');
    
    if (!handbagProduct) {
      console.error('❌ Handbag - Light Brown product not found');
      return;
    }

    console.log(`📦 Found product: ${handbagProduct.name} (${handbagProduct.id})`);

    // Update the product with Shoulder Bag details
    const updatedProduct = await stripe.products.update(handbagProduct.id, {
      name: 'Shoulder Bag - Brown',
      description: 'Shoulder bag, acrylic, brown. Length: 21 inches, Width: 10 inches.',
      metadata: {
        category: 'Bags',
        colors: 'Brown',
        dimensions: '{"length":"21 inches","width":"10 inches"}',
        local_id: '6',
        material: 'Acrylic',
        parcel_height: '2',
        parcel_length: '13',
        parcel_weight_oz: '12.8',
        parcel_width: '8',
        stock: '1',
        tags: 'bag'
      }
    });

    console.log('✅ Product updated successfully!');
    console.log(`📝 New name: ${updatedProduct.name}`);
    console.log(`📝 New description: ${updatedProduct.description}`);
    console.log(`📝 New metadata:`, updatedProduct.metadata);

    // Find and update the price to $30
    const prices = await stripe.prices.list({ 
      product: handbagProduct.id,
      active: true 
    });

    if (prices.data.length > 0) {
      const price = prices.data[0];
      console.log(`💰 Current price: $${price.unit_amount / 100}`);
      
      // Create new price with $30
      const newPrice = await stripe.prices.create({
        product: handbagProduct.id,
        unit_amount: 3000, // $30.00 in cents
        currency: 'usd',
        metadata: {
          ...price.metadata,
          updated_from: price.id
        }
      });

      console.log(`💰 New price created: $${newPrice.unit_amount / 100}`);
      
      // Deactivate the old price
      await stripe.prices.update(price.id, { active: false });
      console.log('✅ Old price deactivated');
    }

    console.log('\n🎉 Successfully updated Handbag - Light Brown to Shoulder Bag - Brown!');
    console.log('📋 Summary of changes:');
    console.log('   - Name: Handbag - Light Brown → Shoulder Bag - Brown');
    console.log('   - Description: Updated to shoulder bag details');
    console.log('   - Price: $50 → $30');
    console.log('   - Dimensions: 22" x 15.5" → 21" x 10"');
    console.log('   - Metadata: Updated to match shoulder bag');

  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
}

updateHandbagToShoulderBag(); 