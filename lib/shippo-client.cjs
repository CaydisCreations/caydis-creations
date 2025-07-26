const { Shippo } = require('shippo');
 
module.exports = function(apiKey) {
  console.log('🔑 Creating Shippo client with API key:', apiKey ? 'Present' : 'Missing');
  // Use the correct initialization method with apiKeyHeader
  return new Shippo({ apiKeyHeader: apiKey });
}; 