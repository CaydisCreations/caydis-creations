const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run AWS CLI command
function runAwsCommand(command) {
  try {
    const result = execSync(command, { encoding: 'utf8' });
    return result;
  } catch (error) {
    console.error(`❌ AWS CLI command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to upload image to S3 using AWS CLI
function uploadImageToS3(filePath, key) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  const command = `aws s3 cp "${filePath}" s3://caydiscreations/Public/${key} --acl public-read`;
  console.log(`📤 Uploading ${key}...`);
  
  const result = runAwsCommand(command);
  if (result) {
    console.log(`✅ Successfully uploaded ${key}`);
    console.log(`🔗 Public URL: https://caydiscreations.s3.us-east-2.amazonaws.com/Public/${key}`);
    return true;
  }
  return false;
}

// Function to list S3 files
function listS3Files(prefix = '') {
  const command = `aws s3 ls s3://caydiscreations/Public/${prefix} --recursive`;
  console.log(`📋 Listing files in s3://caydiscreations/Public/${prefix}`);
  
  const result = runAwsCommand(command);
  if (result) {
    console.log(result);
  }
}

// Function to get public URL
function getPublicUrl(key) {
  const url = `https://caydiscreations.s3.us-east-2.amazonaws.com/Public/${key}`;
  console.log(`🔗 Public URL for ${key}: ${url}`);
  return url;
}

// Main function
function manageThumbnails() {
  console.log('🚀 S3 Thumbnail Management using AWS CLI\n');

  // Check if thumbnail files exist locally
  const greenThumbnailPath = path.join(__dirname, '../public/green_cardigan_thumbnail.jpg');
  const blueWhiteThumbnailPath = path.join(__dirname, '../public/blue_white_cardigan_thumbnail.jpg');

  // Upload green cardigan thumbnail if it exists
  if (fs.existsSync(greenThumbnailPath)) {
    uploadImageToS3(greenThumbnailPath, 'green_cardigan_thumbnail.jpg');
  } else {
    console.log('⚠️  Green cardigan thumbnail not found locally');
    console.log('📁 Expected location:', greenThumbnailPath);
  }

  // Upload blue white cardigan thumbnail if it exists
  if (fs.existsSync(blueWhiteThumbnailPath)) {
    uploadImageToS3(blueWhiteThumbnailPath, 'blue_white_cardigan_thumbnail.jpg');
  } else {
    console.log('⚠️  Blue white cardigan thumbnail not found locally');
    console.log('📁 Expected location:', blueWhiteThumbnailPath);
  }

  // Check existing files
  console.log('\n📋 Checking existing thumbnail files in S3:');
  listS3Files('*thumbnail*');

  console.log('\n✅ Thumbnail management completed!');
  console.log('\n💡 To upload new thumbnails:');
  console.log('1. Place images in the public/ folder');
  console.log('2. Run this script again');
  console.log('3. Update the gallery page with the new URLs');
}

// Run the script
manageThumbnails(); 