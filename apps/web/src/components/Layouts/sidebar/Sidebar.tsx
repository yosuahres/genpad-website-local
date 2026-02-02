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
  Map, 
  ShieldCheck, 
  Baby,
  List
} from "lucide-react"; 

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);

  const toggleSidebar = () => {
    if (!isCollapsed) setIsDataOpen(false);
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

      <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar">
        {/* SECTION 1: MAIN MENU */}
        <div className="px-3 mb-8">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 px-2">
              Main Menu
            </p>
          )}
          <ul className="space-y-2">
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
          </ul>
        </div>

        {/* SECTION 2: DATA (DROPDOWN) */}
        <div className="px-3 mb-8">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 px-2">
              Data
            </p>
          )}
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => !isCollapsed && setIsDataOpen(!isDataOpen)}
                className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors group ${
                  isDataOpen && !isCollapsed ? "bg-gray-800/50 text-blue-400" : "text-gray-300"
                }`}
              >
                <div className="min-w-[20px]"><List size={20} /></div>
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left font-medium">Master Data</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${isDataOpen ? "rotate-180" : ""}`} 
                    />
                  </>
                )}
              </button>

              {!isCollapsed && isDataOpen && (
                <ul className="mt-2 ml-6 space-y-1 border-l border-gray-700 pl-4">
                  <SidebarSubItem 
                    icon={<Map size={16} />} 
                    label="Regions" 
                    href="/dashboard/data/regions" 
                  />
                  <SidebarSubItem 
                    icon={<ShieldCheck size={16} />} 
                    label="Roles" 
                    href="/dashboard/data/roles" 
                  />
                  <SidebarSubItem 
                    icon={<Baby size={16} />} 
                    label="Anak Asuh" 
                    href="/dashboard/data/anak-asuh" 
                  />
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* SECTION 3: SYSTEM */}
        <div className="px-3">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 px-2">
              System
            </p>
          )}
          <ul className="space-y-2">
            <SidebarItem 
              icon={<Users size={20} />} 
              label="User Management" 
              isCollapsed={isCollapsed} 
              href="/dashboard/users" 
            />
          </ul>
        </div>
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