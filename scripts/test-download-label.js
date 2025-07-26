require('dotenv').config({ path: '.env.local' });

async function testDownloadLabel() {
  console.log('🧪 Testing Download Label Proxy...\n');
  
  const transactionId = '77b484c17c0442c788efc0398f43a6a6'; // From your error
  const apiKey = process.env.SHIPPO_API_KEY;
  
  console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');
  console.log('📋 Transaction ID:', transactionId);
  
  try {
    console.log('📦 Fetching label directly from Shippo...');
    
    const response = await fetch(`https://api.goshippo.com/transactions/${transactionId}/label.pdf`, {
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const pdfBuffer = await response.arrayBuffer();
      console.log('✅ Successfully fetched label!');
      console.log('📊 PDF size:', pdfBuffer.byteLength, 'bytes');
      console.log('📋 Content-Type:', response.headers.get('content-type'));
    } else {
      console.log('❌ Failed to fetch label');
      console.log('📋 Status:', response.status);
      console.log('📋 Status Text:', response.statusText);
      
      const errorText = await response.text();
      console.log('📋 Error Details:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error testing download:', error.message);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. The proxy endpoint should handle authentication automatically');
  console.log('2. Try downloading labels from the admin dashboard');
  console.log('3. The PDF should download with proper filename');
}

testDownloadLabel(); 