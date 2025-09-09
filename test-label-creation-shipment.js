require('dotenv').config({ path: '.env.local' });
const ShipEngine = require('shipengine');

const shipengine = new ShipEngine(process.env.SHIPSTATION_API_KEY);

async function testLabelCreationShipment() {
  try {
    console.log('🧪 Testing Label Creation (Shipment Method)...\n');

    // Create a label directly from shipment details
    const shipmentDetails = {
      validateAddress: 'validate_and_clean', // Enable address validation
      shipFrom: {
        name: 'Caydi\'s Creations',
        addressLine1: '400 Boston Post Rd',
        cityLocality: 'Orange',
        stateProvince: 'CT',
        postalCode: '06477',
        countryCode: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
      },
      shipTo: {
        name: 'Test Customer',
        addressLine1: '123 Main St',
        cityLocality: 'New York',
        stateProvince: 'NY',
        postalCode: '10001',
        countryCode: 'US',
        phone: '123-456-7890',
        email: 'test@example.com',
      },
      packages: [{
        packageCode: 'package',
        weight: {
          value: 8,
          unit: 'ounce'
        },
        dimensions: {
          unit: 'inch',
          length: 10,
          width: 8,
          height: 4
        }
      }]
    };

    const CARRIER_IDS = [
      'se-3274580', // Stamps.com
      'se-3274584', // UPS
      'se-3274586', // FedEx
      'se-3274585'  // GlobalPost
    ];

    console.log('🏷️ Creating label from shipment details...');
    
    try {
      // Use createLabelFromShipmentDetails with carrier and service
      const label = await shipengine.createLabelFromShipmentDetails({
        rateOptions: {
          carrierIds: CARRIER_IDS
        },
        shipment: shipmentDetails,
        labelLayout: '4x6',
        labelFormat: 'pdf',
        displayScheme: 'label'
      });
      
      console.log('✅ Label created successfully!');
      console.log('📦 Label ID:', label.labelId);
      console.log('📦 Tracking Number:', label.trackingNumber);
      console.log('�� Carrier:', label.carrierCode);
      console.log('📦 Service:', label.serviceType);
      console.log('💰 Cost:', label.shippingAmount.amount, label.shippingAmount.currency);
      console.log('📥 Download URL:', label.labelDownload.pdf);
      
    } catch (labelError) {
      console.log('❌ Label creation failed:', labelError.message);
      console.log('📊 Error details:', labelError);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📊 Error details:', error);
  }
}

testLabelCreationShipment();
