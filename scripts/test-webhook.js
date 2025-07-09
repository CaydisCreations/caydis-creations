// require('dotenv').config({ path: '.env.local' });
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// async function testWebhook() {
//   console.log('=== Testing Webhook Configuration ===\n');
  
//   try {
//     // 1. Check if we can connect to Stripe
//     console.log('1. Testing Stripe connection...');
//     const account = await stripe.accounts.retrieve();
//     console.log('✅ Stripe connection successful');
//     console.log('   Account ID:', account.id);
//     console.log('   Account name:', account.business_profile?.name || 'Not set');
    
//     // 2. List recent checkout sessions
//     console.log('\n2. Checking recent checkout sessions...');
//     const sessions = await stripe.checkout.sessions.list({ limit: 5 });
//     console.log(`✅ Found ${sessions.data.length} recent checkout sessions`);
    
//     if (sessions.data.length > 0) {
//       const latestSession = sessions.data[0];
//       console.log('   Latest session ID:', latestSession.id);
//       console.log('   Latest session status:', latestSession.status);
//       console.log('   Latest session payment status:', latestSession.payment_status);
      
//       if (latestSession.status === 'complete') {
//         console.log('\n3. Testing webhook processing for latest session...');
        
//         // Get line items for the latest session
//         const lineItems = await stripe.checkout.sessions.listLineItems(latestSession.id);
//         console.log(`   Found ${lineItems.data.length} line items`);
        
//         for (const item of lineItems.data) {
//           console.log(`   - ${item.description} (Qty: ${item.quantity})`);
          
//           if (item.price && item.price.product) {
//             const productId = typeof item.price.product === 'string' 
//               ? item.price.product 
//               : item.price.product.id;
            
//             console.log(`     Product ID: ${productId}`);
            
//             // Check current product metadata
//             try {
//               const product = await stripe.products.retrieve(productId);
//               const stock = product.metadata?.stock || 'Not set';
//               const totalSold = product.metadata?.total_sold || '0';
//               console.log(`     Current stock: ${stock}`);
//               console.log(`     Total sold: ${totalSold}`);
//             } catch (err) {
//               console.log(`     ❌ Error retrieving product: ${err.message}`);
//             }
//           }
//         }
//       } else {
//         console.log('   ⚠️  Latest session is not complete, cannot test webhook processing');
//       }
//     }
    
//     // 3. Check webhook endpoints
//     console.log('\n4. Checking webhook endpoints...');
//     const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
//     console.log(`✅ Found ${webhooks.data.length} webhook endpoints`);
    
//     for (const webhook of webhooks.data) {
//       console.log(`   - ${webhook.url} (${webhook.status})`);
//       console.log(`     Events: ${webhook.enabled_events.join(', ')}`);
      
//       if (webhook.status === 'enabled' && webhook.enabled_events.includes('checkout.session.completed')) {
//         console.log(`     ✅ This webhook should receive checkout.session.completed events`);
//       }
//     }
    
//   } catch (error) {
//     console.error('❌ Error during webhook test:', error.message);
//   }
// }

// async function simulateWebhook() {
//   console.log('\n=== Simulating Webhook Call ===\n');
  
//   try {
//     // Create a test webhook event
//     const testEvent = {
//       id: 'evt_test_' + Date.now(),
//       object: 'event',
//       api_version: '2023-10-16',
//       created: Math.floor(Date.now() / 1000),
//       data: {
//         object: {
//           id: 'cs_test_' + Date.now(),
//           object: 'checkout.session',
//           status: 'complete',
//           payment_status: 'paid',
//           customer_details: {
//             email: 'test@example.com',
//             name: 'Test Customer'
//           },
//           line_items: {
//             data: [
//               {
//                 id: 'li_test',
//                 object: 'item',
//                 amount_total: 1000,
//                 quantity: 1,
//                 description: 'Test Product',
//                 price: {
//                   id: 'price_test',
//                   object: 'price',
//                   product: 'prod_ScqwKOpJ10aUmA' // Use one of your actual product IDs
//                 }
//               }
//             ]
//           }
//         }
//       },
//       type: 'checkout.session.completed'
//     };
    
//     console.log('Test event created:', testEvent.id);
//     console.log('Event type:', testEvent.type);
//     console.log('Product ID:', testEvent.data.object.line_items.data[0].price.product);
    
//   } catch (error) {
//     console.error('❌ Error simulating webhook:', error.message);
//   }
// }

// // Command line interface
// async function main() {
//   const command = process.argv[2];
  
//   switch (command) {
//     case 'test':
//       await testWebhook();
//       break;
      
//     case 'simulate':
//       await simulateWebhook();
//       break;
      
//     default:
//       console.log(`
// 🔧 Webhook Testing Tool

// Usage:
//   node scripts/test-webhook.js test       - Test webhook configuration and recent sessions
//   node scripts/test-webhook.js simulate   - Simulate a webhook event (for testing)

// Examples:
//   node scripts/test-webhook.js test
//   node scripts/test-webhook.js simulate
//       `);
//   }
// }

// main().catch(err => {
//   console.error('Error:', err.message);
//   process.exit(1);
// }); 

// test-shippo.js
const { Shippo } = require('shippo');
const shippo = new Shippo({ apiKeyHeader: 'shippo_test_3c002179bdb808fcb740375f237517fbbe086f0b' });
console.log('shippo keys:', Object.keys(shippo));
console.log('shippo.shipments:', shippo.shipments);