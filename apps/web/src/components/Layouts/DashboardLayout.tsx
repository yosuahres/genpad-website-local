'use client';

import React, { useState } from 'react';
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  roleId: number;
}

export default function DashboardLayout({ children, roleId }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Sidebar gets the state and the setter */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        roleId={roleId} 
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header needs the setter to open the sidebar on mobile */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="transition-all duration-300">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}