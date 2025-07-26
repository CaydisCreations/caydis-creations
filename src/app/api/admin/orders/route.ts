import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Simple in-memory cache (in production, use Redis or similar)
let ordersCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (ordersCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('admin/orders: Returning cached data');
      return NextResponse.json({ orders: ordersCache });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    
    // Get all checkout sessions (orders) with rate limiting and caching
    let sessions;
    try {
      sessions = await stripe.checkout.sessions.list({
        limit: 25, // Further reduced limit to avoid rate limits
        created: {
          gte: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000) // Last 30 days only
        }
      });
    } catch (stripeError: any) {
      if (stripeError.type === 'StripeRateLimitError') {
        console.log('admin/orders: Rate limit hit, returning cached data or empty array');
        return NextResponse.json({ 
          orders: [],
          message: 'Rate limit exceeded, please try again in a few minutes'
        });
      }
      throw stripeError;
    }

    // Transform sessions into orders with shipping info
    const orders = await Promise.all(sessions.data.map(async (session) => {
      // Get line items for this session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });

      return {
        id: session.id,
        customer: {
          name: session.customer_details?.name || 'N/A',
          email: session.customer_details?.email || session.customer_email || 'N/A',
          phone: session.customer_details?.phone,
        },
        shipping: {
          address: {
            line1: session.customer_details?.address?.line1 || '',
            line2: session.customer_details?.address?.line2 || '',
            city: session.customer_details?.address?.city || '',
            state: session.customer_details?.address?.state || '',
            postal_code: session.customer_details?.address?.postal_code || '',
            country: session.customer_details?.address?.country || '',
          },
        },
        amount_total: session.amount_total || 0,
        status: session.status,
        payment_status: session.payment_status,
        created: session.created,
        metadata: session.metadata || {},
        line_items: {
          data: lineItems.data.map(item => ({
            description: item.description || 'Unknown Item',
            quantity: item.quantity || 1,
            amount_total: item.amount_total || 0,
          })),
        },
      };
    }));

    // Sort by creation date (newest first)
    orders.sort((a, b) => b.created - a.created);

    // Update cache
    ordersCache = orders;
    cacheTimestamp = now;

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error('admin/orders: error:', err);
    return NextResponse.json({ 
      error: err.message, 
      details: err?.response?.body || err.stack 
    }, { status: 500 });
  }
} 