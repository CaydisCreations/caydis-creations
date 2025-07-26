require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

async function testShippoKey() {
  console.log('🧪 Testing Shippo API Key...\n');
  
  console.log('🔑 API Key present:', !!process.env.SHIPPO_API_KEY);
  console.log('🔑 API Key starts with:', process.env.SHIPPO_API_KEY?.substring(0, 10) + '...');
  
  const shippo = new Shippo(process.env.SHIPPO_API_KEY);
  
  try {
    // Test a simple API call first
    console.log('📋 Testing API key with a simple request...');
    
    // Try to get account info or test the connection
    const account = await shippo.account.retrieve();
    console.log('✅ API key is valid!');
    console.log('📋 Account info:', account);
    
  } catch (error) {
    console.error('❌ API key test failed:', error.message);
    console.error('❌ Status:', error.statusCode);
    console.error('❌ Body:', error.body);
    
    if (error.message.includes('Authentication')) {
      console.log('💡 The API key appears to be invalid or not being sent correctly');
      console.log('💡 Check that SHIPPO_API_KEY is set correctly in .env.local');
    }
  }
}

// Run the test
testShippoKey(); 