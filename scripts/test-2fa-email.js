const fetch = require('node-fetch');

async function test2FAEmail() {
  console.log('🧪 Testing 2FA Email System...\n');

  try {
    // Test sending 2FA code
    console.log('📧 Sending 2FA code...');
    const sendResponse = await fetch('http://localhost:3000/api/nimda1/send-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'caydiscreations@gmail.com'
      }),
    });

    const sendResult = await sendResponse.json();
    console.log('Send Response:', sendResult);

    if (sendResponse.ok) {
      console.log('✅ 2FA code sent successfully!');
      console.log('📧 Check your email: caydiscreations@gmail.com');
    } else {
      console.log('❌ Failed to send 2FA code:', sendResult.error);
    }

  } catch (error) {
    console.error('❌ Error testing 2FA email:', error);
  }
}

// Run the test
test2FAEmail(); 