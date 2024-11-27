import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar
} from "@nextui-org/react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  admin: string;
}

function Sidebar({
  items,
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
  admin
}: SidebarProps) {
  const sidebarContent = (
    <>
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            name={admin}
            className="w-10 h-10"
          />
          <div>
            <h3 className="font-semibold">{admin}</h3>
            <p className="text-sm text-gray-500">Administrateur</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === item.id
                    ? 'bg-white text-primary'
                    : 'bg-gray-200'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-4 py-6">
        <Button
          color="danger"
          variant="flat"
          className="w-full"
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        isIconOnly
        variant="light"
        className="fixed top-4 left-4 lg:hidden z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FiMenu size={24} />
      </Button>

      {/* Mobile Drawer */}
      <Modal
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        placement="top"
        className="lg:hidden"
        
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center">
            <span className="text-xl font-bold">UNIE-BTP</span>
            <Button
              isIconOnly
              variant="light"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={24} />
            </Button>
          </ModalHeader>
          <ModalBody>
            {sidebarContent}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r transition-transform duration-300">
        {sidebarContent}
      </div>
    </>
  );
}

export default Sidebar; 