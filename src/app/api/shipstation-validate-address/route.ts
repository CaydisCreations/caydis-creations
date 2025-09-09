import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHIPSTATION_API_KEY) {
      throw new Error('SHIPSTATION_API_KEY environment variable is not set');
    }
    
    const getShipStation = (await import('../../../../lib/shipstation-client.js')).default;
    const shipstation = getShipStation(process.env.SHIPSTATION_API_KEY);

    const { address } = await req.json();
    console.log('shipstation-validate-address: validating address:', address);
    
    if (!address) {
      throw new Error('No address provided');
    }

    // Convert address to ShipEngine format
    const addressToValidate = {
      name: address.name || '',
      addressLine1: address.line1 || address.addressLine1 || '',
      addressLine2: address.line2 || address.addressLine2 || '',
      cityLocality: address.city || address.cityLocality || '',
      stateProvince: address.state || address.stateProvince || '',
      postalCode: address.postal_code || address.postalCode || '',
      countryCode: address.country || address.countryCode || 'US',
      phone: address.phone || '',
      email: address.email || '',
    };

    console.log('shipstation-validate-address: formatted address:', addressToValidate);

    // Use ShipEngine's built-in address validation
    const validationResult = await shipstation.validateAddresses([addressToValidate]);
    
    console.log('shipstation-validate-address: validation result:', validationResult);

    if (!validationResult || validationResult.length === 0) {
      throw new Error('No validation result returned');
    }

    const result = validationResult[0];
    
    // Transform the result to match your frontend expectations
    const response = {
      isValid: result.status === 'verified',
      status: result.status,
      originalAddress: result.original_address,
      matchedAddress: result.matched_address,
      messages: result.messages || [],
      errors: [],
      suggestions: []
    };

    // Add user-friendly error messages and suggestions
    if (result.status === 'error') {
      response.errors.push('Address could not be validated');
      response.suggestions.push('Please check the address and try again');
    } else if (result.status === 'warning') {
      response.errors.push('Address has formatting issues');
      response.suggestions.push('Please verify the address is correct');
    } else if (result.status === 'unverified') {
      response.errors.push('Address could not be verified');
      response.suggestions.push('Please check the address format');
    }

    // Add specific messages from ShipEngine
    if (result.messages && result.messages.length > 0) {
      result.messages.forEach(message => {
        if (message.type === 'error') {
          response.errors.push(message.text);
        } else if (message.type === 'warning') {
          response.suggestions.push(message.text);
        }
      });
    }

    return NextResponse.json(response);

  } catch (err) {
    console.error('shipstation-validate-address: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
}
