require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

async function testShippoTransactionDetails() {
  try {
    console.log('🔍 Testing Shippo transaction details...\n');

    // Test with a recent transaction ID
    const transactionId = '59ee1b8586494c55a6223ecd9f523d0b';
    
    console.log(`📋 Testing transaction: ${transactionId}`);
    
    try {
      // Get transaction details from Shippo
      const transaction = await shippo.transactions.retrieve(transactionId);
      
      console.log('✅ Transaction retrieved successfully!');
      console.log('📦 Transaction details:');
      console.log(`   Object ID: ${transaction.object_id}`);
      console.log(`   Status: ${transaction.status}`);
      console.log(`   Test: ${transaction.test}`);
      console.log(`   Label URL: ${transaction.label_url || 'None'}`);
      console.log(`   Tracking Number: ${transaction.tracking_number || 'None'}`);
      console.log(`   Tracking URL: ${transaction.tracking_url || 'None'}`);
      console.log(`   Rate: ${transaction.rate || 'None'}`);
      
      if (transaction.messages && transaction.messages.length > 0) {
        console.log('⚠️ Transaction messages:');
        transaction.messages.forEach(msg => {
          console.log(`   - ${msg.code}: ${msg.text}`);
        });
      }
      
      if (transaction.label_url) {
        console.log('\n📎 Testing label URL fetch...');
        try {
          const labelResponse = await fetch(transaction.label_url);
          console.log(`📋 Label URL response: ${labelResponse.status} - ${labelResponse.statusText}`);
          
          if (labelResponse.ok) {
            const pdfBuffer = await labelResponse.arrayBuffer();
            console.log(`✅ Label PDF fetched successfully! Size: ${pdfBuffer.byteLength} bytes`);
          } else {
            console.log(`❌ Label URL failed: ${labelResponse.status}`);
          }
        } catch (labelError) {
          console.log(`❌ Label URL error:`, labelError.message);
        }
      }
      
    } catch (shippoError) {
      console.error('❌ Shippo API error:', shippoError);
      
      // Try alternative approach - list recent transactions
      console.log('\n🔄 Trying to list recent transactions...');
      try {
        const transactions = await shippo.transactions.list({ limit: 5 });
        console.log(`📦 Found ${transactions.results.length} recent transactions:`);
        
        transactions.results.forEach((tx, index) => {
          console.log(`\n   Transaction ${index + 1}:`);
          console.log(`     Object ID: ${tx.object_id}`);
          console.log(`     Status: ${tx.status}`);
          console.log(`     Test: ${tx.test}`);
          console.log(`     Label URL: ${tx.label_url || 'None'}`);
          console.log(`     Tracking Number: ${tx.tracking_number || 'None'}`);
        });
      } catch (listError) {
        console.error('❌ Error listing transactions:', listError);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testShippoTransactionDetails(); 