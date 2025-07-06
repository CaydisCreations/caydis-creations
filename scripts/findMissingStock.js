require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function findMissingStock() {
  console.log('=== Finding Products Missing Stock Metadata ===\n');
  
  try {
    const products = await stripe.products.list({ active: true, limit: 100 });
    console.log(`Found ${products.data.length} active products\n`);
    
    const productsWithStock = [];
    const productsWithoutStock = [];
    
    for (const product of products.data) {
      const hasStock = product.metadata && product.metadata.stock;
      
      if (hasStock) {
        productsWithStock.push(product);
      } else {
        productsWithoutStock.push(product);
      }
    }
    
    console.log(`📦 Products WITH stock metadata: ${productsWithStock.length}`);
    for (const product of productsWithStock) {
      const stock = product.metadata.stock;
      const totalSold = product.metadata.total_sold || '0';
      console.log(`   ✅ ${product.name} (${product.id}) - Stock: ${stock}, Sold: ${totalSold}`);
    }
    
    console.log(`\n❌ Products WITHOUT stock metadata: ${productsWithoutStock.length}`);
    for (const product of productsWithoutStock) {
      console.log(`   ❌ ${product.name} (${product.id})`);
    }
    
    if (productsWithoutStock.length > 0) {
      console.log(`\n🔧 To fix this, run:`);
      console.log(`   node scripts/setStockForMissing.js`);
    }
    
  } catch (error) {
    console.error('Error finding missing stock:', error.message);
  }
}

async function setStockForMissing() {
  console.log('=== Setting Stock for Missing Products ===\n');
  
  try {
    const products = await stripe.products.list({ active: true, limit: 100 });
    let updatedCount = 0;
    
    for (const product of products.data) {
      const hasStock = product.metadata && product.metadata.stock;
      
      if (!hasStock) {
        try {
          await stripe.products.update(product.id, {
            metadata: { 
              ...product.metadata, 
              stock: '1',
              total_sold: '0'
            }
          });
          console.log(`✅ Set stock for ${product.name} (${product.id})`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Failed to update ${product.name}: ${error.message}`);
        }
      }
    }
    
    console.log(`\n🎉 Updated ${updatedCount} products with stock metadata`);
    
  } catch (error) {
    console.error('Error setting stock for missing products:', error.message);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'find':
      await findMissingStock();
      break;
      
    case 'fix':
      await setStockForMissing();
      break;
      
    default:
      console.log(`
🔍 Missing Stock Finder

Usage:
  node scripts/findMissingStock.js find    - Find products missing stock metadata
  node scripts/findMissingStock.js fix     - Set stock=1 for all products missing it

Examples:
  node scripts/findMissingStock.js find
  node scripts/findMissingStock.js fix
      `);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}); 