import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import Image from 'next/image';

interface Transaction {
  id: string;
  dateTime: string;
  sender: string;
  amount: number;
  logo: string;
}

interface TransactionsSectionProps {
  transactions: Transaction[];
  fetchTransactions: () => void;
  refreshingTransactions: boolean;
}

function TransactionsSection({
  transactions,
  fetchTransactions,
  refreshingTransactions
}: TransactionsSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={fetchTransactions}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 flex items-center"
          >
            <FiRefreshCw 
              className={`mr-2 ${refreshingTransactions ? 'animate-spin' : ''}`} 
            />
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
                  <Image
                    src={transaction.logo}
                    alt="Company Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsSection; 