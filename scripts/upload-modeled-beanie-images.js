require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

const S3_BUCKET = 'caydiscreations';

// Define the uploads for each beanie folder
const DOWNLOADS_PATH = '/Users/phill/Downloads/drive-download-20250731T044605Z-1-001/';

const uploads = {
  'blue1': [
    'IMG_6182.jpeg',
    'IMG_6186.jpeg'
  ],
  'green_blue_white_brown': [
    'FullSizeRender 2.jpeg',
    'FullSizeRender 3.jpeg',
    'FullSizeRender.jpeg',
    'IMG_6201.jpeg'
  ],
  'red_blue_yellow': [
    'IMG_6207.jpeg',
    'IMG_6210.jpeg',
    'IMG_6212.jpeg'
  ]
};

async function uploadModeledBeanieImages() {
  console.log('🖼️ Starting upload of modeled beanie images to S3...\n');

  for (const folder in uploads) {
    const files = uploads[folder];
    const s3TargetDir = `s3://${S3_BUCKET}/Public/Beanies/${folder}/modeled/`;

    console.log(`📁 Processing folder: ${folder}`);
    console.log(`🎯 S3 Target Directory: ${s3TargetDir}`);

    for (const file of files) {
      const localFilePath = `${DOWNLOADS_PATH}${file}`;
      const s3FilePath = `${s3TargetDir}${file}`;
      const command = `aws s3 cp "${localFilePath}" "${s3FilePath}"`;

      try {
        console.log(`  📤 Uploading: ${file}`);
        execSync(command, { stdio: 'inherit' });
        console.log(`  ✅ Successfully uploaded ${file}`);
      } catch (error) {
        console.error(`  ❌ Error uploading ${file}: ${error.message}`);
        console.error(`  Please ensure the file exists at: ${localFilePath}`);
      }
    }
    console.log('');
  }
  
  console.log('🎉 Finished uploading modeled beanie images.');
  console.log('\n📋 Summary:');
  console.log('✅ blue1: IMG_6182.jpeg, IMG_6186.jpeg');
  console.log('✅ green_blue_white_brown: FullSizeRender 2.jpeg, FullSizeRender 3.jpeg, FullSizeRender.jpeg, IMG_6201.jpeg');
  console.log('✅ red_blue_yellow: IMG_6207.jpeg, IMG_6210.jpeg, IMG_6212.jpeg');
}

uploadModeledBeanieImages(); 