declare const CinetPay: {
  setConfig: (config: any) => void;
  getCheckout: (data: any) => void;
  waitResponse: (callback: (data: any) => void) => void;
  onError: (callback: (error: any) => void) => void;
  onClose: (callback: (data: any) => void) => void;
}; 