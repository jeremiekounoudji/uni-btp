import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { CircularProgress } from "@nextui-org/react";

interface Company {
  id: string;
  companyName: string;
  isActive: boolean;
  // ... add other company properties if needed
}

interface BlockedCompaniesSectionProps {
  blockedCompanies: Company[];
  fetchBlockedCompanies: () => void;
  refreshingBlocked: boolean;
  toggleCompanyStatus: (companyId: string, isActive: boolean) => void;
  toggleLoading: string | null;
}

function BlockedCompaniesSection({
  blockedCompanies,
  fetchBlockedCompanies,
  refreshingBlocked,
  toggleCompanyStatus,
  toggleLoading
}: BlockedCompaniesSectionProps) {
  return (
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
                    onClick={() => toggleCompanyStatus(company.id, company.isActive)}
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
  );
}

export default BlockedCompaniesSection; 