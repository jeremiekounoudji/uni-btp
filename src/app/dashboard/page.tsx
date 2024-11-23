"use client";
import { useState, useEffect } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  getDocs,
  setDoc,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  User,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import {
  Input,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";

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
interface TransactionData {
  id: string;
  productName: string;
  amount: number;
  status: "Completed" | "Pending";
  date: string;
  orderNumber: string;
}

interface PaymentData {
  id?: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  paidDate?: string;
  month: number;
  year: number;
  companyId: string;
  companyName: string;
}

interface EditableCompanyData {
  companyName: string;
  email: string;
  address: string;
  website: string;
  ceoName: string;
  ceoEmail: string;
  ceoPhone: string;
  password: string;
}

export default function Dashboard() {
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountUpdateLoading, setAccountUpdateLoading] = useState(false);

  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const router = useRouter();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      const fetchCompanyData = async () => {
        try {
          const docRef = doc(db, "companies", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCompanyData(docSnap.data() as Company);
            if (docSnap.data().profileImage) {
              setPreviewUrl(docSnap.data().profileImage);
            }
          }
        } catch (err: any) {
          setError("Failed to load company data");
        } finally {
          setLoading(false);
          setIsInitialLoadComplete(true);
        }
      };

      fetchCompanyData();
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isInitialLoadComplete || !auth.currentUser) return;

    const loadSecondaryData = async () => {
      try {
        const q = query(collection(db, "companies", user!.uid, "transactions"));
        const querySnapshot = await getDocs(q);

        const transactionData: TransactionData[] = [];
        let income = 0;
        let returns = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data() as TransactionData;
          transactionData.push({ ...data, id: doc.id });

          if (data.status === "Completed") {
            income += data.amount;
          } else {
            returns += data.amount;
          }
        });

        setTransactions(transactionData);
        setTotalIncome(income);
        setTotalReturn(returns);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      }

      try {
        const q = query(
          collection(db, "payments"),
          where("companyId", "==", user!.uid),
          orderBy("dueDate", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const paymentData: PaymentData[] = [];

        querySnapshot.forEach((doc) => {
          paymentData.push({ id: doc.id, ...doc.data() } as PaymentData);
        });

        setPayments(paymentData);
      } catch (err) {
        console.log("Failed to load payments:", err);
      }
    };

    loadSecondaryData();
  }, [isInitialLoadComplete]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountUpdateLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Only update password if a new one was provided
      if (companyData?.password) {
        if (!companyData.password) {
          throw new Error("Current password is required");
        }
        const credential = EmailAuthProvider.credential(
          user.email!,
          companyData.password
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, companyData.password);
        toast.success("Password changed successfully");
      }

      // Update other profile data
      const updatedData = {
        companyName: companyData!.companyName,
        email: companyData!.email,
        address: companyData!.address,
        website: companyData!.website,
        ceoName: companyData!.ceoName,
        ceoEmail: companyData!.ceoEmail,
        ceoPhone: companyData!.ceoPhone,
      };

      await updateDoc(doc(db, "companies", user.uid), updatedData);
      setCompanyData({ ...companyData!, ...updatedData } as Company);
      setIsEditing(false);

      toast.success("Information profile modifiée avec succès !", {
        description: "Vos informations ont été modifiées avec succès.",
      });
    } catch (err: any) {
      toast.error("Echec de la modification de l'information profile", {
        description: err.message || "Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!companyData) return;

    setProcessingPayment(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Create payment record
      const paymentRef = doc(collection(db, "payments"));
      const currentDate = new Date();

      const paymentData: PaymentData = {
        companyId: user.uid,
        companyName: companyData.companyName,
        amount: 299, // Set your fixed amount or make it dynamic
        status: "pending",
        dueDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).toISOString(), // Last day of current month
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      };

      await setDoc(paymentRef, paymentData);

      // Update local state
      setPayments((prev) => [...prev, { ...paymentData, id: paymentRef.id }]);
      setShowPaymentModal(false);
    } catch (err) {
      setError("Failed to process payment");
      console.error(err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to logout");
    } finally {
      setShowLogoutModal(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar className="bg-main text-slate-100">
        <NavbarBrand>
          <p className="font-bold text-inherit">UNIE-BTP</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button 
              color="danger" 
              variant="flat" 
              className="text-slate-100"
              onClick={showLogoutConfirmation}
            >
              Disconnect
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <Modal 
        isOpen={showLogoutModal} 
        onOpenChange={setShowLogoutModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Logout</ModalHeader>
              <ModalBody>
                Are you sure you want to disconnect?
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onPress={handleLogout}
                >
                  Disconnect
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <Toaster richColors closeButton />
        <div className="max-w-7xl mx-auto ">
          <div className="bg-white shadow rounded-lg mb-8 p-5">
            <Card className="max-w-[500px] mx-auto bg-main text-slate-100">
              <CardHeader className="justify-between ">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="lg"
                    src={previewUrl || "/default-company.png"}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center ">
                    <h4 className="text-small font-semibold leading-none text-slate-100">
                      {companyData?.companyName || "Company Name"}
                    </h4>
                    <h5 className="text-small tracking-tight text-slate-200">
                      {companyData?.email || "email@company.com"}
                    </h5>
                  </div>
                </div>
                <Modal
                  isOpen={isEditing}
                  onOpenChange={setIsEditing}
                  placement="center"
                  size="lg"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Edit Profile
                        </ModalHeader>
                        <ModalBody>
                          <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-4"
                          >
                            <Input
                              label="Company Name"
                              value={companyData?.companyName || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  companyName: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            <Input
                              type="email"
                              label="Email"
                              value={companyData?.email || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  email: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            <Input
                              label="Website"
                              value={companyData?.website || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  website: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            <Input
                              label="Address"
                              value={companyData?.address || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  address: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            <Input
                              label="CEO Name"
                              value={companyData?.ceoName || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  ceoName: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            <Input
                              type="email"
                              label="CEO Email"
                              value={companyData?.ceoEmail || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  ceoEmail: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            <Input
                              type="tel"
                              label="CEO Phone"
                              value={companyData?.ceoPhone || ""}
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  ceoPhone: e.target.value,
                                })
                              }
                              size="sm"
                            />
                            {companyData?.password && (
                              <Input
                                type="password"
                                label="Current Password"
                                onChange={(e) =>
                                  setCompanyData({
                                    ...companyData!,
                                    password: e.target.value,
                                  })
                                }
                                size="sm"
                                required
                              />
                            )}
                            <Input
                              type="password"
                              label="New Password (optional)"
                              onChange={(e) =>
                                setCompanyData({
                                  ...companyData!,
                                  password: e.target.value,
                                })
                              }
                              size="sm"
                            />
                          </form>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="primary"
                            onClick={handleUpdateProfile}
                            isLoading={accountUpdateLoading}
                            spinner={<Spinner size="sm" color="white" />}
                          >
                            Save
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                <Button
                  color="primary"
                  radius="full"
                  size="sm"
                  onPress={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </CardHeader>
              <CardBody className="px-3 py-0 text-small text-slate-100">
                <p>{companyData?.address || "Company Address"}</p>
                <p className="pt-2">📞 {companyData?.phone || "Phone Number"}</p>
              </CardBody>
              <CardFooter className="gap-3">
                <div className="flex gap-1">
                  <p className="font-semibold text-slate-100 text-small">
                    Status:
                  </p>
                  <p
                    className={`text-small ${
                      companyData?.isAccepted ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {companyData?.isAccepted ? "Accepted" : "Not Accepted"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <p className="font-semibold text-slate-100 text-small">Plan:</p>
                  <p className="text-slate-100 text-small">
                    {companyData?.isActive ? "Active" : "Not Active"}
                  </p>
                </div>
              </CardFooter>
            </Card>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Total Cotisation</h4>
                <div className="text-3xl font-bold">
                  ${totalIncome.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">depuis votre intégration</div>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Total Return</h4>
                <div className="text-3xl font-bold">
                  ${totalReturn.toLocaleString()}
                </div>
                <div className="text-sm text-red-600">-24% from last month</div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Recent Transactions
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.productName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          ${transaction.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Insurance Section */}
          {/* <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Insurance Details
            </h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Plan
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {companyData?.insurancePlan || 'No active plan'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {companyData?.insuranceStatus || 'Not insured'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/insurance-plans')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Manage Insurance Plan
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
