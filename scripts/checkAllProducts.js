require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function checkAllProducts() {
  console.log('=== Checking ALL Products (Active + Inactive) ===\n');
  
  try {
    // Get all products (active and inactive)
    const allProducts = await stripe.products.list({ limit: 100 });
    console.log(`Found ${allProducts.data.length} total products\n`);
    
    const activeProducts = [];
    const inactiveProducts = [];
    
    for (const product of allProducts.data) {
      if (product.active) {
        activeProducts.push(product);
      } else {
        inactiveProducts.push(product);
      }
    }
    
    console.log(`📦 Active Products: ${activeProducts.length}`);
    for (const product of activeProducts) {
      const stock = product.metadata?.stock || 'Not set';
      const totalSold = product.metadata?.total_sold || '0';
      console.log(`   ✅ ${product.name} (${product.id}) - Stock: ${stock}, Sold: ${totalSold}`);
    }
    
    console.log(`\n❌ Inactive Products: ${inactiveProducts.length}`);
    for (const product of inactiveProducts) {
      const stock = product.metadata?.stock || 'Not set';
      const totalSold = product.metadata?.total_sold || '0';
      console.log(`   ❌ ${product.name} (${product.id}) - Stock: ${stock}, Sold: ${totalSold}`);
    }
    
    // Look for the specific product from the test purchase
    console.log(`\n🔍 Looking for product: prod_ScwFwPVR8Kdu70`);
    const targetProduct = allProducts.data.find(p => p.id === 'prod_ScwFwPVR8Kdu70');
    
    if (targetProduct) {
      console.log(`   Found: ${targetProduct.name} (${targetProduct.id})`);
      console.log(`   Active: ${targetProduct.active ? 'Yes' : 'No'}`);
      console.log(`   Stock: ${targetProduct.metadata?.stock || 'Not set'}`);
      console.log(`   Total Sold: ${targetProduct.metadata?.total_sold || '0'}`);
    } else {
      console.log(`   ❌ Product not found in any list`);
    }
    
  } catch (error) {
    console.error('Error checking all products:', error.message);
  }
}

async function checkRecentSessions() {
  console.log('\n=== Checking Recent Checkout Sessions ===\n');
  
  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 10 });
    console.log(`Found ${sessions.data.length} recent sessions\n`);
    
    for (const session of sessions.data) {
      console.log(`Session: ${session.id}`);
      console.log(`  Status: ${session.status}`);
      console.log(`  Payment Status: ${session.payment_status}`);
      console.log(`  Created: ${new Date(session.created * 1000).toISOString()}`);
      
      if (session.status === 'complete') {
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          console.log(`  Line Items: ${lineItems.data.length}`);
          
          for (const item of lineItems.data) {
            console.log(`    - ${item.description} (Qty: ${item.quantity})`);
            
            if (item.price && item.price.product) {
              const productId = typeof item.price.product === 'string' 
                ? item.price.product 
                : item.price.product.id;
              
              console.log(`      Product ID: ${productId}`);
              
              // Try to retrieve the product
              try {
                const product = await stripe.products.retrieve(productId);
                console.log(`      Product Name: ${product.name}`);
                console.log(`      Product Active: ${product.active}`);
                console.log(`      Stock: ${product.metadata?.stock || 'Not set'}`);
              } catch (err) {
                console.log(`      ❌ Error retrieving product: ${err.message}`);
              }
            }
          }
        } catch (err) {
          console.log(`  ❌ Error getting line items: ${err.message}`);
        }
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Error checking recent sessions:', error.message);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'products':
      await checkAllProducts();
      break;
      
    case 'sessions':
      await checkRecentSessions();
      break;
      
    case 'all':
      await checkAllProducts();
      await checkRecentSessions();
      break;
      
    default:
      console.log(`
🔍 Product and Session Checker

Usage:
  node scripts/checkAllProducts.js products   - Check all products (active + inactive)
  node scripts/checkAllProducts.js sessions   - Check recent checkout sessions
  node scripts/checkAllProducts.js all        - Check both products and sessions

Examples:
  node scripts/checkAllProducts.js all
      `);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}); 