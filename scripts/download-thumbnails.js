const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, '../public', filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded ${filename}`);
          resolve();
        });
      } else {
        console.error(`❌ Failed to download ${filename}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(path.join(__dirname, '../public', filename));
      console.error(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

// Main function
async function downloadThumbnails() {
  try {
    console.log('🚀 Starting thumbnail downloads...\n');

    // Download green cardigan thumbnail
    await downloadImage(
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/green_cardigan_thumbnail.jpg',
      'green_cardigan_thumbnail.jpg'
    );

    // Download blue white cardigan thumbnail
    await downloadImage(
      'https://caydiscreations.s3.us-east-2.amazonaws.com/Public/blue_white_cardigan_thumbnail.jpg',
      'blue_white_cardigan_thumbnail.jpg'
    );

    console.log('\n✅ All thumbnails downloaded successfully!');
  } catch (error) {
    console.error('❌ Error downloading thumbnails:', error);
  }
}

// Run the script
downloadThumbnails(); 