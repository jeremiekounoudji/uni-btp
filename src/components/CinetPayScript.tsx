'use client';

import Script from 'next/script';

export default function CinetPayScript() {
  return (
    <Script
      src="https://cdn.cinetpay.com/seamless/main.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('CinetPay script loaded successfully');
      }}
      onError={(e) => {
        console.error('Error loading CinetPay script:', e);
      }}
    />
  );
} 