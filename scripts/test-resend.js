require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('📧 Testing Resend email service...\n');

  try {
    const result = await resend.emails.send({
      from: "Caydi's Creations <no-reply@confirmation.caydiscreations.com>",
      to: "caydiscreations@gmail.com",
      subject: "🧪 Test Email - Resend Configuration",
      html: `
        <div style="font-size:16px; color:#4A3419; font-family:sans-serif;">
          <h2>🧪 Resend Test Email</h2>
          <p>This is a test email to verify your Resend configuration is working.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> no-reply@confirmation.caydiscreations.com</p>
          <p><strong>To:</strong> caydiscreations@gmail.com</p>
          <p>If you receive this email, your Resend setup is working correctly!</p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Email ID:', result.id);
    console.log('📧 Check your email at: caydiscreations@gmail.com');
    console.log('\n💡 If you don\'t see the email:');
    console.log('   1. Check your spam folder');
    console.log('   2. Verify the domain confirmations.caydiscreations.com is verified in Resend');
    console.log('   3. Check Resend dashboard for delivery status');

  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    
    if (error.message.includes('domain')) {
      console.log('\n💡 Domain verification issue detected!');
      console.log('   You may need to verify the domain confirmation.caydiscreations.com in Resend');
      console.log('   Go to: https://resend.com/domains');
    }
  }
}

testResend(); 