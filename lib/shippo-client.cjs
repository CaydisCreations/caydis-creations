const { Shippo } = require('shippo');

module.exports = function(apiKey) {
  return new Shippo({ apiKeyHeader: apiKey });
}; 