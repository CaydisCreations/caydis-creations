require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

async function testResendConfig() {
  console.log('🧪 Testing Resend Configuration...\n');
  console.log('🔑 API Key present:', !!process.env.RESEND_API_KEY);

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Test basic email sending
    console.log('📧 Testing email sending...');
    
    const result = await resend.emails.send({
      from: 'Caydi\'s Creations <onboarding@resend.dev>',
      to: 'caydiscreations@gmail.com',
      subject: '🧪 Resend Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4A3419;">🧪 Resend Configuration Test</h1>
          <p>This is a test email to verify Resend is working properly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY ? 'Present' : 'Missing'}</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Result:', result);
    console.log('📧 Check your email: caydiscreations@gmail.com');

  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('❌ Error details:', error.message);
    
    if (error.message.includes('domain')) {
      console.log('\n💡 Domain verification issue detected.');
      console.log('💡 Try using: onboarding@resend.dev');
    }
  }
}

// Run the test
testResendConfig(); 