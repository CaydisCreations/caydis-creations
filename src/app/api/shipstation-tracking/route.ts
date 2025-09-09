import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.SHIPSTATION_API_KEY) {
      throw new Error('SHIPSTATION_API_KEY environment variable is not set');
    }
    
    const getShipStation = (await import('../../../../lib/shipstation-client.js')).default;
    const shipstation = getShipStation(process.env.SHIPSTATION_API_KEY);

    const { searchParams } = new URL(req.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const carrierCode = searchParams.get('carrierCode');
    
    if (!trackingNumber) {
      return NextResponse.json({ error: 'Missing trackingNumber parameter' }, { status: 400 });
    }

    console.log('shipstation-tracking: tracking package:', { trackingNumber, carrierCode });

    // Use ShipEngine's tracking method
    const trackingInfo = await shipstation.getTrackingByCarrierCodeAndTrackingNumber({
      carrierCode: carrierCode || 'usps', // Default to USPS if not specified
      trackingNumber: trackingNumber
    });
    
    console.log('shipstation-tracking: tracking result:', trackingInfo);

    // Transform the result to match your frontend expectations
    const response = {
      trackingNumber: trackingInfo.trackingNumber,
      carrierCode: trackingInfo.carrierCode,
      status: trackingInfo.statusCode,
      statusDescription: trackingInfo.statusDescription,
      estimatedDeliveryDate: trackingInfo.estimatedDeliveryDate,
      actualDeliveryDate: trackingInfo.actualDeliveryDate,
      events: trackingInfo.events || [],
      isValid: true
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error('shipstation-tracking: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHIPSTATION_API_KEY) {
      throw new Error('SHIPSTATION_API_KEY environment variable is not set');
    }
    
    const getShipStation = (await import('../../../../lib/shipstation-client.js')).default;
    const shipstation = getShipStation(process.env.SHIPSTATION_API_KEY);

    const { trackingNumber, carrierCode } = await req.json();
    
    if (!trackingNumber) {
      throw new Error('Missing trackingNumber');
    }

    console.log('shipstation-tracking: starting tracking for:', { trackingNumber, carrierCode });

    // Start tracking updates using ShipEngine's method
    await shipstation.startTrackingUpdates({
      carrierCode: carrierCode || 'usps',
      trackingNumber: trackingNumber
    });
    
    console.log('shipstation-tracking: tracking started successfully');

    return NextResponse.json({
      success: true,
      message: 'Tracking updates started',
      trackingNumber: trackingNumber,
      carrierCode: carrierCode || 'usps'
    });

  } catch (err) {
    console.error('shipstation-tracking: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
}
