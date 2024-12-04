'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CINETPAY_CONFIG } from '../lib/cinetpay';
import { doc, setDoc,updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Settings } from "@/types/index";





export default function PaymentModal({ isOpen, onClose, settings, companyData }: { isOpen: boolean, onClose: () => void, settings: any, companyData: any }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Check if script already exists
      const existingScript = document.getElementById('cinetpay-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'cinetpay-script';
        script.src = 'https://cdn.cinetpay.com/seamless/main.js';
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        document.head.appendChild(script);
      } else {
        setIsScriptLoaded(true);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      // Only remove script if it was dynamically added (not the one from layout)
      const script = document.querySelector('script#cinetpay-script:not([data-nscript])');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsScriptLoaded(false);
    };
  }, []);

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
        amount: settings.amount,
        currency: 'XOF',
        channels: 'ALL',
        description: `Cotisation ${companyData.companyName}`,
        customer_name: companyData.ceo.name,
        customer_surname: companyData.ceo.name.split(' ')[1] || '',
        customer_email: companyData.ceo.email,
        customer_phone_number: companyData.ceo.phone,
        customer_address: companyData.contact.address,
        customer_city: companyData.contact.city,
        customer_country: "CI",
        customer_state: companyData.contact.city,
        customer_zip_code: "",
      });

      window.CinetPay.waitResponse(async (data: any) => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            toast.error("Erreur d'authentification");
            return;
          }
      
          // Create payment document
         
          
      
          if (data.status === "ACCEPTED") {
            // create the transaction in the db if done
            const transactionRef = doc(db, 'transactions', data.transaction_id);
            await setDoc(transactionRef, {
              id: data.transaction_id,
              userId: currentUser.uid,
              status: data.status === "ACCEPTED" ? 'completed' : 'failed',
              dateTime: new Date().toISOString(),
              amount: data.amount,
              currency: data.currency,
              paymentMethod: data.payment_method || 'cinetpay',
              metadata: data.metadata || {},
              type: 'payment' // to distinguish from other types of transactions
            });
            console.log("check paymnt doc",transactionRef.id);

            // :update total payment
            const newTotal = (companyData.totalCotisation || 0) + settings.amount;
            await updateDoc(doc(db, 'companies', companyData.id), {
              totalCotisation: newTotal
            }, );
            // dsplay toast
            toast.success("Paiement réussi!");
          } else {
            toast.error("Le paiement a échoué");
          }
        } catch (error) {
          console.error('Payment recording error:', error);
          toast.error("Erreur lors de l'enregistrement du paiement");
        } finally {
          setIsProcessing(false);
          onClose();
        }
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