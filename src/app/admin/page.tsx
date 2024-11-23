"use client";
import { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { CircularProgress } from "@nextui-org/react";

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

type PaymentStatus = 'paid' | 'pending' | 'overdue';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  const fetchTransactions = async () => {
    try {
      setRefreshingTransactions(true);
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const transactionData: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date(data.dateTime));

        transactionData.push({ id: doc.id, ...data, dateTime: formattedDate });
      });
        setTransactions(transactionData);
      setRefreshingTransactions(false);
    } catch (err) {
      setError("Failed to load transactions");
      setRefreshingTransactions(false);
    }
  };
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

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  const fetchPayments = async () => {
    setRefreshingPayments(true);
    try {
      const q = query(
        collection(db, 'payments'),
        where('year', '==', selectedYear),
        where('month', '==', selectedMonth)
      );
      
      const snapshot = await getDocs(q);
      const paymentData: CompanyPayment[] = [];
      
      snapshot.forEach((doc) => {
        paymentData.push(doc.data() as CompanyPayment);
      });
      
      setPayments(paymentData);
      setPendingPaymentsCount(
        paymentData.filter(p => p.status !== 'paid').length
      );
    } catch (err) {
      setError('Failed to load payments');
    } finally {
      setRefreshingPayments(false);
    }
  };

  const sendReminder = async (companyId: string) => {
    setReminderLoading(companyId);
    try {
      const company = payments.find(p => p.companyId === companyId);
      if (!company) return;

      // Send email using your preferred email service
      // Example using a custom API endpoint:
      await fetch('/api/send-payment-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: company.ceoEmail,
          companyName: company.companyName,
          amount: company.amount,
          dueDate: company.dueDate
        })
      });

      // Show success message
      // You might want to add a toast notification here
    } catch (err) {
      setError('Failed to send reminder');
    } finally {
      setReminderLoading(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [selectedMonth, selectedYear, activeTab]);

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
    {
      id: "submissions",
      label: "Validation en attente",
      icon: <FiFileText />,
      count: unacceptedCompaniesCount,
    },
    {
      id: 'payments',
      label: 'Monthly Payments',
      icon: <FiDollarSign />,
      count: pendingPaymentsCount
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex pt-2 pb-2 h-screen">
        <aside
          className={`bg-main flex flex-col justify-between text-white font-sans m-2 rounded-sm shadow-sm w-64 fixed h-full transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="p-4">
            <nav className="space-y-4">
              {sidebarItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center font-semibold px-4 py-3 text-sm rounded-md transition-colors ${
                      activeTab === item.id
                        ? "bg-indigo-200 text-main"
                        : "bg-slate-100 text-main hover:bg-indigo-100 hover:text-main"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                  </button>
                  <span className="absolute top-5 right-5 transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full min-w-[20px] text-center">
                  { item.count}
                  </span>
                </div>
              ))}
            </nav>
          </div>
          <div className="mx-4 mb-10 bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/user-image.png"
                  alt="User Image"
                  className="w-8 h-8 rounded-full mr-4"
                />
                <div>
                  <p className="text-gray-800 font-semibold text-[13px]">
                    Jeremie Kounoudji
                  </p>
                  <p className="text-gray-600 text-sm">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
              >
                <FiLogOut size={10} />
              </button>
            </div>
          </div>
        </aside>

        <main
          className={`flex-1 p-8 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : ""
          }`}
        >
          {activeTab === "all" && (
            <div className="bg-white shadow rounded-lg">
              <div className="overflow-x-auto">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={fetchCompanies}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                  >
                    <FiRefreshCw className={`mr-2 ${refreshingCompanies ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dénomination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {company.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              company.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {company.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end">
                          <button
                            onClick={() =>
                              toggleCompanyStatus(company.id, company.isActive)
                            }
                            className="hover:text-indigo-900 mr-4 bg-indigo-100 text-main px-4 py-2 rounded flex items-center justify-center"
                            disabled={toggleLoading === company.id}
                          >
                            {toggleLoading === company.id ? (
                              <CircularProgress size="sm" color="primary" />
                            ) : company.isActive ? (
                              "Block"
                            ) : (
                              "Unblock"
                            )}
                          </button>
                          <button
                            onClick={() => deleteCompany(company.id)}
                            className="text-red-600 hover:text-red-900 mr-4 bg-red-100 px-4 py-2 rounded flex items-center justify-center"
                            disabled={deleteLoading === company.id}
                          >
                            {deleteLoading === company.id ? (
                              <CircularProgress size="sm" color="primary" />
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="overflow-x-auto">
              <div className="flex justify-end mb-4">
                  <button
                    onClick={fetchTransactions}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                  >
                    <FiRefreshCw className={`mr-2 ${refreshingTransactions ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Logo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.dateTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.sender}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={transaction.logo}
                            alt="Company Logo"
                            className="h-10 w-10 rounded-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "blocked" && (
            <div className="bg-white shadow rounded-lg p-6">
             
              <div className="overflow-x-auto">
              <div className="flex justify-end mb-4">
                  <button
                    onClick={fetchBlockedCompanies}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                  >
                    <FiRefreshCw className={`mr-2 ${refreshingBlocked ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dénomination
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blockedCompanies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {company.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              toggleCompanyStatus(company.id, company.isActive)
                            }
                            className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200"
                            disabled={toggleLoading === company.id}
                          >
                            {toggleLoading === company.id ? (
                              <CircularProgress size="sm" color="primary" />
                            ) : (
                              "Unblock"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "submissions" && (
            <div className="bg-white shadow rounded-lg p-6">
             
              <div className="overflow-x-auto">
              <div className="flex justify-end mb-4">
                  <button
                    onClick={fetchUnacceptedCompanies}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                  >
                    <FiRefreshCw className={`mr-2 ${refreshingUnaccepted ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dénomination
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unacceptedCompanies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {company.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => acceptCompany(company.id)}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 flex items-center justify-center"
                            disabled={acceptLoading === company.id}
                          >
                            {acceptLoading === company.id ? (
                              <CircularProgress size="sm" color="primary" />
                            ) : (
                              "Accept"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'payments' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                  <select 
                    className="rounded-md border border-gray-300 p-2"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    className="rounded-md border border-gray-300 p-2"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                <button
                  onClick={fetchPayments}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
                >
                  <FiRefreshCw className={`mr-2 ${refreshingPayments ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.companyId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {payment.status !== 'paid' && (
                            <button
                              onClick={() => sendReminder(payment.companyId)}
                              disabled={reminderLoading === payment.companyId}
                              className="bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 disabled:opacity-50"
                            >
                              {reminderLoading === payment.companyId ? (
                                <CircularProgress size="sm" color="primary" />
                              ) : (
                                'Send Reminder'
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
