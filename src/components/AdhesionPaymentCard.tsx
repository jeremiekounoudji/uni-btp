import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { CINETPAY_CONFIG } from '@/lib/cinetpay';
import { auth } from '@/lib/firebase';

interface AdhesionPaymentCardProps {
  companyId: string;
  adhesionAmount: number;
  companyName: string;
  onPaymentComplete: () => void;
}

export default function AdhesionPaymentCard({ 
  companyId, 
  adhesionAmount,
  companyName,
  onPaymentComplete 
}: AdhesionPaymentCardProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);


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

//   qyuddyufgoqduf
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsProcessing(true);

    try {
      window.CinetPay.setConfig({
            apikey: CINETPAY_CONFIG.apikey,
            site_id: CINETPAY_CONFIG.site_id,
            notify_url: CINETPAY_CONFIG.notify_url,
            mode: CINETPAY_CONFIG.mode,
          });
      const paymentData = {
        transaction_id: `${companyId}-${Date.now()}`,
        amount: adhesionAmount,
        currency: 'XOF',
        channels: 'ALL',
        description: `Paiement d'adhésion pour ${companyName}`,
      };

      window.CinetPay.getCheckout(paymentData);

      window.CinetPay.waitResponse(async (data: any) => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            toast.error("Erreur d'authentification");
            return;
          }
      
         
      
          if (data.status === "ACCEPTED") {
            // create the transaction in the db if done
            await updateDoc(doc(db, 'companies', companyId), {
                hasPayedAdhesion: true,
                adhesionPaymentDate: new Date().toISOString()
              });
              
              toast.success("Paiement effectué avec succès");
              onPaymentComplete();}
        } catch (error) {
        //   console.log('Payment recording error:', error);
          toast.error("Erreur lors de l'enregistrement du paiement");
        } finally {

         
        }
      });

      
      
    } catch (error) {
      console.log('Payment initialization error:', error);
      toast.error("Erreur lors de l'initialisation du paiement");
    }
  };

  return (
    <Modal 
      isOpen={true} 
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="z-[1000]"
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-warning-600">
            Paiement d&apos;adhésion requis
          </h3>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-4">
            <div className="p-4 bg-warning-50 rounded-lg">
              <p className="text-warning-700">
                Pour accéder au tableau de bord et aux fonctionnalités de l&apos;application, 
                vous devez d&apos;abord payer les frais d&apos;adhésion.
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold">Détails du paiement:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Montant: {adhesionAmount.toLocaleString()} FCFA</li>
                <li>Paiement unique</li>
                <li>Accès immédiat après paiement</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button
                color="primary"
                onPress={handlePayment}
                className="w-full"
                size="lg"
                isLoading={isProcessing}
                isDisabled={!isScriptLoaded || isProcessing}
              >
                Procéder au paiement
              </Button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Ce paiement est sécurisé via CinetPay
              </p>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 