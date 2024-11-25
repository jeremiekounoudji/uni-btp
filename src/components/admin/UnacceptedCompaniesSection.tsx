import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { CircularProgress } from "@nextui-org/react";

interface Company {
  id: string;
  companyName: string;
  // ... add other company properties if needed
}

interface UnacceptedCompaniesSectionProps {
  unacceptedCompanies: Company[];
  fetchUnacceptedCompanies: () => void;
  refreshingUnaccepted: boolean;
  acceptCompany: (companyId: string) => void;
  acceptLoading: string | null;
}

function UnacceptedCompaniesSection({
  unacceptedCompanies,
  fetchUnacceptedCompanies,
  refreshingUnaccepted,
  acceptCompany,
  acceptLoading
}: UnacceptedCompaniesSectionProps) {
  return (
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
  );
}

export default UnacceptedCompaniesSection; 