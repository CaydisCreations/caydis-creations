require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const S3_BUCKET = 'caydiscreations';
const DOWNLOADS_PATH = '/Users/phill/Downloads/drive-download-20250731T045612Z-1-001/';
const UPLOADED_PATH = '/Users/phill/Downloads/drive-download-20250731T045612Z-1-001/uploaded/';

// Define the uploads for each bag folder
const uploads = {
  'rainbow': {
    images: ['IMG_6122.jpeg'],
    modeled: ['IMG_6168.jpeg', 'IMG_6169.jpeg', 'IMG_6171.jpeg']
  },
  'white_blue_green_yellow_red': {
    images: ['IMG_6124.jpeg', 'IMG_6125.jpeg'],
    modeled: ['IMG_6151.jpeg', 'IMG_6152.jpeg', 'IMG_6156.jpeg']
  },
  'red_pink_orange_purple': {
    images: ['IMG_6119.jpeg'],
    modeled: ['IMG_6157.jpeg', 'IMG_6159.jpeg', 'IMG_6163.jpeg', 'IMG_6164.jpeg', 'IMG_6167.jpeg']
  },
  'gray': {
    modeled: ['IMG_6141.jpeg', 'IMG_6143.jpeg']
  },
  'cream_colored': {
    images: ['IMG_6130.jpeg'],
    modeled: ['IMG_6146.jpeg', 'IMG_6149.jpeg']
  }
};

async function uploadBagImages() {
  console.log('👜 Starting upload of bag images to S3...\n');

  // Create uploaded folder if it doesn't exist
  if (!fs.existsSync(UPLOADED_PATH)) {
    fs.mkdirSync(UPLOADED_PATH, { recursive: true });
    console.log('📁 Created uploaded folder');
  }

  let totalUploaded = 0;

  for (const folder in uploads) {
    const folderData = uploads[folder];
    console.log(`📁 Processing folder: ${folder}`);

    // Upload main images
    if (folderData.images) {
      for (const file of folderData.images) {
        const localFilePath = `${DOWNLOADS_PATH}${file}`;
        const s3FilePath = `s3://${S3_BUCKET}/Public/Bags/${folder}/${file}`;
        const command = `aws s3 cp "${localFilePath}" "${s3FilePath}"`;

        try {
          console.log(`  📤 Uploading: ${file}`);
          execSync(command, { stdio: 'inherit' });
          console.log(`  ✅ Successfully uploaded ${file}`);
          
          // Move to uploaded folder
          const uploadedFilePath = `${UPLOADED_PATH}${file}`;
          fs.renameSync(localFilePath, uploadedFilePath);
          console.log(`  📦 Moved to uploaded folder: ${file}`);
          totalUploaded++;
        } catch (error) {
          console.error(`  ❌ Error uploading ${file}: ${error.message}`);
        }
      }
    }

    // Upload modeled images
    if (folderData.modeled) {
      for (const file of folderData.modeled) {
        const localFilePath = `${DOWNLOADS_PATH}${file}`;
        const s3FilePath = `s3://${S3_BUCKET}/Public/Bags/${folder}/modeled/${file}`;
        const command = `aws s3 cp "${localFilePath}" "${s3FilePath}"`;

        try {
          console.log(`  📤 Uploading: ${file} (modeled)`);
          execSync(command, { stdio: 'inherit' });
          console.log(`  ✅ Successfully uploaded ${file} (modeled)`);
          
          // Move to uploaded folder
          const uploadedFilePath = `${UPLOADED_PATH}${file}`;
          fs.renameSync(localFilePath, uploadedFilePath);
          console.log(`  📦 Moved to uploaded folder: ${file}`);
          totalUploaded++;
        } catch (error) {
          console.error(`  ❌ Error uploading ${file}: ${error.message}`);
        }
      }
    }
    console.log('');
  }
  
  console.log('🎉 Finished uploading bag images.');
  console.log(`📊 Total files uploaded and moved: ${totalUploaded}`);
  console.log(`📁 All uploaded files moved to: ${UPLOADED_PATH}`);
  
  console.log('\n📋 Summary:');
  console.log('✅ rainbow: 1 main + 3 modeled images');
  console.log('✅ white_blue_green_yellow_red: 2 main + 3 modeled images');
  console.log('✅ red_pink_orange_purple: 1 main + 5 modeled images');
  console.log('✅ gray: 2 modeled images');
  console.log('✅ cream_colored: 1 main + 2 modeled images');
}

uploadBagImages(); 