const EasyPost = require('@easypost/api');

module.exports = function(apiKey) {
  console.log('🔑 Creating EasyPost client with API key:', apiKey ? 'Present' : 'Missing');
  
  if (!apiKey) {
    throw new Error('EASYPOST_API_KEY environment variable is not set');
  }
  
  return new EasyPost(apiKey);
}; 