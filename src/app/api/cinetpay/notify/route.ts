import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // CinetPay pings this endpoint to verify availability
  return NextResponse.json({ message: 'Notification endpoint available' });
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
    });

    // Return 200 OK as required by CinetPay
    return NextResponse.json({ message: 'Notification processed' });

  } catch (error) {
    console.error('CinetPay notification error:', error);
    // Still return 200 to acknowledge receipt
    return NextResponse.json({ error: 'Internal server error' }, { status: 200 });
  }
} 