"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  LayoutDashboard, 
  Users, 
  ChevronDown, 
  UserPlus, 
  List 
} from "lucide-react"; 

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);

  // Auto-close dropdown if sidebar is collapsed to prevent UI glitches
  const toggleSidebar = () => {
    if (!isCollapsed) setIsUsersOpen(false);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out min-h-screen border-r border-gray-700 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!isCollapsed && <span className="text-xl font-extrabold tracking-tight text-blue-400">Genpad Admin</span>}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-3">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isCollapsed={isCollapsed} 
            href="/dashboard" 
          />
          
          <SidebarItem 
            icon={<Filter size={20} />} 
            label="Rapor Anak" 
            isCollapsed={isCollapsed} 
            href="/dashboard/reports" 
          />

          {/* Users & Roles Dropdown Group */}
          <li>
            <button
              onClick={() => !isCollapsed && setIsUsersOpen(!isUsersOpen)}
              className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors group ${
                isUsersOpen && !isCollapsed ? "bg-gray-800/50 text-blue-400" : "text-gray-300"
              }`}
            >
              <div className="min-w-[20px]"><Users size={20} /></div>
              {!isCollapsed && (
                <>
                  <span className="ml-3 flex-1 text-left font-medium">Users & Roles</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isUsersOpen ? "rotate-180" : ""}`} 
                  />
                </>
              )}
            </button>

            {/* Sub-menu Items */}
            {!isCollapsed && isUsersOpen && (
              <ul className="mt-2 ml-6 space-y-1 border-l border-gray-700 pl-4">
                <SidebarSubItem 
                  icon={<List size={16} />} 
                  label="All Users" 
                  href="/dashboard/users" 
                />
                <SidebarSubItem 
                  icon={<UserPlus size={16} />} 
                  label="Add New User" 
                  href="/dashboard/users/new" 
                />
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, isCollapsed, href }: { icon: React.ReactNode, label: string, isCollapsed: boolean, href: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="flex items-center p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-all group"
      >
        <div className="min-w-[20px]">{icon}</div>
        <span className={`ml-3 font-medium transition-opacity duration-300 whitespace-nowrap ${
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
        }`}>
          {label}
        </span>
      </Link>
    </li>
  );
}

function SidebarSubItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="flex items-center p-2 rounded-md text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-800/40 transition-all"
      >
        <span className="mr-2">{icon}</span>
        {label}
      </Link>
    </li>
  );
}