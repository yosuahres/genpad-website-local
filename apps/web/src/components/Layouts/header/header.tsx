// apps/web/src/components/Layouts/header/header.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Search, User } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import LogoutButton from './LogoutButton';
import { createClient } from "~/utils/supabase/client";

export default function Header({ setSidebarOpen }: { setSidebarOpen: (arg: boolean) => void }) {
  const [profile, setProfile] = useState<{name: string, role_id: number} | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('name, role_id').eq('id', user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 md:px-6 justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-lg"><Menu size={20} /></button>
        <div className="hidden sm:relative sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search..." className="bg-slate-50 pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-64" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{profile?.name || 'Loading...'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
              {profile?.role_id === 1 ? 'Super Admin' : 'Admin'}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <User size={18} />
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}