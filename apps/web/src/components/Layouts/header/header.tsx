// apps/web/src/components/Layouts/header/header.tsx
'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import LogoutButton from './LogoutButton';
import { useIsMobile } from '../../../hooks/use-mobile'; // Import hook

export default function Header({ setSidebarOpen }: { setSidebarOpen: (arg: boolean) => void }) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 md:px-6 justify-between items-center">
      <div className="flex items-center gap-4">
        {isMobile && ( // Programmatic mobile check
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 bg-slate-50 rounded-lg"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="pl-4 border-l border-slate-200">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}