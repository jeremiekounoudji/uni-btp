"use client";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
  FiRefreshCw,
  FiSettings,
} from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { CircularProgress } from "@nextui-org/react";
import PaymentSection from "@/components/admin/PaymentSection";
import UnacceptedCompaniesSection from "@/components/admin/UnacceptedCompaniesSection";
import BlockedCompaniesSection from "@/components/admin/BlockedCompaniesSection";
import TransactionsSection from "@/components/admin/TransactionsSection";
import PaymentSettingsSection from "@/components/admin/PaymentSettingsSection";
import CompaniesSection from "@/components/admin/CompaniesSection";
import Sidebar from "@/components/admin/Sidebar";

interface Company {
  id: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  foundedDate: string;
  isActive: boolean;
  isAccepted: boolean;
  // Contact Details
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;

  // CEO/Owner Information
  ceoName: string;
  ceoEmail: string;
  ceoPhone: string;

  // Account Credentials
  password: string;
  confirmPassword: string;
  // Add other relevant fields
}

type PaymentStatus = "paid" | "pending" | "overdue";

interface CompanyPayment {
  companyId: string;
  companyName: string;
  ceoEmail: string;
  status: PaymentStatus;
  amount: number;
  dueDate: string;
  paidDate?: string;
}

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [blockedCompanies, setBlockedCompanies] = useState<Company[]>([]);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [unacceptedCompanies, setUnacceptedCompanies] = useState<Company[]>([]);

  // refresh variables
  const [refreshingCompanies, setRefreshingCompanies] = useState(false);
  const [refreshingTransactions, setRefreshingTransactions] = useState(false);
  const [refreshingBlocked, setRefreshingBlocked] = useState(false);
  const [refreshingUnaccepted, setRefreshingUnaccepted] = useState(false);

  const router = useRouter();
  const auth = getAuth();
  const [companiesCount, setCompaniesCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [blockedCompaniesCount, setBlockedCompaniesCount] = useState(0);
  const [unacceptedCompaniesCount, setUnacceptedCompaniesCount] = useState(0);
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payments, setPayments] = useState<CompanyPayment[]>([]);
  const [refreshingPayments, setRefreshingPayments] = useState(false);
  const [reminderLoading, setReminderLoading] = useState<string | null>(null);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  const fetchCompanies = async () => {
    try {
      setRefreshingCompanies(true);
      const q = query(
        collection(db, "companies"),
        where("isAccepted", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const acceptedCompanies: Company[] = [];
      querySnapshot.forEach((doc) => {
        acceptedCompanies.push({ id: doc.id, ...doc.data() } as Company);
      });
      setCompanies(acceptedCompanies);
      setRefreshingCompanies(false);
    } catch (err) {
      setError("Failed to load companies");
      setRefreshingCompanies(false);
    } finally {
      setLoading(false);
      setRefreshingCompanies(false);
    }
  };
  const fetchBlockedCompanies = async () => {
    try {
      setRefreshingBlocked(true);
      const q = query(
        collection(db, "companies"),
        where("isActive", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const blockedData: Company[] = [];
      querySnapshot.forEach((doc) => {
        blockedData.push({ id: doc.id, ...doc.data() } as Company);
      });
      setBlockedCompanies(blockedData);
      setRefreshingBlocked(false);
    } catch (err) {
      setError("Failed to load blocked companies");
      setRefreshingBlocked(false);
    }
  };
  // const fetchTransactions = async () => {
  //   try {
  //     setRefreshingTransactions(true);
  //     const querySnapshot = await getDocs(collection(db, "transactions"));
  //     const transactionData: any[] = [];
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       const formattedDate = new Intl.DateTimeFormat("en-US", {
  //         year: "numeric",
  //         month: "long",
  //         day: "numeric",
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //         hour12: true,
  //       }).format(new Date(data.dateTime));

  //       transactionData.push({ id: doc.id, ...data, dateTime: formattedDate });
  //     });
  //     setTransactions(transactionData);
  //     setRefreshingTransactions(false);
  //   } catch (err) {
  //     setError("Failed to load transactions");
  //     setRefreshingTransactions(false);
  //   }
  // };
  // fetchUnacceptedCompanies
  const fetchUnacceptedCompanies = async () => {
    try {
      setRefreshingUnaccepted(true);
      const q = query(
        collection(db, "companies"),
        where("isAccepted", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const unacceptedData: Company[] = [];
      querySnapshot.forEach((doc) => {
        unacceptedData.push({ id: doc.id, ...doc.data() } as Company);
      });
      setUnacceptedCompanies(unacceptedData);
      setRefreshingUnaccepted(false);
    } catch (err) {
      setError("Failed to load unaccepted companies");
      setRefreshingUnaccepted(false);
    }
  };

  const toggleCompanyStatus = async (companyId: string, isActive: boolean) => {
    setToggleLoading(companyId);
    try {
      await updateDoc(doc(db, "companies", companyId), { isActive: !isActive });
      setBlockedCompanies((prev) =>
        prev.filter((company) => company.id !== companyId)
      );
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? { ...company, isActive: !isActive }
            : company
        )
      );
      await getCounts();
    } catch (err) {
      setError("Failed to update company status");
    } finally {
      setToggleLoading(null);
    }
  };

  const deleteCompany = async (companyId: string) => {
    setDeleteLoading(companyId);
    try {
      await deleteDoc(doc(db, "companies", companyId));
      setCompanies((prev) =>
        prev.filter((company) => company.id !== companyId)
      );
      await getCounts();
    } catch (err) {
      setError("Failed to delete company");
    } finally {
      setDeleteLoading(null);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  useEffect(() => {
    fetchBlockedCompanies();
  }, []);

  useEffect(() => {
    fetchUnacceptedCompanies();
  }, []);

  const getCounts = async () => {
    try {
      const companiesQuery = query(
        collection(db, "companies"),
        where("isAccepted", "==", true)
      );
      const companiesSnapshot = await getCountFromServer(companiesQuery);
      setCompaniesCount(companiesSnapshot.data().count);

      const transactionsQuery = collection(db, "transactions");
      const transactionsSnapshot = await getCountFromServer(transactionsQuery);
      setTransactionsCount(transactionsSnapshot.data().count);

      const blockedCompaniesQuery = query(
        collection(db, "companies"),
        where("isActive", "==", false)
      );
      const blockedCompaniesSnapshot = await getCountFromServer(
        blockedCompaniesQuery
      );
      setBlockedCompaniesCount(blockedCompaniesSnapshot.data().count);

      const unacceptedCompaniesQuery = query(
        collection(db, "companies"),
        where("isAccepted", "==", false)
      );
      const unacceptedCompaniesSnapshot = await getCountFromServer(
        unacceptedCompaniesQuery
      );
      setUnacceptedCompaniesCount(unacceptedCompaniesSnapshot.data().count);
    } catch (err) {
      console.error("Failed to get counts:", err);
      setCompaniesCount(0);
      setTransactionsCount(0);
      setBlockedCompaniesCount(0);
      setUnacceptedCompaniesCount(0);
    }
  };

  useEffect(() => {
    getCounts();
  }, []);

  // const fetchPayments = useCallback(async () => {
  //   setRefreshingPayments(true);
  //   try {
  //     const q = query(
  //       collection(db, 'payments'),
  //       where('year', '==', selectedYear),
  //       where('month', '==', selectedMonth)
  //     );

  //     const snapshot = await getDocs(q);
  //     const paymentData: CompanyPayment[] = [];

  //     snapshot.forEach((doc) => {
  //       paymentData.push(doc.data() as CompanyPayment);
  //     });

  //     setPayments(paymentData);
  //     setPendingPaymentsCount(
  //       paymentData.filter(p => p.status !== 'paid').length
  //     );
  //   } catch (err) {
  //     setError('Failed to load payments');
  //   } finally {
  //     setRefreshingPayments(false);
  //   }
  // }, [selectedMonth, selectedYear]);

  // const sendReminder = async (companyId: string) => {
  //   setReminderLoading(companyId);
  //   try {
  //     const company = payments.find(p => p.companyId === companyId);
  //     if (!company) return;

  //     // Send email using your preferred email service
  //     // Example using a custom API endpoint:
  //     await fetch('/api/send-payment-reminder', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email: company.ceoEmail,
  //         companyName: company.companyName,
  //         amount: company.amount,
  //         dueDate: company.dueDate
  //       })
  //     });

  //     // Show success message
  //     // You might want to add a toast notification here
  //   } catch (err) {
  //     setError('Failed to send reminder');
  //   } finally {
  //     setReminderLoading(null);
  //   }
  // };

  // useEffect(() => {
  //   if (activeTab === 'payments') {
  //     fetchPayments();
  //   }
  // }, [selectedMonth, selectedYear, activeTab, fetchPayments]);

  const sidebarItems = [
    { id: "all", label: "Tous", icon: <FiUsers />, count: companiesCount },
    {
      id: "transactions",
      label: "Transactions",
      icon: <FiDollarSign />,
      count: transactionsCount,
    },
    {
      id: "blocked",
      label: "Entreprises bloquées",
      icon: <FiDollarSign />,
      count: blockedCompaniesCount,
    },
    // {
    //   id: "submissions",
    //   label: "Validation en attente",
    //   icon: <FiFileText />,
    //   count: unacceptedCompaniesCount,
    // },
    // {
    //   id: "payments",
    //   label: "Monthly Payments",
    //   icon: <FiDollarSign />,
    //   count: pendingPaymentsCount,
    // },
    {
      id: "payment-settings",
      label: "Param cotisations",
      icon: <FiSettings />,
      count: 0,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const acceptCompany = async (companyId: string) => {
    setAcceptLoading(companyId);
    try {
      await updateDoc(doc(db, "companies", companyId), { isAccepted: true });
      setUnacceptedCompanies((prev) =>
        prev.filter((company) => company.id !== companyId)
      );
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId ? { ...company, isAccepted: true } : company
        )
      );
      await getCounts(); // Refresh counts after accepting
    } catch (err) {
      setError("Failed to accept company");
    } finally {
      setAcceptLoading(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress size="lg" color="primary" />
      </div>
    );

  // ... existing code ...
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-8">{error}</div>
      </div>
    );

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        items={sidebarItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        admin="KONAN KAN"
      />
      
      <main className="lg:ml-64 min-h-screen p-4">
        {activeTab === "all" && (
          <CompaniesSection
            companies={companies}
            fetchCompanies={fetchCompanies}
            refreshingCompanies={refreshingCompanies}
            toggleCompanyStatus={toggleCompanyStatus}
            toggleLoading={toggleLoading}
            deleteCompany={deleteCompany}
            deleteLoading={deleteLoading}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsSection
            // transactions={transactions}
            // fetchTransactions={fetchTransactions}
            // refreshingTransactions={refreshingTransactions}
          />
        )}

        {activeTab === "blocked" && (
          <BlockedCompaniesSection
            blockedCompanies={blockedCompanies}
            fetchBlockedCompanies={fetchBlockedCompanies}
            refreshingBlocked={refreshingBlocked}
            toggleCompanyStatus={toggleCompanyStatus}
            toggleLoading={toggleLoading}
          />
        )}
        {activeTab === "submissions" && (
          <UnacceptedCompaniesSection
            unacceptedCompanies={unacceptedCompanies}
            fetchUnacceptedCompanies={fetchUnacceptedCompanies}
            refreshingUnaccepted={refreshingUnaccepted}
            acceptCompany={acceptCompany}
            acceptLoading={acceptLoading}
          />
        )}
        {/* {activeTab === 'payments' && (
          <PaymentSection payments={payments} selectedMonth={selectedMonth} selectedYear={selectedYear} setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} fetchPayments={fetchPayments} refreshingPayments={refreshingPayments} reminderLoading={reminderLoading} sendReminder={sendReminder} />
        )} */}
        {activeTab === "payment-settings" && <PaymentSettingsSection />}
      </main>
    </div>
  );
}
