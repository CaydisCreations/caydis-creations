require('dotenv').config({ path: '.env.local' });
const { Shippo } = require('shippo');

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY });

async function debugShippoTransactionStructure() {
  try {
    console.log('🔍 Debugging Shippo transaction structure...\n');

    // List recent transactions
    const transactions = await shippo.transactions.list({ limit: 3 });
    console.log(`📦 Found ${transactions.results.length} recent transactions\n`);

    transactions.results.forEach((tx, index) => {
      console.log(`📋 Transaction ${index + 1}:`);
      console.log('📦 Full transaction object:');
      console.log(JSON.stringify(tx, null, 2));
      console.log('---\n');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugShippoTransactionStructure(); 