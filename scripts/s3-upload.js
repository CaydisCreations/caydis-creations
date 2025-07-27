const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to upload image to S3
function uploadToS3(localPath, s3Key) {
  try {
    const command = `aws s3 cp "${localPath}" s3://caydiscreations/Public/${s3Key} --acl public-read`;
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

// Function to list files in S3
function listS3Files(prefix = '') {
  try {
    const command = `aws s3 ls s3://caydiscreations/Public/${prefix}`;
    console.log(`📋 Listing files in s3://caydiscreations/Public/${prefix}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ List failed: ${error.message}`);
  }
}

// Main function
function main() {
  console.log('🚀 S3 Upload Tool\n');
  
  // Example usage
  console.log('💡 Usage Examples:');
  console.log('1. Upload a file: node scripts/s3-upload.js upload <local-path> <s3-key>');
  console.log('2. List files: node scripts/s3-upload.js list [prefix]');
  console.log('');
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Current S3 files:');
    listS3Files();
    return;
  }
  
  const command = args[0];
  
  if (command === 'upload' && args.length >= 3) {
    const localPath = args[1];
    const s3Key = args[2];
    
    if (!fs.existsSync(localPath)) {
      console.error(`❌ File not found: ${localPath}`);
      return;
    }
    
    uploadToS3(localPath, s3Key);
  } else if (command === 'list') {
    const prefix = args[1] || '';
    listS3Files(prefix);
  } else {
    console.log('❌ Invalid command. Use: upload <local-path> <s3-key> or list [prefix]');
  }
}

main(); 