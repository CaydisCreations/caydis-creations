require('dotenv').config({ path: '.env.local' });

async function testSecureAdmin() {
  console.log('🔐 Testing Secure Admin System...\n');

  // Test 1: Check if auth page is accessible
  console.log('1. Testing auth page accessibility...');
  try {
    const response = await fetch('http://localhost:3000/nimda1/auth');
    if (response.ok) {
      console.log('✅ Auth page is accessible');
    } else {
      console.log('❌ Auth page returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error accessing auth page:', error.message);
  }

  // Test 2: Check if dashboard is protected
  console.log('\n2. Testing dashboard protection...');
  try {
    const response = await fetch('http://localhost:3000/nimda1/dashboard');
    if (response.status === 401 || response.status === 403) {
      console.log('✅ Dashboard is properly protected');
    } else {
      console.log('⚠️ Dashboard returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing dashboard protection:', error.message);
  }

  // Test 3: Check if API endpoints are protected
  console.log('\n3. Testing API endpoint protection...');
  try {
    const response = await fetch('http://localhost:3000/api/nimda1/orders');
    if (response.status === 401) {
      console.log('✅ API endpoints are properly protected');
    } else {
      console.log('⚠️ API endpoint returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing API protection:', error.message);
  }

  // Test 4: Test with valid API key
  console.log('\n4. Testing with valid API key...');
  try {
    const response = await fetch('http://localhost:3000/api/nimda1/orders', {
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_API_KEY || 'nimda1-secure-key-2024'}`
      }
    });
    if (response.ok) {
      console.log('✅ API access with valid key successful');
    } else {
      console.log('⚠️ API with valid key returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing with valid API key:', error.message);
  }

  console.log('\n🎉 Secure Admin System Test Complete!');
  console.log('\n📋 What to test manually:');
  console.log('1. Visit http://localhost:3000/nimda1/auth');
  console.log('2. Try to access http://localhost:3000/nimda1/dashboard (should redirect to auth)');
  console.log('3. Sign in with Firebase credentials');
  console.log('4. Complete 2FA with code: 123456');
  console.log('5. Verify you can access the dashboard');
}

testSecureAdmin(); 