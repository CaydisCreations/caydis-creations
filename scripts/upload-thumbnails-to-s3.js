const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({
  region: 'us-east-2'
});

const s3 = new AWS.S3();
const bucketName = 'caydiscreations';

// Function to upload image to S3
async function uploadImageToS3(filePath, key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: bucketName,
      Key: `Public/${key}`,
      Body: fileContent,
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    console.log(`✅ Successfully uploaded ${key}`);
    console.log(`🔗 Public URL: ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error(`❌ Error uploading ${key}:`, error);
    throw error;
  }
}

// Function to get public URL for an existing file
async function getPublicUrl(key) {
  const url = `https://${bucketName}.s3.us-east-2.amazonaws.com/Public/${key}`;
  console.log(`🔗 Public URL for ${key}: ${url}`);
  return url;
}

// Main function
async function manageThumbnails() {
  try {
    console.log('🚀 S3 Thumbnail Management\n');

    // Check if thumbnail files exist locally
    const greenThumbnailPath = path.join(__dirname, '../public/green_cardigan_thumbnail.jpg');
    const blueWhiteThumbnailPath = path.join(__dirname, '../public/blue_white_cardigan_thumbnail.jpg');

    // Upload green cardigan thumbnail if it exists
    if (fs.existsSync(greenThumbnailPath)) {
      await uploadImageToS3(greenThumbnailPath, 'green_cardigan_thumbnail.jpg');
    } else {
      console.log('⚠️  Green cardigan thumbnail not found locally');
      console.log('📁 Expected location:', greenThumbnailPath);
    }

    // Upload blue white cardigan thumbnail if it exists
    if (fs.existsSync(blueWhiteThumbnailPath)) {
      await uploadImageToS3(blueWhiteThumbnailPath, 'blue_white_cardigan_thumbnail.jpg');
    } else {
      console.log('⚠️  Blue white cardigan thumbnail not found locally');
      console.log('📁 Expected location:', blueWhiteThumbnailPath);
    }

    // Get URLs for existing files
    console.log('\n📋 Existing S3 Files:');
    await getPublicUrl('green_cardigan_thumbnail.jpg');
    await getPublicUrl('blue_white_cardigan_thumbnail.jpg');

    console.log('\n✅ Thumbnail management completed!');
    console.log('\n💡 To upload new thumbnails:');
    console.log('1. Place images in the public/ folder');
    console.log('2. Run this script again');
    console.log('3. Update the gallery page with the new URLs');

  } catch (error) {
    console.error('❌ Error in thumbnail management:', error);
  }
}

// Run the script
manageThumbnails(); 