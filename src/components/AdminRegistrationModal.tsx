import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminRegistrationModal({ isOpen, onClose }: AdminRegistrationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      // First create the user in Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Then create the admin document
      try {
        console.log("userCredential.user.uid", userCredential.user.uid);
        console.log("start creating admin document",{
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            createdAt: new Date().toISOString(),
            role: 'admin'
          });
        
        await setDoc(doc(db, "admins", userCredential.user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
          role: 'admin'
        });
        console.log("admin document created");

        // Also create a minimal company document for this admin
        await setDoc(doc(db, "companies", userCredential.user.uid), {
          companyName: "Admin Account",
          email: formData.email,
          isAdmin: true,
          isActive: true,
          isAccepted: true,
          createdAt: new Date().toISOString()
        });

        toast.success("Compte administrateur créé avec succès");
        onClose();
        
        // Sign in with the new credentials and reload the page
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        window.location.reload(); // Force reload to ensure proper state reset
      } catch (error) {
        // If admin document creation fails, delete the auth user
        await userCredential.user.delete();
        throw error;
      }
    } catch (error: any) {
      console.log("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Cette adresse email est déjà utilisée");
      } else {
        setError("Une erreur s'est produite lors de la création du compte");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Créer un compte administrateur</ModalHeader>
          <ModalBody className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Input
              name="fullName"
              label="Nom complet"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="phone"
              type="tel"
              label="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button color="primary" type="submit" isLoading={loading}>
              Créer le compte
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
} 