require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testNewApiKey() {
  console.log('🧪 Testing new API key...\n');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found');
    return;
  }

  console.log('✅ RESEND_API_KEY found');
  console.log('📧 API Key (first 10 chars):', process.env.RESEND_API_KEY.substring(0, 10) + '...');

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('📤 Testing with new account...');
    
    const result = await resend.emails.send({
      from: 'no-reply@confirmation.caydiscreations.com', // Use your verified domain!
      to: 'caydiscreations@gmail.com', // Your new email
      subject: '🎉 Test: Verified Domain Working!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🎉 Success!</h2>
          <p>Your domain <strong>confirmation.caydiscreations.com</strong> is now working!</p>
          <p>This email was sent using your verified domain with the new API key.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Result:', result);
    console.log('\n📧 Check your email at: caydiscreations@gmail.com');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure you updated the API key in .env.local');
  }
}

testNewApiKey(); 