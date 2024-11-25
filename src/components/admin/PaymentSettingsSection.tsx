import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { toast } from 'sonner';

interface PaymentSettings {
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  dueDay: number;
}

function PaymentSettingsSection() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'payments'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as PaymentSettings);
      } else {
        setSettings({
          amount: 0,
          frequency: 'monthly',
          dueDay: 1
        });
      }
    } catch (error) {
      toast.error('Failed to load payment settings');
      setSettings({
        amount: 0,
        frequency: 'monthly',
        dueDay: 1
      });
    }
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const settingsData = {
        amount: settings.amount,
        frequency: settings.frequency,
        dueDay: settings.dueDay,
        updatedAt: new Date().toISOString()
      };
      
      const promise = setDoc(doc(db, 'settings', 'payments'), settingsData, { merge: true });
      
      toast.promise(promise, {
        loading: 'Updating settings...',
        success: 'Payment settings updated successfully',
        error: 'Failed to update payment settings'
      });

      await promise;
    } catch (error) {
      console.log('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Paramètres de cotisation</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <Input
          type="number"
          label="Montant a payer (FCFA)"
          value={settings.amount?.toString() || "0"}
          onChange={(e) => setSettings({ ...settings, amount: Number(e.target.value) })}
          min={0}
        />

        <Select
          label="Fréquence de paiement"
          selectedKeys={[settings.frequency]}
          onChange={(e) => setSettings({ ...settings, frequency: e.target.value as PaymentSettings['frequency'] })}
        >
          <SelectItem key="monthly" value="monthly">Mensuel</SelectItem>
          <SelectItem key="quarterly" value="quarterly">Trimestriel</SelectItem>
          <SelectItem key="annually" value="annually">Annuel</SelectItem>
        </Select>

        <Input
          type="number"
          label="Jour de paiement"
          value={settings.dueDay?.toString() || "1"}
          onChange={(e) => setSettings({ ...settings, dueDay: Number(e.target.value) })}
          min={1}
          max={31}
        />

        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          className="w-full"
        >
          Enregistrer les paramètres
        </Button>
      </form>
    </div>
  );
}

export default PaymentSettingsSection; 