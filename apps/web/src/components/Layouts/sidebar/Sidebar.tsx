'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, ShieldCheck, X } from 'lucide-react';
import { ADMIN_MENU, SUPERADMIN_MENU, ROLE_IDS } from '../../../constants/navigation';

interface SidebarProps {
  sidebarOpen: boolean; 
  setSidebarOpen: (arg: boolean) => void;
  roleId: number;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, roleId }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuItems = roleId === ROLE_IDS.SUPERADMIN ? SUPERADMIN_MENU : ADMIN_MENU;

  const toggleSubMenu = (name: string) => {
    if (isCollapsed) return;
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <div className={`fixed inset-0 z-[9998] bg-black/50 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`fixed left-0 top-0 z-[9999] h-screen bg-[#0F1115] text-white transition-all duration-300 border-r border-white/10 lg:static ${isCollapsed ? 'w-20' : 'w-72'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && <span className="font-bold text-xl tracking-tight text-indigo-400">Genpad</span>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>

        <nav className="mt-4 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <button onClick={() => toggleSubMenu(item.name)} className={`w-full flex items-center p-3 rounded-xl transition-colors hover:bg-white/5 ${openMenus[item.name] && !isCollapsed ? 'text-indigo-400' : 'text-slate-400'}`}>
                    <item.icon size={20} />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left text-sm font-medium">{item.name}</span>
                        <ChevronDown size={14} className={`transition-transform ${openMenus[item.name] ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {!isCollapsed && openMenus[item.name] && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-white/10 pl-4">
                      {item.subItems.map(sub => (
                        <Link key={sub.path} href={sub.path} className="block p-2 text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.path!} className={`flex items-center p-3 rounded-xl transition-all ${pathname === item.path ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5'}`}>
                  <item.icon size={20} />
                  {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}