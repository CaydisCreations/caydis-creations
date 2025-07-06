import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('=== TEST WEBHOOK ENDPOINT CALLED ===')
  console.log('Headers:', Object.fromEntries(req.headers.entries()))
  
  try {
    const body = await req.text()
    console.log('Body:', body)
    
    // Try to parse as JSON
    try {
      const jsonBody = JSON.parse(body)
      console.log('Parsed JSON:', JSON.stringify(jsonBody, null, 2))
    } catch (e) {
      console.log('Body is not valid JSON')
    }
    
  } catch (error) {
    console.error('Error reading body:', error)
  }
  
  return NextResponse.json({ 
    received: true, 
    timestamp: new Date().toISOString(),
    message: 'Test webhook endpoint working'
  })
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test webhook endpoint is running',
    timestamp: new Date().toISOString()
  })
} 