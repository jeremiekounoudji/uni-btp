'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CINETPAY_CONFIG } from '../lib/cinetpay';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function PaymentModal({ isOpen, onClose, settings, companyData }: { isOpen: boolean, onClose: () => void, settings: any, companyData: any }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && !isScriptLoaded) {
      // Remove any existing CinetPay scripts
      const existingScript = document.querySelector('script[src*="cinetpay"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      // Create and load new script
      const loadScript = async () => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.cinetpay.com/seamless/main.js';
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            setIsScriptLoaded(true);
            resolve(true);
          };
          
          script.onerror = () => {
            reject(new Error('Failed to load CinetPay script'));
          };
          
          document.body.appendChild(script);
        });
      };

      loadScript().catch((error) => {
        console.log('Error loading CinetPay:', error);
        toast.error("Erreur lors du chargement du système de paiement");
      });
    }

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src*="cinetpay"]');
      if (script) {
        document.body.removeChild(script);
      }
      setIsScriptLoaded(false);
      
      // Reset CinetPay instance
      if (window.CinetPay) {
        delete window.CinetPay;
      }
    };
  }, [isOpen]);

  const handlePayment = async () => {
    if (!isScriptLoaded || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const transactionId = `TR${Date.now()}`;
      
      // Wait a bit to ensure CinetPay is fully initialized
      await new Promise(resolve => setTimeout(resolve, 500));

      window.CinetPay.setConfig({
        apikey: CINETPAY_CONFIG.apikey,
        site_id: CINETPAY_CONFIG.site_id,
        notify_url: CINETPAY_CONFIG.notify_url,
        mode: CINETPAY_CONFIG.mode,
      });

      window.CinetPay.getCheckout({
        transaction_id: transactionId,
        amount: 100,
        currency: 'XOF',
        channels: 'ALL',
        description: `Cotisation ${companyData.companyName}`,
        customer_name: companyData.ceo.name,
        customer_surname: companyData.ceo.name.split(' ')[1] || '',
        customer_email: companyData.ceo.email,
        customer_phone_number: companyData.ceo.phone,
        customer_address: companyData.contact.address,
        customer_city: companyData.contact.city,
        customer_country: "BJ",
        customer_state: companyData.contact.city,
        customer_zip_code: "",
      });

      window.CinetPay.waitResponse(async (data: any) => {
        if (data.status === "ACCEPTED") {
          // Handle success
          toast.success("Paiement réussi!");
        } else {
          toast.error("Le paiement a échoué");
        }
        setIsProcessing(false);
        onClose();
      });

      window.CinetPay.onError((error: any) => {
        console.log('CinetPay error:', error);
        toast.error("Erreur lors du paiement");
        setIsProcessing(false);
      });

      window.CinetPay.onClose(() => {
        setIsProcessing(false);
        onClose();
      });
    } catch (error) {
      console.log('Payment error:', error);
      toast.error("Erreur lors de l'initialisation du paiement");
      setIsProcessing(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
    >
      <ModalContent>
        <ModalHeader>Faire un paiement</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p>Montant à payer: {settings?.amount} FCFA</p>
            <p>Fréquence de paiement: {settings?.frequency}</p>
            <p>Date d'échéance: {settings?.dueDay}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            isDisabled={isProcessing}
          >
            Annuler
          </Button>
          <Button
            color="primary"
            onPress={handlePayment}
            isLoading={isProcessing}
            isDisabled={!isScriptLoaded || isProcessing}
          >
            {isProcessing ? "Traitement..." : "Continuer le paiement"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 