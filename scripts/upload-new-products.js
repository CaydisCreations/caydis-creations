require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

const S3_BUCKET = 'caydiscreations';

// Define the uploads for each new product folder
const uploads = {
  'SmallBasket': [
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003908Z-1-001/IMG_6337.jpeg',
      s3Path: 'Public/SmallBasket/IMG_6337.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003908Z-1-001/IMG_6338.jpeg',
      s3Path: 'Public/SmallBasket/IMG_6338.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003908Z-1-001/IMG_6339.jpeg',
      s3Path: 'Public/SmallBasket/IMG_6339.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003908Z-1-001/IMG_6341.jpeg',
      s3Path: 'Public/SmallBasket/IMG_6341.jpeg'
    }
  ],
  'Coasters': [
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003839Z-1-001/IMG_6332.jpeg',
      s3Path: 'Public/Coasters/IMG_6332.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003839Z-1-001/IMG_6333.jpeg',
      s3Path: 'Public/Coasters/IMG_6333.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003839Z-1-001/IMG_6334.jpeg',
      s3Path: 'Public/Coasters/IMG_6334.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003839Z-1-001/IMG_6335.jpeg',
      s3Path: 'Public/Coasters/IMG_6335.jpeg'
    },
    {
      localPath: '/Users/phill/Downloads/drive-download-20250804T003839Z-1-001/IMG_6336.jpeg',
      s3Path: 'Public/Coasters/IMG_6336.jpeg'
    }
  ]
};

async function uploadNewProducts() {
  console.log('🖼️ Starting upload of new product images to S3...\n');

  for (const folder in uploads) {
    const files = uploads[folder];
    console.log(`📁 Processing folder: ${folder}`);

    for (const file of files) {
      const command = `aws s3 cp "${file.localPath}" "s3://${S3_BUCKET}/${file.s3Path}"`;

      try {
        console.log(`  📤 Uploading: ${file.localPath.split('/').pop()}`);
        execSync(command, { stdio: 'inherit' });
        console.log(`  ✅ Successfully uploaded ${file.localPath.split('/').pop()}`);
      } catch (error) {
        console.error(`  ❌ Error uploading ${file.localPath.split('/').pop()}: ${error.message}`);
        console.error(`  Please ensure the file exists at: ${file.localPath}`);
      }
    }
    console.log('');
  }
  
  console.log('🎉 Finished uploading new product images.');
  console.log('\n📋 Summary:');
  console.log('✅ SmallBasket: IMG_6337.jpeg, IMG_6338.jpeg, IMG_6339.jpeg, IMG_6341.jpeg');
  console.log('✅ Coasters: IMG_6332.jpeg, IMG_6333.jpeg, IMG_6334.jpeg, IMG_6335.jpeg, IMG_6336.jpeg');
  
  console.log('\n🔗 S3 URLs:');
  console.log('SmallBasket:');
  uploads.SmallBasket.forEach(file => {
    const url = `https://${S3_BUCKET}.s3.us-east-2.amazonaws.com/${file.s3Path}`;
    console.log(`  ${url}`);
  });
  
  console.log('\nCoasters:');
  uploads.Coasters.forEach(file => {
    const url = `https://${S3_BUCKET}.s3.us-east-2.amazonaws.com/${file.s3Path}`;
    console.log(`  ${url}`);
  });
}

uploadNewProducts(); 