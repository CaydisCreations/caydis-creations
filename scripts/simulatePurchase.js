require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function simulatePurchase() {
  console.log('=== Simulating a Test Purchase ===\n');
  
  try {
    // Use one of your existing products
    const productId = 'prod_ScqwKOpJ10aUmA'; // Test Product
    
    console.log('1. Creating test checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product: productId,
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    
    console.log(`✅ Created checkout session: ${session.id}`);
    console.log(`   URL: ${session.url}`);
    
    console.log('\n2. Simulating successful payment...');
    
    // Simulate a successful payment by updating the session
    const updatedSession = await stripe.checkout.sessions.update(session.id, {
      payment_status: 'paid',
      status: 'complete',
    });
    
    console.log(`✅ Session marked as complete: ${updatedSession.id}`);
    console.log(`   Payment Status: ${updatedSession.payment_status}`);
    console.log(`   Session Status: ${updatedSession.status}`);
    
    console.log('\n3. Webhook should now be triggered automatically!');
    console.log('   Check your local server console for webhook logs.');
    
    console.log('\n4. After a few seconds, check stock levels:');
    console.log('   node scripts/manageStock.js list');
    
  } catch (error) {
    console.error('❌ Error simulating purchase:', error.message);
  }
}

async function checkProductStock(productId) {
  console.log(`\n=== Checking Stock for Product ${productId} ===\n`);
  
  try {
    const product = await stripe.products.retrieve(productId);
    console.log(`Product: ${product.name}`);
    console.log(`Stock: ${product.metadata?.stock || 'Not set'}`);
    console.log(`Total Sold: ${product.metadata?.total_sold || '0'}`);
    console.log(`Last Purchase: ${product.metadata?.last_purchase_date || 'Never'}`);
    
  } catch (error) {
    console.error('Error checking product stock:', error.message);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const productId = process.argv[3] || 'prod_ScqwKOpJ10aUmA';
  
  switch (command) {
    case 'simulate':
      await simulatePurchase();
      break;
      
    case 'check':
      await checkProductStock(productId);
      break;
      
    default:
      console.log(`
🧪 Local Purchase Simulator

Usage:
  node scripts/simulatePurchase.js simulate           - Simulate a test purchase
  node scripts/simulatePurchase.js check [productId]  - Check stock for a product

Examples:
  node scripts/simulatePurchase.js simulate
  node scripts/simulatePurchase.js check prod_ScqwKOpJ10aUmA

Note: Make sure your local server and Stripe webhook listener are running!
      `);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}); 