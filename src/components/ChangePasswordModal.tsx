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
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ 
  isOpen, 
  onClose 
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    // setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!auth.currentUser?.email) {
      toast.error("Utilisateur non connecté");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      // Reauthenticate user
    //   const credential = EmailAuthProvider.credential(
    //     auth.currentUser.email,
    //     currentPassword
    //   );
    //   await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      toast.success("Mot de passe mis à jour avec succès");
      handleClose();
    } catch (error: any) {
      console.log('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error("Le mot de passe actuel est incorrect");
      } else {
        toast.error("Erreur lors de la mise à jour du mot de passe");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Changer le mot de passe</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* <Input
              type={showPassword ? "text" : "password"}
              label="Mot de passe actuel"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            /> */}
            <Input
              type={showPassword ? "text" : "password"}
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type={showPassword ? "text" : "password"}
              label="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label htmlFor="showPassword" className="text-sm">
                Afficher les mots de passe
              </label>
            </div>
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
            Changer le mot de passe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 