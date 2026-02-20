// apps/web/src/components/Layouts/sidebar/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, X, User } from 'lucide-react';
import { ADMIN_MENU, SUPERADMIN_MENU, ROLE_IDS } from '../../../constants/navigation';
import { createClient } from "../../../utils/supabase/client";
import { useIsMobile } from '../../../hooks/use-mobile'; // Import hook

interface SidebarProps {
  sidebarOpen: boolean; 
  setSidebarOpen: (arg: boolean) => void;
  roleId: number;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, roleId }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile(); // Use hook
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [profileName, setProfileName] = useState<string | null>(null);
  const supabase = createClient();

  const homePath = roleId === ROLE_IDS.SUPERADMIN ? '/dashboard/superadmin' : '/dashboard/admin';

  // Automatically close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('name').eq('id', user.id).single();
        if (data) setProfileName(data.name);
      }
    };
    fetchProfile();
  }, [supabase]);

  const menuItems = roleId === ROLE_IDS.SUPERADMIN ? SUPERADMIN_MENU : ADMIN_MENU;

  const toggleSubMenu = (name: string) => {
    if (isCollapsed && !isMobile) return;
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-[9998] bg-black/50 transition-opacity ${isMobile && sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      <aside className={`
        fixed top-0 z-[9999] h-screen bg-[#4b545c] text-white transition-all duration-300 border-r border-white/10
        ${isMobile ? (sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72') : (isCollapsed ? 'w-20 static' : 'w-72 static')}
      `}>
        
        <div className="p-6 flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <Link href={homePath} className="font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
              Genpad
            </Link>
          )}
          
          {!isMobile ? (
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(false)} className="text-white">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Profile Section */}
        <div className={`px-6 py-4 mb-4 border-b border-white/10 flex items-center gap-3 ${(isCollapsed && !isMobile) ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
            <User size={20} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{profileName || 'Loading...'}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {roleId === ROLE_IDS.SUPERADMIN ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          )}
        </div>

        <nav className="px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
             <div key={item.name}>
               {item.subItems ? (
                <>
                  <button 
                    onClick={() => toggleSubMenu(item.name)} 
                    className={`w-full flex items-center p-3 rounded-xl transition-colors hover:bg-black/10 ${(openMenus[item.name] && (!isCollapsed || isMobile)) ? 'text-white bg-black/10' : 'text-zinc-300'}`}
                  >
                    <item.icon size={20} />
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span className="ml-3 flex-1 text-left text-base font-medium">{item.name}</span>
                        <ChevronDown size={14} className={`transition-transform ${openMenus[item.name] ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {(!isCollapsed || isMobile) && openMenus[item.name] && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-white/20 pl-4">
                      {item.subItems.map(sub => (
                        <Link 
                          key={sub.path} 
                          href={sub.path} 
                          onClick={() => isMobile && setSidebarOpen(false)} // Close on navigate for mobile
                          className="block p-2 text-base text-zinc-300 hover:text-white transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href={item.path!} 
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center p-3 rounded-xl transition-all ${pathname === item.path ? 'bg-white text-black' : 'text-zinc-300 hover:bg-black/10'}`}
                >
                  <item.icon size={20} />
                  {(!isCollapsed || isMobile) && <span className="ml-3 text-base font-medium">{item.name}</span>}
                </Link>
              )}
             </div>
          ))}
        </nav>
      </aside>
    </>
  );
}