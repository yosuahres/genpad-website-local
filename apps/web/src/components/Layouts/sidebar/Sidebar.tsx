'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ChevronRight, X } from 'lucide-react';
import { ADMIN_MENU, SUPERADMIN_MENU, ROLE_IDS } from '../../../constants/navigation';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  roleId: number;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, roleId }: SidebarProps) => {
  const pathname = usePathname();
  const isSuperAdmin = roleId === ROLE_IDS.SUPERADMIN;
  const menuItems = isSuperAdmin ? SUPERADMIN_MENU : ADMIN_MENU;

  // Sync: Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[9999] flex h-screen w-72 flex-col border-r border-white/10 bg-[#0F1115] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-8 py-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-none">Genpad</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500 mt-1">
                {isSuperAdmin ? 'Super Control' : 'Administrator'}
              </span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 no-scrollbar">
          <div className="px-4 mb-4 mt-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Navigation
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-white/5 text-white' 
                        : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-indigo-400' : ''} />
                      {item.name}
                    </div>
                    {isActive && <ChevronRight size={14} className="text-indigo-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;