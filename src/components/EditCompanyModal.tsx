import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea
} from "@nextui-org/react";
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Company {
  id: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  foundedDate: string;
  contact: {
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    country: string;
  };
  ceo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onUpdate: () => void;
}

export default function EditCompanyModal({ 
  isOpen, 
  onClose, 
  company,
  onUpdate 
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState<Company | null>(company);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setFormData(company);
  }, [company]);

  if (!formData) return null;

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [section]: {
            ...(prev[section as keyof Company] as Record<string, string>),
            [key]: value
          }
        };
      });
    } else {
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value
        };
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    
    setLoading(true);
    try {
      const companyRef = doc(db, 'companies', formData.id);
      
      await updateDoc(companyRef, {
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        industry: formData.industry,
        foundedDate: formData.foundedDate,
        contact: {
          ...formData.contact,
          email: company?.contact.email // Keep original email
        },
        ceo: {
          ...formData.ceo,
          email: company?.ceo.email // Keep original email
        }
      });

      toast.success("Informations mises à jour avec succès");
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Modifier les informations</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Information de l&apos;entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom de l'entreprise"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
                <Input
                  label="Numéro d'enregistrement"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                />
                <Input
                  label="Identifiant fiscal"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                />
                <Input
                  label="Secteur d'activité"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                />
                <Input
                  label="Date de création"
                  type="date"
                  value={formData.foundedDate}
                  onChange={(e) => handleInputChange('foundedDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  value={formData.contact.email}
                  isReadOnly
                  isDisabled
                  description="L'email ne peut pas être modifié"
                />
                <Input
                  label="Téléphone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                />
                <Input
                  label="Site web"
                  value={formData.contact.website}
                  onChange={(e) => handleInputChange('contact.website', e.target.value)}
                />
                <Input
                  label="Ville"
                  value={formData.contact.city}
                  onChange={(e) => handleInputChange('contact.city', e.target.value)}
                />
                <Input
                  label="Pays"
                  value={formData.contact.country}
                  onChange={(e) => handleInputChange('contact.country', e.target.value)}
                />
                <Textarea
                  label="Adresse"
                  value={formData.contact.address}
                  onChange={(e) => handleInputChange('contact.address', e.target.value)}
                  className="md:col-span-2"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Information du CEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  value={formData.ceo.name}
                  onChange={(e) => handleInputChange('ceo.name', e.target.value)}
                />
                <Input
                  label="Email"
                  value={formData.ceo.email}
                  isReadOnly
                  isDisabled
                  description="L'email ne peut pas être modifié"
                />
                <Input
                  label="Téléphone"
                  value={formData.ceo.phone}
                  onChange={(e) => handleInputChange('ceo.phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
          >
            Annuler
          </Button>
          <Button 
            color="primary"
            onPress={handleSubmit}
            isLoading={loading}
          >
            Sauvegarder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 