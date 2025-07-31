const { execSync } = require('child_process');

const BUCKET_NAME = 'caydiscreations';
const AWS_REGION = 'us-east-2';

async function listBeanieImages() {
  try {
    console.log('🔍 Listing all beanie images from S3...\n');
    
    // List all objects in the Beanies folder
    const command = `aws s3 ls s3://${BUCKET_NAME}/Public/Beanies/ --recursive --region ${AWS_REGION}`;
    
    console.log(`📋 Running: ${command}`);
    const result = execSync(command, { encoding: 'utf8' });
    
    console.log('✅ Successfully retrieved beanie images:');
    console.log(result);
    
    // Parse the results to get just the file paths
    const lines = result.trim().split('\n');
    const beanieImages = lines
      .filter(line => line.trim() && !line.includes('PRE')) // Filter out directories
      .map(line => {
        const parts = line.trim().split(/\s+/);
        return parts[parts.length - 1]; // Get the file path
      })
      .filter(path => path && path.includes('.jpeg') || path.includes('.jpg') || path.includes('.png'));
    
    console.log('\n📋 Beanie image URLs:');
    beanieImages.forEach(imagePath => {
      const url = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${imagePath}`;
      console.log(`'${url}',`);
    });
    
    console.log(`\n📊 Total beanie images found: ${beanieImages.length}`);
    
  } catch (error) {
    console.error('❌ Error listing beanie images:', error.message);
  }
}

listBeanieImages(); 