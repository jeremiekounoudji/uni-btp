import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@nextui-org/react";
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose 
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse e-mail");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Un e-mail de réinitialisation a été envoyé à votre adresse");
      onClose();
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error("Aucun compte n'est associé à cette adresse e-mail");
      } else {
        toast.error("Erreur lors de l'envoi de l'e-mail de réinitialisation");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Réinitialiser le mot de passe</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-600">
              Entrez votre adresse e-mail ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            <Input
              type="email"
              label="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={handleClose}
          >
            Annuler
          </Button>
          <Button 
            color="primary"
            onPress={handleSubmit}
            isLoading={loading}
          >
            Envoyer le lien
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 