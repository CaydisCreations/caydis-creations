const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
    console.log(`✅ Successfully uploaded ${key}: ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error(`❌ Error uploading ${key}:`, error);
    throw error;
  }
}

// Main function
async function uploadThumbnails() {
  try {
    console.log('🚀 Starting thumbnail uploads...\n');

    // Upload green cardigan thumbnail
    const greenThumbnailPath = path.join(__dirname, '../public/green_cardigan_thumbnail.jpg');
    if (fs.existsSync(greenThumbnailPath)) {
      await uploadImageToS3(greenThumbnailPath, 'green_cardigan_thumbnail.jpg');
    } else {
      console.log('⚠️  Green cardigan thumbnail not found at:', greenThumbnailPath);
    }

    // Upload blue white cardigan thumbnail
    const blueWhiteThumbnailPath = path.join(__dirname, '../public/blue_white_cardigan_thumbnail.jpg');
    if (fs.existsSync(blueWhiteThumbnailPath)) {
      await uploadImageToS3(blueWhiteThumbnailPath, 'blue_white_cardigan_thumbnail.jpg');
    } else {
      console.log('⚠️  Blue white cardigan thumbnail not found at:', blueWhiteThumbnailPath);
    }

    console.log('\n✅ All thumbnail uploads completed!');
  } catch (error) {
    console.error('❌ Error in thumbnail upload process:', error);
  }
}

// Run the script
uploadThumbnails(); 