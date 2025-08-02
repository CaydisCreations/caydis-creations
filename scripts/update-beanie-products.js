const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateBeanieProducts() {
  try {
    const updates = [
      {
        id: 'prod_Sl3xhipQ5ZFILY',
        name: 'Beanie - Blue with Strands of White',
        description: 'Acrylic beanie, blue with strands of white. Length: 10 inches, Width: 11 inches.',
        metadata: {
          price: '30',
          stock: '1',
          length: '10 inches',
          width: '11 inches'
        }
      },
      {
        id: 'prod_Sl3xzq4JFPPuxp',
        name: 'Beanie - Multi-color (Blue, White, Green, Beige)',
        description: 'Acrylic beanie, multi-color: blue, white, green, beige. Length: 9.5 inches, Width: 11.5 inches.',
        metadata: {
          price: '30',
          stock: '1',
          length: '9.5 inches',
          width: '11.5 inches'
        }
      },
      {
        id: 'prod_Sl3xvGKEVx8u1O',
        name: 'Beanie - Multi-color (Pink, Orange, Yellow, Blue)',
        description: 'Acrylic beanie, multi-color: pink, orange, yellow, blue. Length: 9.5 inches, Width: 12 inches.',
        metadata: {
          price: '30',
          stock: '1',
          length: '9.5 inches',
          width: '12 inches'
        }
      }
    ];

    console.log('🔄 Updating beanie products...\n');

    for (const update of updates) {
      try {
        // Get current product
        const product = await stripe.products.retrieve(update.id);
        console.log(`📦 Updating: ${product.name} (${update.id})`);
        
        // Update the product
        await stripe.products.update(update.id, {
          name: update.name,
          description: update.description,
          metadata: update.metadata
        });
        
        console.log(`✅ Updated to: ${update.name}`);
        console.log(`📝 Description: ${update.description}`);
        console.log(`💰 Price: $${update.metadata.price}`);
        console.log(`📏 Dimensions: ${update.metadata.length} x ${update.metadata.width}`);
        console.log('');
        
      } catch (error) {
        console.error(`❌ Error updating ${update.id}:`, error.message);
      }
    }

    console.log('✅ Beanie product updates completed!');
    
    // Show updated products
    console.log('\n📋 Updated beanie products:');
    for (const update of updates) {
      const product = await stripe.products.retrieve(update.id);
      console.log(`  - ${product.name} (${product.id})`);
      console.log(`    Price: $${product.metadata?.price || 'N/A'}`);
      console.log(`    Stock: ${product.metadata?.stock || 'N/A'}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error updating beanie products:', error);
  }
}

updateBeanieProducts(); 