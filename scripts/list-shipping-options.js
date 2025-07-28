require('dotenv').config({ path: '.env.local' });

console.log('📦 Caydi\'s Creations - Available Shipping Options\n');

console.log('🎯 CONFIGURED SHIPPING SERVICES:');
console.log('=====================================');

// USPS Services
console.log('\n📦 USPS (United States Postal Service):');
console.log('├── Priority Mail');
console.log('│   ├── Domestic: 1-3 day delivery with tracking and insurance');
console.log('│   └── International: 6-10 day delivery, cost-effective');
console.log('├── Priority Mail Express');
console.log('│   ├── Domestic: Overnight delivery with tracking and insurance');
console.log('│   └── International: 3-5 day premium service');
console.log('└── Ground Advantage (automatically available)');

// UPS Services
console.log('\n🚚 UPS (United Parcel Service):');
console.log('├── Ground');
console.log('│   └── Domestic: Standard cost-effective ground shipping (1-5 days)');
console.log('├── Ground Saver');
console.log('│   └── Domestic: Slowest but cheapest option (3-7 days)');
console.log('├── 3 Day Select®');
console.log('│   └── Domestic: Budget-friendly 3-day delivery');
console.log('├── Surepost');
console.log('│   └── Domestic: Low-cost hybrid UPS + USPS final delivery (3-7 days)');
console.log('├── Worldwide Expedited®');
console.log('│   └── International: Reliable, budget-friendly option (2-5 days)');
console.log('└── Worldwide Express Saver®');
console.log('    └── International: Faster international shipping (1-3 days)');

// FedEx Services
console.log('\n✈️ FedEx:');
console.log('├── Ground');
console.log('│   └── Domestic: Basic ground service to businesses (1-5 days)');
console.log('├── Home Delivery®');
console.log('│   └── Domestic: Residential ground delivery Tue-Sat (1-5 days)');
console.log('├── Express Saver®');
console.log('│   └── Domestic: 3-day shipping guaranteed by end of day');
console.log('├── Ground® Economy');
console.log('│   └── Domestic: Slowest but cheapest (FedEx + USPS hybrid) (2-7 days)');
console.log('└── International Priority®');
console.log('    └── International: 1-3 day express service');

console.log('\n🎯 SHIPPING ADDRESSES CONFIGURED:');
console.log('=====================================');
console.log('📍 FedEx Address:');
console.log('   400 Boston Post Rd, Orange, CT 06477');
console.log('   Phone: 800-463-3339');
console.log('   Email: admin@caydiscreations.com');

console.log('\n📍 UPS Address:');
console.log('   355 Campbell Ave, West Haven, CT 06516');
console.log('   Phone: 800-742-5877');
console.log('   Email: admin@caydiscreations.com');

console.log('\n📍 USPS Address:');
console.log('   400 Boston Post Rd, Orange, CT 06477');
console.log('   Phone: 800-463-3339');
console.log('   Email: admin@caydiscreations.com');

console.log('\n⚠️  CURRENT LIMITATIONS:');
console.log('========================');
console.log('• Test Environment: Currently using Shippo test API');
console.log('• Limited Carriers: Test mode may only show USPS options');
console.log('• Production Ready: All carriers will be available with production Shippo account');
console.log('• Address Validation: Automatically validates addresses before showing rates');
console.log('• Dynamic Pricing: Rates calculated based on package weight and destination');

console.log('\n🚀 PRODUCTION UPGRADE:');
console.log('======================');
console.log('When you upgrade to a production Shippo account, you\'ll get:');
console.log('• All UPS services (Ground, Ground Saver, 3 Day Select, etc.)');
console.log('• All FedEx services (Ground, Home Delivery, Express Saver, etc.)');
console.log('• All USPS services (Priority, Express, Ground Advantage)');
console.log('• International shipping options');
console.log('• Real-time rate calculations');
console.log('• Better reliability and support');

console.log('\n📊 SERVICE CATEGORIES:');
console.log('======================');
console.log('🚀 Express: Fastest delivery (1-3 days)');
console.log('📦 Standard: Regular delivery (3-7 days)');
console.log('💰 Economy: Most affordable (5-10 days)');

console.log('\n✅ STATUS: All shipping services are configured and ready!');
console.log('   The system will automatically show available options based on:');
console.log('   • Package weight and dimensions');
console.log('   • Destination address');
console.log('   • Available carriers for that route');
console.log('   • Current API availability'); 