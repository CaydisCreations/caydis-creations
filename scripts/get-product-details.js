require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function getProductDetails() {
  try {
    console.log('🔍 Getting detailed product information...\n');

    // Get all active products
    const products = await stripe.products.list({ active: true, limit: 100 });
    
    // Filter for bags and beanies
    const bags = products.data.filter(p => 
      p.name.toLowerCase().includes('bag') || 
      p.name.toLowerCase().includes('handbag') || 
      p.name.toLowerCase().includes('shoulder')
    );
    
    const beanies = products.data.filter(p => 
      p.name.toLowerCase().includes('beanie')
    );

    console.log('👜 BAG PRODUCTS:');
    console.log('================');
    bags.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Description: ${product.description || 'No description'}`);
      console.log(`   Metadata:`, product.metadata);
      console.log(`   Images: ${product.images?.length || 0} images`);
      if (product.images && product.images.length > 0) {
        console.log(`   Current Images: ${product.images.join(', ')}`);
      }
      console.log('');
    });

    console.log('🧢 BEANIE PRODUCTS:');
    console.log('===================');
    beanies.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Description: ${product.description || 'No description'}`);
      console.log(`   Metadata:`, product.metadata);
      console.log(`   Images: ${product.images?.length || 0} images`);
      if (product.images && product.images.length > 0) {
        console.log(`   Current Images: ${product.images.join(', ')}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getProductDetails(); 