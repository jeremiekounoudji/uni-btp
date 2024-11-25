import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  isSidebarOpen: boolean;
  handleLogout: () => void;
}

function Sidebar({
  items,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  handleLogout
}: SidebarProps) {
  return (
    <aside
      className={`bg-main flex flex-col justify-between text-white font-sans m-2 rounded-sm shadow-sm w-64 fixed h-full transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="p-4">
        <nav className="space-y-4">
          {items.map((item) => (
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
              {item.count > 0 && (
                <span className="absolute top-5 right-5 transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-4 mb-10 bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/user-image.png"
              alt="User Image"
              width={32}
              height={32}
              className="rounded-full mr-4"
            />
            <div>
              <p className="text-gray-800 font-semibold text-[13px]">
                Jeremie Kounoudji
              </p>
              <p className="text-gray-600 text-sm">Administrateur</p>
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
  );
}

export default Sidebar; 