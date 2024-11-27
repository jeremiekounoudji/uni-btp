import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { 
  Select, 
  SelectItem, 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell, 
  Button,
  Pagination,
  Spinner
} from "@nextui-org/react";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Transaction {
  id: string;
  dateTime: string;
  sender: string;
  amount: number;
  logo: string;
}

interface TransactionsSectionProps {
  transactions: Transaction[];
  refreshingTransactions: boolean;
}

function TransactionsSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const ITEMS_PER_PAGE = 10;
  const [isRefrech, setIsRefresh] = useState(false);


  // mon,ths
  const months = [
    { value: "0", label: "Janvier" },
    { value: "1", label: "Février" },
    { value: "2", label: "Mars" },
    { value: "3", label: "Avril" },
    { value: "4", label: "Mai" },
    { value: "5", label: "Juin" },
    { value: "6", label: "Juillet" },
    { value: "7", label: "Août" },
    { value: "8", label: "Septembre" },
    { value: "9", label: "Octobre" },
    { value: "10", label: "Novembre" },
    { value: "11", label: "Décembre" }
  ];

  // years
   // Generate years (e.g., last 5 years)
   const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const fetchTransactions = async (resetPagination = false) => {
    try {
      setLoading(true);
      setIsRefresh(true);
      
      // Build the base query
      let baseQuery = collection(db, "transactions");
      let constraints: any[] = [];

      // Add filters if month/year are selected
      if (selectedMonth && selectedYear) {
        const startDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1);
        const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) + 1, 0);
        constraints.push(where("dateTime", ">=", startDate));
        constraints.push(where("dateTime", "<=", endDate));
      }

      // Add ordering
      constraints.push(orderBy("dateTime", "desc"));
      
      // Add pagination
      constraints.push(limit(ITEMS_PER_PAGE));
      
      // Add startAfter if not first page and not resetting pagination
      if (lastVisible && !resetPagination && page > 1) {
        constraints.push(startAfter(lastVisible));
      }

      const q = query(baseQuery, ...constraints);
      const querySnapshot = await getDocs(q);

      // Update last visible for pagination
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const transactionData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(data.dateTime));

        transactionData.push({
          id: doc.id,
          ...data,
          dateTime: formattedDate,
        } as Transaction);
      });

      if (resetPagination) {
        setTransactions(transactionData);
        setPage(1);
      } else {
        setTransactions(prev => [...prev, ...transactionData]);
      }

      // Update total pages (you might want to get the total count from Firestore)
      // This is a simplified version
      setTotalPages(Math.ceil(querySnapshot.size / ITEMS_PER_PAGE));

    } catch (err) {
      setError("Failed to load transactions");
      setIsRefresh(false);

    } finally {
      setLoading(false);
      setIsRefresh(false);

    }
  };

  // Handle filter changes
  useEffect(() => {
    fetchTransactions(true); // Reset pagination when filters change
  }, [selectedMonth, selectedYear]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchTransactions();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Select 
              label="Mois" 
              placeholder="Sélectionner un mois"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            >
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </Select>

            <Select 
              label="Année" 
              placeholder="Sélectionner une année"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-32"
            >
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Button
            onClick={() => fetchTransactions()}
            variant="flat"
            startContent={
              <FiRefreshCw 
                className={isRefrech ? 'animate-spin' : ''} 
              />
            }
          >
            Refresh
          </Button>
        </div>

        <Table 
          aria-label="Transactions table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={handlePageChange}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>DATE</TableColumn>
            <TableColumn>ENVOYEUR</TableColumn>
            <TableColumn>MONTANT</TableColumn>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.dateTime}</TableCell>
                <TableCell>{transaction.sender}</TableCell>
                <TableCell>{transaction.amount} FCFA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {loading && (
          <div className="flex justify-center p-4">
            <Spinner color="primary" />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionsSection; 