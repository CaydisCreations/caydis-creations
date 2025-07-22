const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function updateDomain() {
  try {
    console.log('⚙️ Updating domain settings...');
    
    const updateResult = await resend.domains.update({
      id: '7f4313cb-af60-4ef7-851d-60cb6414019b',
      openTracking: false,
      clickTracking: true,
    });
    
    console.log('📋 Update result:', JSON.stringify(updateResult, null, 2));
    console.log('✅ Domain updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

updateDomain(); 