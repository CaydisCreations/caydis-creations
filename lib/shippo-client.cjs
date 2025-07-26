const { Shippo } = require('shippo');
 
module.exports = function(apiKey) {
  console.log('🔑 Creating Shippo client with API key:', apiKey ? 'Present' : 'Missing');
  return new Shippo(apiKey);
}; 