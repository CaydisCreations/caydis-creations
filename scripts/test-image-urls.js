const https = require('https');

const testUrls = [
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue_white/modeled/IMG_6184.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/white/modeled/IMG_6174.jpeg'
];

function testImageUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${url} - Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`❌ ${url} - Status: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ ${url} - Error: ${err.message}`);
      resolve(false);
    });
  });
}

async function testAllUrls() {
  console.log('🔍 Testing image URLs...\n');
  
  for (const url of testUrls) {
    await testImageUrl(url);
  }
  
  console.log('\n✅ Image URL testing completed!');
}

testAllUrls(); 