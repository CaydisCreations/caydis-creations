import { NextRequest, NextResponse } from 'next/server';
const ShipStation = require('../../../../lib/shipstation-client.js');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerDetails, lineItems } = body;

    console.log('shipstation-shipping-labels: Request body:', body);

    if (!orderId || !customerDetails || !lineItems) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const shipstation = ShipStation(process.env.SHIPSTATION_API_KEY);

    // Calculate total parcel weight and dimensions
    const parcel = {
      weight: lineItems.reduce((total: number, item: any) => {
        const weight = parseFloat(item.parcel_weight_oz) || 8;
        return total + (weight * (item.quantity || 1));
      }, 0),
      length: Math.max(...lineItems.map((item: any) => parseFloat(item.parcel_length) || 10)),
      width: Math.max(...lineItems.map((item: any) => parseFloat(item.parcel_width) || 8)),
      height: lineItems.reduce((total: number, item: any) => {
        const height = parseFloat(item.parcel_height) || 4;
        return total + (height * (item.quantity || 1));
      }, 0)
    };

    console.log('shipstation-shipping-labels: Calculated parcel:', parcel);

    // Your warehouse addresses
    const FROM_ADDRESSES = [
      {
        name: 'Caydi\'s Creations',
        addressLine1: '400 Boston Post Rd',
        cityLocality: 'Orange',
        stateProvince: 'CT',
        postalCode: '06477',
        countryCode: 'US',
        phone: '800-463-3339',
        email: 'admin@caydiscreations.com',
      }
    ];

    const toAddress = {
      name: customerDetails.name,
      addressLine1: customerDetails.address.line1,
      addressLine2: customerDetails.address.line2 || '',
      cityLocality: customerDetails.address.city,
      stateProvince: customerDetails.address.state,
      postalCode: customerDetails.address.postal_code,
      countryCode: customerDetails.address.country || 'US',
      phone: customerDetails.phone || '',
      email: customerDetails.email || '',
    };

    console.log('shipstation-shipping-labels: To address:', toAddress);

    // Your connected carrier IDs
    const CARRIER_IDS = [
      'se-3274580' // USPS (working)
    ];

    let bestRate = null;
    let bestWarehouse = null;

    // Get rates from all warehouses and find the best one
    for (const [index, fromAddress] of FROM_ADDRESSES.entries()) {
      try {
        console.log(`shipstation-shipping-labels: Getting rates from warehouse ${index + 1}:`, fromAddress);
        
        const rates = await shipstation.getRatesWithShipmentDetails({
          rateOptions: {
            carrierIds: CARRIER_IDS // Use your specific carrier IDs
          },
          shipment: {
            validateAddress: 'no_validation',
            shipFrom: fromAddress,
            shipTo: toAddress,
            packages: [{
              packageCode: 'package',
              weight: {
                value: parcel.weight,
                unit: 'ounce'
              },
              dimensions: {
                unit: 'inch',
                length: parcel.length,
                width: parcel.width,
                height: parcel.height
              }
            }]
          }
        });

        if (rates.rateResponse?.rates && rates.rateResponse.rates.length > 0) {
          const validRates = rates.rateResponse.rates.filter(rate => rate && !rate.errorMessages?.length);
          if (validRates.length > 0) {
            const cheapestRate = validRates.sort((a, b) => 
              parseFloat(a.shippingAmount.amount) - parseFloat(b.shippingAmount.amount)
            )[0];

            if (!bestRate || parseFloat(cheapestRate.shippingAmount.amount) < parseFloat(bestRate.shippingAmount.amount)) {
              bestRate = cheapestRate;
              bestWarehouse = fromAddress;
            }
          }
        }
      } catch (err) {
        console.error(`shipstation-shipping-labels: Error getting rates from warehouse ${index + 1}:`, err);
      }
    }

    // If no real rates found, return error
    if (!bestRate || !bestWarehouse) {
      return NextResponse.json({ 
        error: 'No shipping rates available for this address. Please check your address and try again.',
        no_rates_available: true
      }, { status: 400 });
    }

    console.log('shipstation-shipping-labels: Best rate found:', bestRate.serviceType, '$' + bestRate.shippingAmount.amount);
    console.log('shipstation-shipping-labels: Using serviceCode:', bestRate.serviceCode);
    console.log('shipstation-shipping-labels: Using carrierId:', bestRate.carrierId);

    // Create the label using the WORKING format
    const label = await shipstation.createLabelFromShipmentDetails({
      shipment: {
        carrierId: bestRate.carrierId,
        serviceCode: bestRate.serviceCode,
        shipFrom: bestWarehouse,
        shipTo: toAddress,
        packages: [{
          weight: {
            value: parcel.weight,
            unit: 'ounce'
          },
          dimensions: {
            unit: 'inch',
            length: parcel.length,
            width: parcel.width,
            height: parcel.height
          }
        }]
      },
      labelLayout: '4x6',
      labelFormat: 'pdf'
    });

    console.log('shipstation-shipping-labels: Label created successfully:', label.labelId);

    // Create tracking info in the format expected by your email system
    const trackingInfo = [{
      productName: lineItems.map((item: any) => item.name || item.description || 'Product').join(', '),
      trackingNumber: label.trackingNumber,
      carrier: label.carrierCode.toLowerCase(),
    }];

    // Create shipping labels info (for admin emails)
    const shippingLabels = [{
      p: lineItems.map((item: any) => (item.name || item.description || 'Product').substring(0, 20)).join(', '),
      t: label.trackingNumber,
      c: label.carrierCode.toLowerCase(),
      u: label.labelId,
    }];

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Shipping label created successfully',
      orderId,
      tracking: trackingInfo,
      shippingLabels: shippingLabels,
      labelId: label.labelId,
      trackingNumber: label.trackingNumber,
      carrier: label.carrierCode,
      service: label.serviceType || bestRate.serviceType,
      cost: label.shipmentCost.amount,
      downloadUrl: label.labelDownload.pdf,
      labelDownloadPdf: label.labelDownload.pdf,
      labelDownloadPng: label.labelDownload.png || '',
      labelDownloadZpl: label.labelDownload.zpl || '',
    });

  } catch (error) {
    console.error('shipstation-shipping-labels: Error creating label:', error);
    
    return NextResponse.json({
      error: 'Failed to create shipping label',
      details: error.message,
      orderId: null,
      tracking: [],
      shippingLabels: []
    }, { status: 500 });
  }
}
