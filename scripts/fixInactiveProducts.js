require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function fixInactiveProducts() {
  console.log('=== Fixing Inactive Products ===\n');
  
  try {
    // Get all products including inactive ones
    const allProducts = await stripe.products.list({ limit: 100 });
    const inactiveProducts = allProducts.data.filter(p => !p.active);
    
    console.log(`Found ${inactiveProducts.length} inactive products\n`);
    
    for (const product of inactiveProducts) {
      try {
        // Activate the product and set stock metadata
        const updatedProduct = await stripe.products.update(product.id, {
          active: true,
          metadata: { 
            ...product.metadata, 
            stock: '1',
            total_sold: '0'
          }
        });
        
        console.log(`✅ Activated and set stock for: ${product.name} (${product.id})`);
        
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Fixed ${inactiveProducts.length} inactive products`);
    
  } catch (error) {
    console.error('Error fixing inactive products:', error.message);
  }
}

async function listInactiveProducts() {
  console.log('=== Listing Inactive Products ===\n');
  
  try {
    const allProducts = await stripe.products.list({ limit: 100 });
    const inactiveProducts = allProducts.data.filter(p => !p.active);
    
    console.log(`Found ${inactiveProducts.length} inactive products:\n`);
    
    for (const product of inactiveProducts) {
      console.log(`❌ ${product.name} (${product.id})`);
      console.log(`   Created: ${new Date(product.created * 1000).toISOString()}`);
      console.log(`   Stock: ${product.metadata?.stock || 'Not set'}`);
      console.log(`   Total Sold: ${product.metadata?.total_sold || '0'}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('Error listing inactive products:', error.message);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'list':
      await listInactiveProducts();
      break;
      
    case 'fix':
      await fixInactiveProducts();
      break;
      
    default:
      console.log(`
🔧 Inactive Product Fixer

Usage:
  node scripts/fixInactiveProducts.js list    - List all inactive products
  node scripts/fixInactiveProducts.js fix     - Activate all inactive products and set stock=1

Examples:
  node scripts/fixInactiveProducts.js list
  node scripts/fixInactiveProducts.js fix
      `);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}); 