require('dotenv').config({ path: '.env.local' });
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Configure AWS S3 client
const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function listS3Urls(prefix = 'Public/') {
  console.log('=== S3 Object URLs ===\n');
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: 'caydiscreations',
      Prefix: prefix,
      MaxKeys: 100
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log('No objects found in the specified prefix.');
      return;
    }
    
    console.log(`Found ${response.Contents.length} objects:\n`);
    
    response.Contents.forEach((object, index) => {
      const key = object.Key;
      const size = (object.Size / 1024 / 1024).toFixed(2); // Convert to MB
      const lastModified = object.LastModified;
      
      // Generate public URL
      const publicUrl = `https://caydiscreations.s3.us-east-2.amazonaws.com/${key}`;
      
      console.log(`${index + 1}. ${key}`);
      console.log(`   Size: ${size} MB`);
      console.log(`   Modified: ${lastModified}`);
      console.log(`   URL: ${publicUrl}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error listing S3 objects:', error.message);
  }
}

// Function to list specific folder
async function listFolderUrls(folderPath) {
  console.log(`=== URLs for ${folderPath} ===\n`);
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: 'caydiscreations',
      Prefix: folderPath,
      MaxKeys: 50
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log(`No objects found in ${folderPath}`);
      return;
    }
    
    console.log(`Found ${response.Contents.length} objects in ${folderPath}:\n`);
    
    response.Contents.forEach((object, index) => {
      const key = object.Key;
      const size = (object.Size / 1024 / 1024).toFixed(2);
      const publicUrl = `https://caydiscreations.s3.us-east-2.amazonaws.com/${key}`;
      
      console.log(`${index + 1}. ${object.Key.split('/').pop()}`);
      console.log(`   Size: ${size} MB`);
      console.log(`   URL: ${publicUrl}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error listing folder:', error.message);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const folder = process.argv[3];
  
  switch (command) {
    case 'list':
      await listS3Urls();
      break;
      
    case 'folder':
      if (!folder) {
        console.log('Usage: node scripts/list-s3-urls.js folder <folder-path>');
        console.log('Example: node scripts/list-s3-urls.js folder Public/Beanies/beanie_dark_colorful/');
        return;
      }
      await listFolderUrls(folder);
      break;
      
    default:
      console.log(`
🔗 S3 URL Generator

Usage:
  node scripts/list-s3-urls.js list                    - List all objects in Public/
  node scripts/list-s3-urls.js folder <folder-path>    - List objects in specific folder

Examples:
  node scripts/list-s3-urls.js list
  node scripts/list-s3-urls.js folder Public/Beanies/beanie_dark_colorful/
  node scripts/list-s3-urls.js folder Public/Scrunchies/
      `);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}); 