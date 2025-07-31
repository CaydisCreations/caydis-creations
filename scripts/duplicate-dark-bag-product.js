const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function duplicateDarkBagProduct() {
  try {
    console.log('🔄 Finding the original Handbag - Multicolor (Dark Bag) product...');
    
    // Get all active products
    const products = await stripe.products.list({ limit: 100, active: true });
    const darkBagProduct = products.data.find(p => p.name === 'Handbag - Multicolor (Dark Bag)');
    
    if (!darkBagProduct) {
      console.log('❌ Original Handbag - Multicolor (Dark Bag) product not found');
      return;
    }
    
    console.log(`✅ Found original product: ${darkBagProduct.id}`);
    console.log(`📦 Original product has ${darkBagProduct.images?.length || 0} images`);
    
    // Get the price for the original product
    const prices = await stripe.prices.list({ limit: 100, active: true });
    const originalPrice = prices.data.find(p => p.product === darkBagProduct.id);
    
    if (!originalPrice) {
      console.log('❌ Original product price not found');
      return;
    }
    
    console.log(`💰 Original price: $${originalPrice.unit_amount / 100}`);
    
    // Create the duplicate product
    console.log('🆕 Creating duplicate product...');
    const duplicateProduct = await stripe.products.create({
      name: 'Handbag - Multicolor (Dark Bag) - Duplicate',
      description: 'Handbag, acrylic, multicolor: white, pink, green, blue, red, orange. Inner lining: green leaf pattern. Length: 22.5 inches, Width: 15 inches.',
      images: darkBagProduct.images || [],
      metadata: {
        ...darkBagProduct.metadata,
        is_duplicate: 'true',
        original_product_id: darkBagProduct.id
      }
    });
    
    console.log(`✅ Created duplicate product: ${duplicateProduct.id}`);
    
    // Create price for the duplicate product
    const duplicatePrice = await stripe.prices.create({
      product: duplicateProduct.id,
      unit_amount: originalPrice.unit_amount,
      currency: originalPrice.currency,
      metadata: {
        ...originalPrice.metadata,
        is_duplicate: 'true',
        original_price_id: originalPrice.id
      }
    });
    
    console.log(`✅ Created duplicate price: ${duplicatePrice.id}`);
    
    console.log('\n🎉 Duplicate product created successfully!');
    console.log(`📦 Product ID: ${duplicateProduct.id}`);
    console.log(`💰 Price ID: ${duplicatePrice.id}`);
    console.log(`🖼️ Images: ${duplicateProduct.images?.length || 0} images copied`);
    console.log(`📝 Name: ${duplicateProduct.name}`);
    console.log(`💵 Price: $${duplicatePrice.unit_amount / 100}`);
    
  } catch (error) {
    console.error('❌ Error duplicating product:', error);
  }
}

duplicateDarkBagProduct(); 