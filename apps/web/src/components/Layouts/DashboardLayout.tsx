// apps/web/src/components/Layouts/DashboardLayout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/header";
import Footer from "./footer/footer";
import Breadcrumb from "./breadcrumb";

export default function DashboardLayout({ children, roleId }: { children: React.ReactNode, roleId: number }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} roleId={roleId} />
      
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col">
            
            <div className="flex-1 p-4 md:p-8">
              <div className="w-full">
                <Breadcrumb />
                {children}
              </div>
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}