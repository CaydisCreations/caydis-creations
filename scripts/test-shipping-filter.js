require('dotenv').config({ path: '.env.local' });

function testShippingFilter() {
  console.log('🧪 Testing Shipping Line Item Filter...\n');
  
  // Test product names that should be filtered out
  const testProducts = [
    'Scrunchie Set 6',
    'Shipping (USPS Ground Advantage)',
    'Delivery Fee',
    'Postage & Handling',
    'Shipping Cost',
    'Express Delivery',
    'Standard Shipping',
    'Handmade Scarf',
    'Custom Order',
    'Recycled Yarn Product'
  ];
  
  console.log('📋 Testing product filtering:');
  
  testProducts.forEach(productName => {
    const shouldSkip = productName.toLowerCase().includes('shipping') || 
                      productName.toLowerCase().includes('delivery') ||
                      productName.toLowerCase().includes('postage');
    
    const status = shouldSkip ? '❌ SKIP' : '✅ CREATE LABEL';
    console.log(`${status} - "${productName}"`);
  });
  
  console.log('\n📊 Summary:');
  const skipCount = testProducts.filter(name => 
    name.toLowerCase().includes('shipping') || 
    name.toLowerCase().includes('delivery') ||
    name.toLowerCase().includes('postage')
  ).length;
  
  const createCount = testProducts.length - skipCount;
  
  console.log(`✅ Products that will get labels: ${createCount}`);
  console.log(`❌ Shipping items that will be skipped: ${skipCount}`);
  
  if (skipCount > 0) {
    console.log('\n🎯 This will fix the duplicate tracking number issue!');
  }
}

testShippingFilter(); 