require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function debugDownloadLabel() {
  try {
    console.log('🔍 Debugging download label issue...\n');

    // Get recent checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
      status: 'complete'
    });

    console.log(`📦 Found ${sessions.data.length} recent orders\n`);

    for (const session of sessions.data) {
      console.log(`📋 Order: ${session.id}`);
      console.log(`📅 Created: ${new Date(session.created * 1000).toLocaleString()}`);
      console.log(`💰 Amount: $${(session.amount_total / 100).toFixed(2)}`);
      
      if (session.metadata?.shipping_labels) {
        try {
          const shippingLabels = JSON.parse(session.metadata.shipping_labels);
          console.log(`📦 Shipping Labels (${shippingLabels.length}):`);
          shippingLabels.forEach((label, index) => {
            console.log(`  Label ${index + 1}:`);
            console.log(`    Product: ${label.p || 'Unknown'}`);
            console.log(`    Carrier: ${label.c || 'Unknown'}`);
            console.log(`    Tracking: ${label.t || 'None'}`);
            console.log(`    Transaction ID: ${label.u || 'None'}`);
            
            if (label.u) {
              console.log(`    Label URL: https://api.goshippo.com/transactions/${label.u}/label.pdf`);
            }
          });
        } catch (e) {
          console.log(`❌ Error parsing shipping labels: ${e.message}`);
        }
      } else {
        console.log('❌ No shipping labels found');
      }
      
      console.log('---\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugDownloadLabel(); 