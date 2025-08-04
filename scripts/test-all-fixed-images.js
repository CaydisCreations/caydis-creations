const https = require('https');

const testUrls = [
  // Bag images
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/red_pink_orange_purple/modeled/IMG_6157.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/rainbow/modeled/IMG_6168.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_rainbow/modeled/IMG_6151.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/cream_colored/modeled/IMG_6146.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Bags/light_brown/modeled/IMG_6143.jpeg',
  
  // Beanie images
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/blue1/modeled/IMG_6182.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/green_blue_white_brown/modeled/FullSizeRender%202.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Beanies/red_blue_yellow/modeled/IMG_6207.jpeg',
  
  // Scarf images
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_white/Modeled/IMG_6236.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/green_white/Modeled/IMG_6260.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scarves/Solid_green/Modeled/IMG_6293.jpeg',
  
  // Scrunchie images
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/124e56aa-a007-450c-95ce-7b6050caa8ec.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/32384b1b-d9d7-4134-9161-4a8397c020d9.jpeg',
  'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/Scrunchies/3a3374b8-0cd6-420c-b55a-153b576bb7f9.jpeg'
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
  console.log('🔍 Testing all fixed image URLs...\n');
  
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
  
  if (successCount === testUrls.length) {
    console.log('🎉 ALL IMAGES ARE WORKING!');
  } else {
    console.log('⚠️ Some images still need attention');
  }
}

testAllUrls(); 