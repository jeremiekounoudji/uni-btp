"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { signOut, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
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
  Chip,
} from "@nextui-org/react";
import { toast } from "sonner";
import { FiEdit2, FiCreditCard, FiLock } from "react-icons/fi";
import { CINETPAY_CONFIG } from "@/lib/cinetpay";
import PaymentModal from "@/components/PaymentModal";
import { Settings } from "@/types/index";
import EditCompanyModal from "@/components/EditCompanyModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import AdhesionPaymentCard from "@/components/AdhesionPaymentCard";

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
  hasPayedAdhesion: boolean;
  adhesionPaymentDate?: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

export default function Dashboard() {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [adhesionAmount, setAdhesionAmount] = useState<number>(0);

  const { user, authLoading } = useAuth();
  const router = useRouter();

  // First useEffect for auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Load adhesion amount
  useEffect(() => {
    const loadAdhesionAmount = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "general"));
        console.log("Fetching adhesion amount");
        if (settingsDoc.exists()) {
          setAdhesionAmount(settingsDoc.data().adhesionAmount || 0);
        }
        console.log("Fetching adhesion amount done");
        console.log("Fetching adhesion amount value", adhesionAmount);
      } catch (error) {
        console.log("Fetching adhesion amount DEBUG LOG");
        console.log("Error loading adhesion amount:", error);
      }
    };
    loadAdhesionAmount();
  }, []);

  // reload user
  useEffect(() => {
    if (user) {
      const checkVerification = async () => {
        await user.reload();
      };
      checkVerification();
    }
  }, [user]);

  // Separate useEffect for data fetching
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Fetch company data
        console.log("Fetching company data");

        const companyDoc = await getDoc(doc(db, "companies", user.uid));
        console.log("Fetching company data");

        if (companyDoc.exists()) {
          setCompanyData({
            id: companyDoc.id,
            ...companyDoc.data(),
          } as Company);
        }
        console.log("Fetching company data");
        // Fetch settings
        console.log("Fetching settings");
        const settingsDoc = await getDoc(doc(db, "settings", "payments"));
        console.log("Fetching settings");
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as Settings);
        }
        // Fetch payments
        const paymentsQuery = query(
          collection(db, "transactions"),
          where("companyId", "==", user.uid)
        );
        console.log("Fetching payments");
        console.log("Fetching payments query", paymentsQuery);
        const paymentsSnapshot = await getDocs(paymentsQuery);
        console.log("Fetching payments done");

        const paymentsData = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Payment[];
        setPayments(paymentsData);
        console.log("Fetching payments done", paymentsData);
      } catch (err: any) {
        setError(err.message);
        console.log("Error loading data:", err);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to home page
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // Add this function to refresh company data after update
  const refreshCompanyData = async () => {
    if (!user) return;

    try {
      const companyDoc = await getDoc(doc(db, "companies", user.uid));
      if (companyDoc.exists()) {
        setCompanyData({ id: companyDoc.id, ...companyDoc.data() } as Company);
      }
    } catch (err) {
      toast.error("Error refreshing company data");
    }
  };

  // blackec company message
  if (!companyData?.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-2xl font-bold text-red-500">
            Compte Bloqué
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">
              Votre compte entreprise est actuellement bloqué. Veuillez
              contacter l&apos;administrateur pour plus d&apos;informations et
              pour résoudre ce problème.
            </p>
            <Button color="primary" className="mt-4" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!user.emailVerified) {
    const handleResendVerification = async () => {
      try {
        await sendEmailVerification(user);
        toast.success(
          `Email de vérification envoyé dans votre boite mail. Veuillez le confirmer.`
        );
      } catch (error: any) {
        toast.error("Email non envoyé. essayer plus tard.");
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-2xl font-bold text-amber-500">
            Email non vérifié
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 mb-4">
              Pour accéder au tableau de bord, veuillez vérifier votre adresse
              e-mail. Un e-mail de vérification a été envoyé à {user.email}.
            </p>
            <p className="text-gray-700 mb-4">
              Si vous n&apos;avez pas reçu l&apos;e-mail, vérifiez votre dossier
              spam ou cliquez sur le bouton ci-dessous pour renvoyer
              l&apos;e-mail.
            </p>
            <div className="flex gap-4">
              <Button color="primary" onClick={handleResendVerification}>
                Renvoyer l&apos;email de vérification
              </Button>
              <Button color="danger" variant="light" onClick={handleSignOut}>
                Déconnexion
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Add this check before the main dashboard content
  if (companyData && !companyData.hasPayedAdhesion) {
    return (
      <AdhesionPaymentCard
        companyId={companyData.id}
        adhesionAmount={adhesionAmount}
        companyName={companyData.companyName}
        onPaymentComplete={() => {
          setCompanyData((prev) =>
            prev ? { ...prev, hasPayedAdhesion: true } : null
          );
        }}
      />
      // <div className="min-h-screen bg-gray-50">
      //   <Navbar className="bg-white border-b">
      //     <NavbarBrand>
      //       <p className="font-bold text-inherit">UNIE-BTP</p>
      //     </NavbarBrand>
      //     <NavbarContent justify="end">
      //       <NavbarItem>
      //         <Button color="danger" variant="flat" onClick={handleSignOut}>
      //           Déconnexion
      //         </Button>
      //       </NavbarItem>
      //     </NavbarContent>
      //   </Navbar>

      //   <div className="max-w-7xl mx-auto px-4 py-8">

      //   </div>
      // </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar className="bg-white border-b">
        <NavbarBrand>
          <p className="font-bold text-inherit">UNIE-BTP</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button color="danger" variant="flat" onClick={handleSignOut}>
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
                <Avatar src="/company-logo.png" size="lg" />
                <div>
                  <h4 className="text-xl font-bold">
                    {companyData?.companyName}
                  </h4>
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
                <div>
                  <p className="text-sm text-gray-500 mb-2">Sécurité</p>
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<FiLock />}
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Changer le mot de passe
                  </Button>
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
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.amount} FCFA</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            payment.status === "successful"
                              ? "success"
                              : "warning"
                          }
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
      <EditCompanyModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        company={companyData}
        onUpdate={refreshCompanyData}
      />

      {/* Change Password Modal */}
      {/* <ChangePasswordModal
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
      /> */}
      <ForgotPasswordModal
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
      />
    </div>
  );
}
