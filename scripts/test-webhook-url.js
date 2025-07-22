const https = require('https');

async function testWebhookURL() {
  console.log('🧪 Testing webhook URLs...\n');

  const urls = [
    'https://caydiscreations.com/api/stripe-webhook',
    'https://caydis-creations-5ripneg1q-caydis-creations-projects.vercel.app/api/stripe-webhook'
  ];

  for (const url of urls) {
    console.log(`📡 Testing: ${url}`);
    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy());
      });
      
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${response.data.substring(0, 200)}...`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('💡 The correct webhook URL should be: https://caydiscreations.com/api/stripe-webhook');
  console.log('🔧 Check your Stripe webhook configuration and update it to use the custom domain URL.');
}

testWebhookURL(); 