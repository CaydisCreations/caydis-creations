const { Resend } = require('resend');

const resend = new Resend('re_hutNTfXN_GxftHSG8R8x7wCe86bdGnnaZ');

async function manageDomains() {
  try {
    console.log('🔧 Managing Resend domains...\n');

    // 1. List domains first
    console.log('📋 1. Listing domains...');
    const domainsList = await resend.domains.list();
    console.log('📋 Domains:', JSON.stringify(domainsList, null, 2));
    
    if (domainsList?.data?.data && domainsList.data.data.length > 0) {
      const domain = domainsList.data.data[0]; // Get the first domain
      console.log(`\n🎯 Found domain: ${domain.name} (ID: ${domain.id})`);
      
      // 2. Verify domain
      console.log('\n✅ 2. Verifying domain...');
      try {
        const verifyResult = await resend.domains.verify(domain.id);
        console.log('📋 Verify result:', JSON.stringify(verifyResult, null, 2));
        console.log('✅ Domain verification initiated!');
      } catch (verifyError) {
        console.error('❌ Domain verification failed:', verifyError.message);
      }
      
      // 3. Update domain
      console.log('\n⚙️ 3. Updating domain...');
      try {
        const updateResult = await resend.domains.update({
          id: domain.id,
          openTracking: false,
          clickTracking: true,
        });
        console.log('📋 Update result:', JSON.stringify(updateResult, null, 2));
        console.log('✅ Domain updated successfully!');
      } catch (updateError) {
        console.error('❌ Domain update failed:', updateError.message);
      }
      
      // 4. List domains again to see changes
      console.log('\n📋 4. Listing domains again...');
      const domainsListAfter = await resend.domains.list();
      console.log('📋 Updated domains:', JSON.stringify(domainsListAfter, null, 2));
      
    } else {
      console.log('❌ No domains found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Full error:', error);
  }
}

manageDomains(); 