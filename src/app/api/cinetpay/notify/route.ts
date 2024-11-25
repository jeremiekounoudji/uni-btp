import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// Define CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://checkout.cinetpay.com',  // Only allow CinetPay domain
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };

// Handle OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  // CinetPay pings this endpoint to verify availability
  return NextResponse.json(
    { message: 'Notification endpoint available' },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      cpm_trans_id,
      cpm_site_id,
      cpm_amount,
      cpm_currency,
      cpm_payment_date,
      cpm_payment_config,
      cpm_error_message,
      cpm_custom
    } = body;

    // Log the notification (optional but recommended)
    console.log('CinetPay Notification:', {
      transactionId: cpm_trans_id,
      amount: cpm_amount,
      status: cpm_error_message
    });

    // Update payment status in Firestore
    const paymentRef = doc(db, 'payments', cpm_trans_id);
    await updateDoc(paymentRef, {
      status: cpm_error_message === 'PAYMENT_SUCCESSFUL' ? 'completed' : 'failed',
      updatedAt: new Date().toISOString(),
      paymentDetails: {
        amount: cpm_amount,
        currency: cpm_currency,
        paymentDate: cpm_payment_date,
        paymentConfig: cpm_payment_config,
        metadata: cpm_custom
      }
    },);

    // Return 200 OK with CORS headers
    return NextResponse.json(
      { message: 'Notification processed' },
      { 
        status: 200,  // Always return 200 as required by CinetPay
        headers: corsHeaders 
      }
    );

  } catch (error) {
    console.error('CinetPay notification error:', error);
    // Return 200 with CORS headers even on error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 200, headers: corsHeaders }
    );
  }
} 