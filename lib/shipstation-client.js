const ShipEngine = require('shipengine');

module.exports = function(apiKey) {
  console.log('🔑 Creating ShipStation client with API key:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    throw new Error('SHIPSTATION_API_KEY environment variable is not set');
  }
  
  return new ShipEngine(apiKey);
};
