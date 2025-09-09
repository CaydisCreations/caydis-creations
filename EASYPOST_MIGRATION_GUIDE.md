# EasyPost Migration Guide

## Overview
This guide will help you migrate from Shippo to EasyPost for your Caydi's Creations e-commerce shipping needs.

## What's Been Created

### ✅ New EasyPost Files:
1. **`lib/easypost-client.js`** - EasyPost client wrapper
2. **`src/app/api/easypost-shipping-rates/route.ts`** - Shipping rates API
3. **`src/app/api/easypost-shipping-labels/route.ts`** - Label generation API
4. **`src/app/api/easypost-download-label/route.ts`** - Label download API
5. **`test-easypost.js`** - Test script for EasyPost integration

### ✅ EasyPost SDK Installed:
- `@easypost/api` package added to dependencies

## Step-by-Step Migration

### 1. Get Your EasyPost API Key
1. Go to [easypost.com](https://www.easypost.com)
2. Sign up for an account
3. Go to **Account Settings** → **API Keys**
4. Copy your **Test API Key** (start with this for testing)

### 2. Update Environment Variables
Add to your `.env.local` file:
```bash
# EasyPost Configuration
EASYPOST_API_KEY=your_test_api_key_here

# Keep your existing Shippo key for now (we'll remove it later)
SHIPPO_API_KEY=your_existing_shippo_key
```

### 3. Test EasyPost Integration
```bash
# Set your API key temporarily
export EASYPOST_API_KEY=your_test_api_key_here

# Run the test script
node test-easypost.js
```

### 4. Update Frontend Code
You'll need to update your frontend to use the new EasyPost endpoints:

#### Update Cart Page (`src/app/cart/page.tsx`):
```javascript
// Change this line:
const response = await fetch('/api/shipping-rates', {

// To this:
const response = await fetch('/api/easypost-shipping-rates', {
```

#### Update Stripe Webhook (`src/app/api/stripe-webhook/route.ts`):
```javascript
// Change this line:
const labelResponse = await fetch(`${req.nextUrl.origin}/api/shipping-labels`, {

// To this:
const labelResponse = await fetch(`${req.nextUrl.origin}/api/easypost-shipping-labels`, {
```

#### Update Admin Dashboard:
```javascript
// Change this line:
const labelResponse = await fetch('/api/download-label?transactionId=' + transactionId, {

// To this:
const labelResponse = await fetch('/api/easypost-download-label?shipmentId=' + shipmentId, {
```

### 5. Test the Migration
1. **Test shipping rates** - Add items to cart and check shipping
2. **Test label generation** - Complete a test order
3. **Test label downloads** - Download labels from admin dashboard
4. **Test tracking** - Verify tracking numbers work

### 6. Switch to Production
1. Get your **Production API Key** from EasyPost
2. Update `EASYPOST_API_KEY` in your environment
3. Test with a real order
4. Monitor for any issues

### 7. Clean Up (After Confirmation)
1. Remove Shippo dependencies:
   ```bash
   npm uninstall shippo
   ```
2. Delete old Shippo files:
   - `lib/shippo-client.cjs`
   - `src/app/api/shipping-rates/route.ts`
   - `src/app/api/shipping-labels/route.ts`
   - `src/app/api/download-label/route.ts`
   - `src/app/api/shippo-webhook/route.ts`
   - `test-shippo.js`
3. Remove `SHIPPO_API_KEY` from environment variables

## Key Differences Between Shippo and EasyPost

### API Structure:
| Shippo | EasyPost |
|--------|----------|
| `shippo.shipments.create()` | `easypost.Shipment.create()` |
| `shippo.transactions.create()` | `easypost.Shipment.buy()` |
| `transaction.trackingNumber` | `shipment.tracking_code` |
| `transaction.objectId` | `shipment.id` |

### Rate Format:
| Shippo | EasyPost |
|--------|----------|
| `rate.amount` | `rate.rate` |
| `rate.provider` | `rate.carrier` |
| `rate.servicelevel.name` | `rate.service` |

### Label Access:
| Shippo | EasyPost |
|--------|----------|
| Direct URL construction | `shipment.postage_label.label_url` |

## Troubleshooting

### Common Issues:

1. **"No rates available"**
   - Check parcel dimensions and weight
   - Verify addresses are valid
   - Ensure EasyPost API key is correct

2. **"Label not found"**
   - Shipment may not have been purchased
   - Label may have expired
   - Check shipment ID is correct

3. **"API key not configured"**
   - Verify `EASYPOST_API_KEY` is set in environment
   - Check for typos in the API key

### Testing Commands:
```bash
# Test EasyPost API directly
node test-easypost.js

# Test shipping rates endpoint
curl -X POST http://localhost:3000/api/easypost-shipping-rates \
  -H "Content-Type: application/json" \
  -d '{"address": {...}, "cartItems": [...]}'

# Test label generation
curl -X POST http://localhost:3000/api/easypost-shipping-labels \
  -H "Content-Type: application/json" \
  -d '{"orderId": "...", "customerDetails": {...}, "lineItems": [...]}'
```

## Support

- **EasyPost Documentation**: [https://www.easypost.com/docs](https://www.easypost.com/docs)
- **EasyPost Support**: Available through their dashboard
- **API Status**: [https://status.easypost.com](https://status.easypost.com)

## Rollback Plan

If you need to rollback to Shippo:
1. Keep your old Shippo files until migration is confirmed
2. Simply change the API endpoints back to Shippo versions
3. Restore `SHIPPO_API_KEY` environment variable
4. Test thoroughly before removing EasyPost code

---

**Migration Status**: ✅ Ready to begin
**Estimated Time**: 1-2 hours for complete migration
**Risk Level**: Low (parallel implementation) 