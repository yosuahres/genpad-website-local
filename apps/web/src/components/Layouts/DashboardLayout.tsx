// apps/web/src/components/Layouts/DashboardLayout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/header";

export default function DashboardLayout({ children, roleId }: { children: React.ReactNode, roleId: number }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} roleId={roleId} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}