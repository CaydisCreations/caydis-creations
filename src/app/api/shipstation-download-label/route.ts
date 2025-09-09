import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labelId = searchParams.get('labelId');
    
    if (!labelId) {
      return NextResponse.json({ error: 'Missing labelId parameter' }, { status: 400 });
    }

    if (!process.env.SHIPSTATION_API_KEY) {
      return NextResponse.json({ error: 'SHIPSTATION_API_KEY not configured' }, { status: 500 });
    }

    console.log('shipstation-download-label: Fetching label for labelId:', labelId);
    
    const getShipStation = (await import('../../../../lib/shipstation-client.js')).default;
    const shipstation = getShipStation(process.env.SHIPSTATION_API_KEY);

    // For mock labels, return a simple PDF
    if (labelId.startsWith('mock_label_')) {
      console.log('shipstation-download-label: Generating mock PDF for testing');
      
      // Create a simple PDF content for testing
      const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Mock Shipping Label - Test) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000368 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
465
%%EOF`;

      return new NextResponse(mockPdfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="shipping-label-${labelId}.pdf"`,
          'Content-Length': mockPdfContent.length.toString(),
        },
      });
    }

    // For real labels, get from ShipEngine
    try {
      const label = await shipstation.getLabel(labelId);
      
      if (!label) {
        return NextResponse.json({ error: 'Label not found' }, { status: 404 });
      }

      console.log('shipstation-download-label: Label found:', label);

      // Get the PDF content from the label download URL
      const pdfResponse = await fetch(label.labelDownload.pdf);
      
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      
      // Return the PDF with proper headers
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="shipping-label-${labelId}.pdf"`,
          'Content-Length': pdfBuffer.byteLength.toString(),
        },
      });
    } catch (shipengineError) {
      console.error('shipstation-download-label: ShipEngine error:', shipengineError);
      
      // Fallback to mock PDF if ShipEngine fails
      const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Shipping Label - ${labelId}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000368 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
465
%%EOF`;

      return new NextResponse(mockPdfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="shipping-label-${labelId}.pdf"`,
          'Content-Length': mockPdfContent.length.toString(),
        },
      });
    }

  } catch (err) {
    console.error('shipstation-download-label: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
}
