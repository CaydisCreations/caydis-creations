import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shipmentId = searchParams.get('shipmentId');
    
    if (!shipmentId) {
      return NextResponse.json({ error: 'Missing shipmentId parameter' }, { status: 400 });
    }

    if (!process.env.EASYPOST_API_KEY) {
      return NextResponse.json({ error: 'EASYPOST_API_KEY not configured' }, { status: 500 });
    }

    console.log('easypost-download-label: Fetching label for shipment:', shipmentId);
    
    const getEasyPost = (await import('../../../../lib/easypost-client.js')).default;
    const easypost = getEasyPost(process.env.EASYPOST_API_KEY);

    // Retrieve the shipment to get the label URL
    const shipment = await easypost.Shipment.retrieve(shipmentId);
    
    if (!shipment.postage_label) {
      return NextResponse.json({ 
        error: 'No label found for this shipment',
        message: 'Label may not have been purchased yet or may have expired.'
      }, { status: 404 });
    }

    // Get the label URL
    const labelUrl = shipment.postage_label.label_url;
    
    if (!labelUrl) {
      return NextResponse.json({ 
        error: 'Label URL not available',
        message: 'The label may have expired or the shipment may not be valid.'
      }, { status: 404 });
    }

    console.log('easypost-download-label: Label URL:', labelUrl);

    // Fetch the PDF from EasyPost
    const response = await fetch(labelUrl);

    if (!response.ok) {
      console.error('easypost-download-label: Failed to fetch label:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch label from EasyPost',
        status: response.status,
        details: response.statusText,
        message: 'Label may have expired or shipment may be invalid. Try recreating the label.'
      }, { status: response.status });
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer();
    
    console.log('easypost-download-label: Successfully fetched label, size:', pdfBuffer.byteLength, 'bytes');

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="shipping-label-${shipmentId}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('easypost-download-label: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 