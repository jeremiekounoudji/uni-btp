import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { CircularProgress } from "@nextui-org/react";

interface Company {
  id: string;
  companyName: string;
  isActive: boolean;
}

interface CompaniesSectionProps {
  companies: Company[];
  fetchCompanies: () => void;
  refreshingCompanies: boolean;
  toggleCompanyStatus: (companyId: string, isActive: boolean) => void;
  toggleLoading: string | null;
  deleteCompany: (companyId: string) => void;
  deleteLoading: string | null;
}

function CompaniesSection({
  companies,
  fetchCompanies,
  refreshingCompanies,
  toggleCompanyStatus,
  toggleLoading,
  deleteCompany,
  deleteLoading
}: CompaniesSectionProps) {
  return (
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
                    onClick={() => toggleCompanyStatus(company.id, company.isActive)}
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
  );
}

export default CompaniesSection; 