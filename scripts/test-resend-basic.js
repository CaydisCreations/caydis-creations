require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testEmailAddress() {
  console.log('🧪 Testing email address...\n');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log('📤 Testing if caydiscreations@gmail.com works...');
    
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use default sender
      to: 'caydiscreations@gmail.com', // Test the correct email
      subject: '🧪 Test: Email Address Working',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🧪 Email Test</h2>
          <p>Testing if caydiscreations@gmail.com works with Resend.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Result:', result);
    console.log('\n📧 Check your email at: caydiscreations@gmail.com');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 This means Resend account still needs to be updated to caydiscreations@gmail.com');
  }
}

testEmailAddress(); 