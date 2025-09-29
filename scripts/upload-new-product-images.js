require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

const S3_BUCKET = 'caydiscreations';

// Define the new images to upload
const newImages = [
  {
    localPath: '/path/to/your/new-image-1.jpeg',
    s3Path: 'Public/NewProductFolder/new-image-1.jpeg'
  },
  {
    localPath: '/path/to/your/new-image-2.jpeg', 
    s3Path: 'Public/NewProductFolder/new-image-2.jpeg'
  },
  {
    localPath: '/path/to/your/new-image-3.jpeg',
    s3Path: 'Public/NewProductFolder/new-image-3.jpeg'
  }
];

async function uploadNewImages() {
  console.log('🖼️ Starting upload of new product images to S3...\n');

  for (const image of newImages) {
    try {
      console.log(`📤 Uploading: ${image.localPath}`);
      console.log(`   → S3 Path: ${image.s3Path}`);
      
      const command = `aws s3 cp "${image.localPath}" "s3://${S3_BUCKET}/${image.s3Path}"`;
      execSync(command, { stdio: 'inherit' });
      
      console.log(`✅ Uploaded successfully!\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${image.localPath}:`, error.message);
    }
  }

  console.log('🎉 All images uploaded to S3!');
  console.log('\nNext steps:');
  console.log('1. Update the product images in Stripe Dashboard, OR');
  console.log('2. Run the update-product-images.js script with the new S3 URLs');
}

uploadNewImages();
