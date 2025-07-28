import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');
    
    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId parameter' }, { status: 400 });
    }

    if (!process.env.SHIPPO_API_KEY) {
      return NextResponse.json({ error: 'SHIPPO_API_KEY not configured' }, { status: 500 });
    }

    console.log('download-label: Fetching label for transaction:', transactionId);
    
    // Try the direct URL approach first
    const labelUrl = `https://api.goshippo.com/transactions/${transactionId}/label.pdf`;
    
    const response = await fetch(labelUrl, {
      headers: {
        'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('download-label: Failed to fetch label:', response.status, response.statusText);
      
      // If direct URL fails, try alternative endpoints
      const alternativeUrls = [
        `https://api.goshippo.com/transactions/${transactionId}/`,
        `https://api.goshippo.com/transactions/${transactionId}/label`,
        `https://api.goshippo.com/transactions/${transactionId}/label.pdf`
      ];
      
      for (const altUrl of alternativeUrls) {
        try {
          console.log(`download-label: Trying alternative URL: ${altUrl}`);
          const altResponse = await fetch(altUrl, {
            headers: {
              'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (altResponse.ok) {
            const pdfBuffer = await altResponse.arrayBuffer();
            console.log('download-label: Successfully fetched label via alternative URL, size:', pdfBuffer.byteLength, 'bytes');
            
            return new NextResponse(pdfBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="shipping-label-${transactionId}.pdf"`,
                'Cache-Control': 'no-cache'
              }
            });
          }
        } catch (altError) {
          console.log(`download-label: Alternative URL failed: ${altUrl}`, altError);
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch label from Shippo',
        status: response.status,
        details: response.statusText,
        message: 'Label may have expired or transaction may be invalid. Try recreating the label.'
      }, { status: response.status });
    }

    // Get the PDF content
    const pdfBuffer = await response.arrayBuffer();
    
    console.log('download-label: Successfully fetched label, size:', pdfBuffer.byteLength, 'bytes');

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="shipping-label-${transactionId}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('download-label: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 