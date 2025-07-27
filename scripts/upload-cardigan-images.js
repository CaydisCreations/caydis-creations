const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to upload image to S3
function uploadToS3(localPath, s3Key) {
  try {
    const command = `aws s3 cp "${localPath}" s3://caydiscreations/Public/${s3Key}`;
    console.log(`📤 Uploading ${localPath} to s3://caydiscreations/Public/${s3Key}...`);
    
    execSync(command, { stdio: 'inherit' });
    
    const publicUrl = `https://caydiscreations.s3.us-east-2.amazonaws.com/Public/${s3Key}`;
    console.log(`✅ Upload successful!`);
    console.log(`🔗 Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Upload failed: ${error.message}`);
    return null;
  }
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Main function
function uploadCardiganImages() {
  console.log('🚀 Uploading Cardigan Images to S3\n');

  // Define the cardigan images to upload
  const cardiganImages = [
    {
      localPath: 'public/blue_white_cardigan.jpg',
      s3Key: 'Cardigan/blue_white/blue_white_cardigan.jpg',
      description: 'Blue & White Patterned Cardigan'
    },
    {
      localPath: 'public/blue_white_cardigan_thumbnail.jpg',
      s3Key: 'Cardigan/blue_white/blue_white_cardigan_thumbnail.jpg',
      description: 'Blue & White Cardigan Thumbnail'
    },
    {
      localPath: 'public/green_cardigan.jpg',
      s3Key: 'Cardigan/green/green_cardigan.jpg',
      description: 'Green Cardigan'
    },
    {
      localPath: 'public/green_cardigan_thumbnail.jpg',
      s3Key: 'Cardigan/green/green_cardigan_thumbnail.jpg',
      description: 'Green Cardigan Thumbnail'
    }
  ];

  console.log('📋 Checking for cardigan images...\n');

  let uploadedCount = 0;
  const uploadedUrls = {};

  cardiganImages.forEach(image => {
    if (fileExists(image.localPath)) {
      console.log(`✅ Found: ${image.localPath}`);
      const url = uploadToS3(image.localPath, image.s3Key);
      if (url) {
        uploadedUrls[image.s3Key] = url;
        uploadedCount++;
      }
    } else {
      console.log(`⚠️  Not found: ${image.localPath}`);
      console.log(`💡 Please place the ${image.description} image at: ${image.localPath}`);
    }
  });

  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successfully uploaded: ${uploadedCount}/${cardiganImages.length} images`);

  if (Object.keys(uploadedUrls).length > 0) {
    console.log('\n🔗 Generated URLs:');
    Object.entries(uploadedUrls).forEach(([key, url]) => {
      console.log(`${key}: ${url}`);
    });
  }

  console.log('\n💡 Next steps:');
  console.log('1. Place any missing cardigan images in the public/ folder');
  console.log('2. Run this script again to upload them');
  console.log('3. Update the gallery page with the new URLs');
}

// Run the script
uploadCardiganImages(); 