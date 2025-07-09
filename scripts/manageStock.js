require('dotenv').config({ path: '.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function listAllProducts() {
  console.log('\n=== All Products and Their Stock Levels ===\n');
  const products = await stripe.products.list({ active: true, limit: 100 });
  
  for (const product of products.data) {
    const stock = product.metadata?.stock || 'Not set';
    const totalSold = product.metadata?.total_sold || '0';
    const lastPurchase = product.metadata?.last_purchase_date || 'Never';
    
    console.log(`📦 ${product.name} (${product.id})`);
    console.log(`   Stock: ${stock}`);
    console.log(`   Total Sold: ${totalSold}`);
    console.log(`   Last Purchase: ${lastPurchase}`);
    console.log(`   Active: ${product.active ? '✅' : '❌'}`);
    // Show parcel metadata
    console.log(`   Parcel: ${product.metadata?.parcel_length || '-'} x ${product.metadata?.parcel_width || '-'} x ${product.metadata?.parcel_height || '-'} in, ${product.metadata?.parcel_weight_oz || '-'} oz`);
    console.log('');
  }
}

async function setStockForProduct(productId, newStock) {
  try {
    const product = await stripe.products.retrieve(productId);
    const updatedProduct = await stripe.products.update(productId, {
      metadata: { ...product.metadata, stock: String(newStock) }
    });
    console.log(`✅ Stock updated for ${product.name}: ${newStock}`);
    return updatedProduct;
  } catch (error) {
    console.error(`❌ Error updating stock for product ${productId}:`, error.message);
    throw error;
  }
}

async function setStockForAllProducts(newStock) {
  console.log(`\n=== Setting stock to ${newStock} for all products ===\n`);
  const products = await stripe.products.list({ active: true, limit: 100 });
  
  for (const product of products.data) {
    try {
      await setStockForProduct(product.id, newStock);
    } catch (error) {
      console.error(`Failed to update ${product.name}:`, error.message);
    }
  }
  console.log('\n✅ All products updated!');
}

async function resetTotalSold() {
  console.log('\n=== Resetting total_sold for all products ===\n');
  const products = await stripe.products.list({ active: true, limit: 100 });
  
  for (const product of products.data) {
    try {
      const updatedProduct = await stripe.products.update(product.id, {
        metadata: { ...product.metadata, total_sold: '0' }
      });
      console.log(`✅ Reset total_sold for ${product.name}`);
    } catch (error) {
      console.error(`❌ Error resetting total_sold for ${product.name}:`, error.message);
    }
  }
  console.log('\n✅ All total_sold values reset!');
}

async function getLowStockProducts(threshold = 2) {
  console.log(`\n=== Products with stock <= ${threshold} ===\n`);
  const products = await stripe.products.list({ active: true, limit: 100 });
  
  const lowStockProducts = products.data.filter(product => {
    const stock = Number(product.metadata?.stock || 0);
    return stock <= threshold;
  });
  
  if (lowStockProducts.length === 0) {
    console.log(`No products found with stock <= ${threshold}`);
    return;
  }
  
  for (const product of lowStockProducts) {
    const stock = product.metadata?.stock || 'Not set';
    console.log(`⚠️  ${product.name} (${product.id}) - Stock: ${stock}`);
  }
}

async function getOutOfStockProducts() {
  console.log('\n=== Out of Stock Products ===\n');
  const products = await stripe.products.list({ active: true, limit: 100 });
  
  const outOfStockProducts = products.data.filter(product => {
    const stock = Number(product.metadata?.stock || 0);
    return stock === 0;
  });
  
  if (outOfStockProducts.length === 0) {
    console.log('No out of stock products found!');
    return;
  }
  
  for (const product of outOfStockProducts) {
    console.log(`❌ ${product.name} (${product.id}) - Out of stock`);
  }
}

async function setCategoriesAndTagsForProducts(categoriesAndTagsByName) {
  const products = await stripe.products.list({ active: true, limit: 100 });
  for (const product of products.data) {
    const entry = categoriesAndTagsByName[product.name];
    if (entry) {
      await stripe.products.update(product.id, {
        metadata: { ...product.metadata, category: entry.category, tags: entry.tags.join(',') }
      });
      console.log(`✅ Set category/tags for ${product.name}: ${entry.category} / ${entry.tags.join(',')}`);
    }
  }
  console.log('All product categories and tags updated!');
}

async function clearTagsForAllProducts() {
  const products = await stripe.products.list({ active: true, limit: 100 });
  for (const product of products.data) {
    if (product.metadata && product.metadata.tags) {
      const newMetadata = { ...product.metadata };
      delete newMetadata.tags;
      await stripe.products.update(product.id, { metadata: newMetadata });
      console.log(`✅ Cleared tags for ${product.name}`);
    }
  }
  console.log('All product tags cleared!');
}

// Parcel size/weight mapping by product type
const parcelInfoByType = {
  bag: { length: 13, width: 8, height: 2, weight_oz: 12.8 }, // 0.8 lbs
  scarf: { length: 8, width: 8, height: 3, weight_oz: 12.8 }, // 0.8 lbs
  scrunchie: { length: 4, width: 4, height: 3, weight_oz: 2 }, // 2 oz
  cardigan: { length: 15, width: 16, height: 4, weight_oz: 28.8 }, // 1.8 lbs
  sweater: { length: 15, width: 16, height: 4, weight_oz: 28.8 }, // 1.8 lbs
  beanie: { length: 10, width: 11, height: 2, weight_oz: 12.8 }, // 0.8 lbs
};

function getParcelInfo(product) {
  // Try to determine type from tags, name, or category
  const tags = (product.metadata?.tags || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const category = (product.metadata?.category || '').toLowerCase();
  if (tags.includes('bag') || name.includes('bag') || category === 'bags') return parcelInfoByType.bag;
  if (tags.includes('scarf') || name.includes('scarf')) return parcelInfoByType.scarf;
  if (tags.includes('scrunchie') || name.includes('scrunchie')) return parcelInfoByType.scrunchie;
  if (tags.includes('cardigan') || name.includes('cardigan')) return parcelInfoByType.cardigan;
  if (tags.includes('sweater') || name.includes('sweater')) return parcelInfoByType.sweater;
  if (tags.includes('beanie') || name.includes('beanie')) return parcelInfoByType.beanie;
  return null;
}

async function updateAllProductParcelMetadata(stripe) {
  const products = await stripe.products.list({ limit: 100 });
  for (const product of products.data) {
    const parcel = getParcelInfo(product);
    if (parcel) {
      await stripe.products.update(product.id, {
        metadata: {
          ...product.metadata,
          parcel_length: parcel.length.toString(),
          parcel_width: parcel.width.toString(),
          parcel_height: parcel.height.toString(),
          parcel_weight_oz: parcel.weight_oz.toString(),
        },
      });
      console.log(`Updated ${product.name} (${product.id}) with parcel info.`);
    } else {
      console.log(`Skipped ${product.name} (${product.id}) - no parcel info.`);
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  switch (command) {
    case 'list':
      await listAllProducts();
      break;
      
    case 'set-all':
      const stock = parseInt(arg1);
      if (isNaN(stock)) {
        console.error('Please provide a valid number for stock level');
        process.exit(1);
      }
      await setStockForAllProducts(stock);
      break;
      
    case 'set':
      const productId = arg1;
      const newStock = parseInt(arg2);
      if (!productId || isNaN(newStock)) {
        console.error('Usage: node manageStock.js set <product_id> <stock_level>');
        process.exit(1);
      }
      await setStockForProduct(productId, newStock);
      break;
      
    case 'reset-sold':
      await resetTotalSold();
      break;
      
    case 'low-stock':
      const threshold = parseInt(arg1) || 2;
      await getLowStockProducts(threshold);
      break;
      
    case 'out-of-stock':
      await getOutOfStockProducts();
      break;
      
    case 'set-categories-tags':
      // Example usage: node manageStock.js set-categories-tags
      // Edit the categoriesAndTagsByName object below to match your products and desired categories and tags
      const categoriesAndTagsByName = {
        'Handbag - Multicolor (Dark Bag)': { category: 'Bags', tags: ['bag'] },
        'Handbag - Multicolor (Light Bag)': { category: 'Bags', tags: ['bag'] },
        'Handbag - Multi-color (Pink, Purple, Red, Orange)': { category: 'Bags', tags: ['bag'] },
        'Handbag - Beige/White Lining': { category: 'Bags', tags: ['bag'] },
        'Shoulder Bag - Brown': { category: 'Bags', tags: ['bag'] },
        'Scrunchie Set 1': { category: 'Wearables', tags: ['scrunchie', 'Accessories'] },
        'Scrunchie Set 2': { category: 'Wearables', tags: ['scrunchie', 'Accessories'] },
        'Scrunchie Set 3': { category: 'Wearables', tags: ['scrunchie', 'Accessories'] },
        'Scrunchie Set 4': { category: 'Wearables', tags: ['scrunchie', 'Accessories'] },
        'Scrunchie Set 5': { category: 'Wearables', tags: ['scrunchie', 'Accessories'] },
        'Scrunchie Set 6': { category: 'Wearables', tags: ['scrunchie', 'Accessories'] },
        'Beanie - Blue with Strands of White': { category: 'Wearables', tags: ['hats'] },
        'Beanie - Multi-color (Blue, White, Green, Beige)': { category: 'Wearables', tags: ['hats'] },
        'Beanie - Multi-color (Pink, Orange, Yellow, Blue)': { category: 'Wearables', tags: ['hats'] },
        'Scarf - White': { category: 'Wearables', tags: ['scarf', 'Accessories'] },
        'Scarf - Green, White': { category: 'Wearables', tags: ['scarf', 'Accessories'] },
      };
      await setCategoriesAndTagsForProducts(categoriesAndTagsByName);
      break;
      
    case 'clear-tags':
      await clearTagsForAllProducts();
      break;
      
    case 'update-parcel-metadata':
      await updateAllProductParcelMetadata(stripe);
      console.log('All product parcel metadata updated!');
      break;
      
    default:
      console.log(`\n📦 Stripe Stock Management Tool\n\nUsage:\n  node manageStock.js list                    - List all products and their stock levels\n  node manageStock.js set-all <number>        - Set stock level for all products\n  node manageStock.js set <id> <number>       - Set stock level for specific product\n  node manageStock.js reset-sold              - Reset total_sold for all products\n  node manageStock.js low-stock [threshold]   - Show products with low stock (default: 2)\n  node manageStock.js out-of-stock            - Show out of stock products\n  node manageStock.js set-categories-tags     - Set categories and tags for products (edit script to customize)\n  node manageStock.js clear-tags               - Clear tags for all products\n  node manageStock.js update-parcel-metadata  - Update all product parcel metadata\n\nExamples:\n  node manageStock.js list\n  node manageStock.js set-all 10\n  node manageStock.js set prod_123 5\n  node manageStock.js low-stock 3\n  node manageStock.js set-categories-tags\n  node manageStock.js clear-tags\n  node manageStock.js update-parcel-metadata\n      `);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}); 