import React from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { CircularProgress } from "@nextui-org/react"

interface Payment {
  companyId: string;
  companyName: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  dueDate: string;
}

interface PaymentSectionProps {
  payments: Payment[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  fetchPayments: () => void;
  refreshingPayments: boolean;
  reminderLoading: string | null;
  sendReminder: (companyId: string) => void;
}

function PaymentSection({
  payments,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  fetchPayments,
  refreshingPayments,
  reminderLoading,
  sendReminder
}: PaymentSectionProps) {
  return (
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
  )
}

export default PaymentSection