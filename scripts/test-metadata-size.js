require('dotenv').config({ path: '.env.local' });

function testMetadataSize() {
  console.log('🧪 Testing Metadata Size...\n');
  
  // Simulate the compact format
  const shippingLabels = [
    {
      p: "Scrunchie Set 6",
      t: "9200190347375200516185",
      c: "USPS",
      u: "0ccedfe65ef34a0eb54c30ade9ebb442"
    },
    {
      p: "Shipping (USPS Ground)",
      t: "1ZXXXXXXXXXXXXXXXX",
      c: "UPS",
      u: "55c0fb79f7344b3199192013a606c99e"
    }
  ];
  
  const trackingInfo = [
    {
      productName: "Scrunchie Set 6",
      trackingNumber: "9200190347375200516185",
      carrier: "USPS"
    },
    {
      productName: "Shipping (USPS Ground Advantage)",
      trackingNumber: "1ZXXXXXXXXXXXXXXXX",
      carrier: "UPS"
    }
  ];
  
  const shippingLabelsJson = JSON.stringify(shippingLabels);
  const trackingInfoJson = JSON.stringify(trackingInfo);
  
  console.log('📊 Metadata Size Analysis:');
  console.log('📋 Shipping Labels JSON:', shippingLabelsJson);
  console.log('📋 Shipping Labels Length:', shippingLabelsJson.length, 'characters');
  console.log('📋 Tracking Info JSON:', trackingInfoJson);
  console.log('📋 Tracking Info Length:', trackingInfoJson.length, 'characters');
  
  console.log('\n📊 Stripe Metadata Limits:');
  console.log('✅ Shipping Labels:', shippingLabelsJson.length <= 500 ? '✅ Under 500 chars' : '❌ Over 500 chars');
  console.log('✅ Tracking Info:', trackingInfoJson.length <= 500 ? '✅ Under 500 chars' : '❌ Over 500 chars');
  
  if (shippingLabelsJson.length > 500) {
    console.log('\n❌ ERROR: Shipping labels JSON is too long for Stripe metadata!');
    console.log('📋 Current length:', shippingLabelsJson.length);
    console.log('📋 Max allowed:', 500);
    console.log('📋 Over by:', shippingLabelsJson.length - 500, 'characters');
  } else {
    console.log('\n✅ SUCCESS: All metadata fits within Stripe limits!');
  }
}

testMetadataSize(); 