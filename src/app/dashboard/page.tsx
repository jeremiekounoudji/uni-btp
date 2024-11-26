"use client";

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem,
  Button,
  Card, 
  CardBody,
  CardHeader,
  Avatar,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Spinner,
  Chip
} from "@nextui-org/react";
import { toast } from 'sonner';
import { FiEdit2, FiCreditCard } from 'react-icons/fi';
import { CINETPAY_CONFIG } from '@/lib/cinetpay';
import PaymentModal from '@/components/PaymentModal';

interface Company {
  id: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  foundedDate: string;
  isActive: boolean;
  isAccepted: boolean;
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
  createdAt: string;
  totalCotisation?: number;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

interface Settings {
  amount: number;
  frequency: string;
  dueDay: number;
}

export default function Dashboard() {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, authLoading } = useAuth();
  const router = useRouter();

  // First useEffect for auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Separate useEffect for data fetching
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        // Fetch company data
        const companyDoc = await getDoc(doc(db, 'companies', user.uid));
        if (companyDoc.exists()) {
          setCompanyData({ id: companyDoc.id, ...companyDoc.data() } as Company);
        }

        // Fetch payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('companyId', '==', user.uid)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const paymentsData = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
        setPayments(paymentsData);

        // Fetch settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'payments'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as Settings);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // Loading state
  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handlePayment = async () => {
    if (!settings || !companyData) return;
    
    try {
      const transactionId = `TR${Date.now()}`;
      
      // Initialize CinetPay
      CinetPay.setConfig({
        apikey: CINETPAY_CONFIG.apikey,
        site_id: CINETPAY_CONFIG.site_id,
        notify_url: CINETPAY_CONFIG.notify_url,
        mode: CINETPAY_CONFIG.mode,
      });

      // Start payment process
      CinetPay.getCheckout({
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
        customer_country: "BJ",
        customer_state: companyData.contact.city,
        customer_zip_code: "",
      });

      // Handle payment response
      CinetPay.waitResponse(async (data) => {
        if (data.status === "ACCEPTED") {
          try {
            // Update total cotisation
            const newTotal = (companyData.totalCotisation || 0) + settings.amount;
            await updateDoc(doc(db, 'companies', companyData.id), {
              totalCotisation: newTotal
            }, );

            // Add payment record
            await addDoc(collection(db, 'payments'), {
              companyId: companyData.id,
              amount: settings.amount,
              date: new Date().toISOString(),
              status: 'successful',
              transactionId,
            });

            toast.success("Paiement effectué avec succès");
            setShowPaymentModal(false);
           router.refresh();
          } catch (err) {
            console.log('Error updating payment data:', err);
            toast.error("Erreur lors de la mise à jour des données");
          }
        } else {
          toast.error("Le paiement a échoué");
        }
      });

      // Handle errors
      CinetPay.onError((error) => {
        console.log('CinetPay error:', error);
        toast.error("Erreur lors du paiement");
      });

      // Handle close
      CinetPay.onClose((data) => {
        if (data.status === "REFUSED") {
          toast.error("Paiement annulé");
        }
        setShowPaymentModal(false);
      });

    } catch (err) {
      console.log('Payment error:', err);
      toast.error("Erreur lors de l'initialisation du paiement");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="bg-white border-b">
        <NavbarBrand>
          <p className="font-bold text-inherit">UNIE-BTP</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button 
              color="danger" 
              variant="flat"
              onClick={handleSignOut}
            >
              Déconnexion
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Profile Card */}
          <Card className="p-4">
            <CardHeader className="flex justify-between">
              <div className="flex gap-3">
                <Avatar
                  src="/company-logo.png"
                  size="lg"
                />
                <div>
                  <h4 className="text-xl font-bold">{companyData?.companyName}</h4>
                  <p className="text-gray-500">{companyData?.contact.email}</p>
                </div>
              </div>
              <Button 
                isIconOnly
                variant="light"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 />
              </Button>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{companyData?.contact.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p>{companyData?.contact.website}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Information du CEO</p>
                  <p>{companyData?.ceo.name}</p>
                  <p>{companyData?.ceo.email}</p>
                  <p>{companyData?.ceo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Cotisation</p>
                  <p className="text-xl font-bold">
                    {companyData?.totalCotisation || 0} FCFA
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Payment Section */}
          <Card className="p-4">
            <CardHeader>
              <div className="flex justify-between w-full items-center">
                <h4 className="text-xl font-bold">Paiements</h4>
                <Button
                  color="primary"
                  startContent={<FiCreditCard />}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Payer la cotisation
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table aria-label="Payment history">
                <TableHeader>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>MONTANT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.amount} FCFA</TableCell>
                      <TableCell>
                        <Chip
                          color={payment.status === 'successful' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {payment.status}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        settings={settings}
        companyData={companyData}
      />

      {/* Edit Profile Modal */}
      {/* ... (Keep your existing edit modal code) ... */}
    </div>
  );
}
