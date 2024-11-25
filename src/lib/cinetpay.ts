// CinetPay configuration
export const CINETPAY_CONFIG = {
  apikey: process.env.NEXT_PUBLIC_CINETPAY_API_KEY!,
  site_id: process.env.NEXT_PUBLIC_CINETPAY_SITE_ID!,
  notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/notify`,
  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
}; 