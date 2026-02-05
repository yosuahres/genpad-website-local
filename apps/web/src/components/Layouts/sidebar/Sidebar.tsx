// apps/web/src/components/Layouts/sidebar/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, X, User } from 'lucide-react'; // Added User icon
import { ADMIN_MENU, SUPERADMIN_MENU, ROLE_IDS } from '../../../constants/navigation';
import { createClient } from "../../../utils/supabase/client"; // Import supabase

interface SidebarProps {
  sidebarOpen: boolean; 
  setSidebarOpen: (arg: boolean) => void;
  roleId: number;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, roleId }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [profileName, setProfileName] = useState<string | null>(null); // State for name
  const supabase = createClient();

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
    if (isCollapsed) return;
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9998] bg-black/50 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      <aside className={`fixed left-0 top-0 z-[9999] h-screen bg-[#4b545c] text-white transition-all duration-300 border-r border-white/10 lg:static ${isCollapsed ? 'w-20' : 'w-72'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && <span className="font-bold text-xl tracking-tight text-white">Genpad</span>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white"><X size={20} /></button>
        </div>

        {/* --- PROFILE SECTION START --- */}
        <div className={`px-6 py-4 mb-4 border-b border-white/10 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
            <User size={20} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{profileName || 'Loading...'}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {roleId === ROLE_IDS.SUPERADMIN ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          )}
        </div>
        {/* --- PROFILE SECTION END --- */}

        <nav className="px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {/* ... existing menu mapping ... */}
          {menuItems.map((item) => (
             <div key={item.name}>
               {/* Keep your existing menu item logic here */}
               {item.subItems ? (
                <>
                  <button 
                    onClick={() => toggleSubMenu(item.name)} 
                    className={`w-full flex items-center p-3 rounded-xl transition-colors hover:bg-black/10 ${openMenus[item.name] && !isCollapsed ? 'text-white bg-black/10' : 'text-zinc-300'}`}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left text-base font-medium">{item.name}</span>
                        <ChevronDown size={14} className={`transition-transform ${openMenus[item.name] ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {!isCollapsed && openMenus[item.name] && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-white/20 pl-4">
                      {item.subItems.map(sub => (
                        <Link 
                          key={sub.path} 
                          href={sub.path} 
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
                  className={`flex items-center p-3 rounded-xl transition-all ${pathname === item.path ? 'bg-white text-black' : 'text-zinc-300 hover:bg-black/10'}`}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span className="ml-3 text-base font-medium">{item.name}</span>}
                </Link>
              )}
             </div>
          ))}
        </nav>
      </aside>
    </>
  );
}