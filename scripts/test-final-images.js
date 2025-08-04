const https = require('https');

const testUrls = [
  // Bag images (should work)
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
  
  // Beanie images (should work now)
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%202.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6207.jpeg',
  
  // Scarf images (should work)
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6236.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6260.jpeg'
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
  console.log('🔍 Testing all final image URLs...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const url of testUrls) {
    const success = await testImageUrl(url);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n📊 Final Results:');
  console.log(`✅ Working: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log(`📈 Success Rate: ${((successCount / testUrls.length) * 100).toFixed(1)}%`);
}

testAllUrls(); 