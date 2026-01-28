// components/Layouts/sidebar/Sidebar.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, LayoutDashboard, ShoppingCart, Package, Settings, Users } from "lucide-react"; 

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <span className="text-lg font-bold whitespace-nowrap">Genpad Admin</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-4">
        <ul className="space-y-2 px-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" isCollapsed={isCollapsed} href="/dashboard" />
          <SidebarItem icon={<Users size={20} />} label="Users & Roles" isCollapsed={isCollapsed} href="/dashboard/users" />
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, isCollapsed, href }: { icon: React.ReactNode, label: string, isCollapsed: boolean, href: string }) {
  return (
    <li>
      <a href={href} className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors group">
        <div className="min-w-[20px]">{icon}</div>
        <span className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
        }`}>
          {label}
        </span>
      </a>
    </li>
  );
}