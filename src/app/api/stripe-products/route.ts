import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  // Add cache-busting headers to ensure fresh data
  const response = new NextResponse();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-06-30.basil',
    });
    
    // Fetch all active products with their default prices expanded
    const products = await stripe.products.list({ 
      active: true, 
      limit: 100,
      expand: ['data.default_price']
    });

    // Fetch all active prices for fallback
    const allPrices = await stripe.prices.list({ active: true, limit: 100 });
    const priceMap: Record<string, Stripe.Price> = {};
    for (const price of allPrices.data) {
      if (typeof price.product === 'string') {
        priceMap[price.product] = price;
      }
    }

    // Combine product and price info
    const result = products.data.map(product => {
      // Try to use default_price first, fallback to priceMap
      let price = product.default_price as Stripe.Price | null;
      if (!price) {
        price = priceMap[product.id];
      }
      
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        images: product.images && product.images.length > 0 ? product.images : null,
        price: price ? (Number(price.unit_amount_decimal) / 100) : null,
        currency: price ? price.currency : null,
        priceId: price ? price.id : null,
        metadata: product.metadata,
      };
    });

    // Sort products by display_order if available, otherwise by creation date
    result.sort((a, b) => {
      const orderA = a.metadata?.display_order ? parseInt(a.metadata.display_order) : 999;
      const orderB = b.metadata?.display_order ? parseInt(b.metadata.display_order) : 999;
      
      if (orderA !== 999 || orderB !== 999) {
        return orderA - orderB;
      }
      
      // Fallback to creation date if no display_order
      return 0;
    });

    const responseData = NextResponse.json({ 
      products: result,
      timestamp: new Date().toISOString(),
      source: "fresh_stripe_data"
    });
    
    // Set cache-busting headers
    responseData.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    responseData.headers.set("Pragma", "no-cache");
    responseData.headers.set("Expires", "0");
    
    return responseData;
  } catch (err) {
    console.error("stripe-products API error:", err);
    const errorResponse = NextResponse.json({ 
      error: "Failed to fetch Stripe products", 
      details: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
    // Set cache-busting headers for errors too
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return errorResponse;  }
}
