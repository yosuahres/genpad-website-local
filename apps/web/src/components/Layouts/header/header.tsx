'use client';

import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white border-b border-slate-200">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm lg:hidden"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="hidden sm:block">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search size={18} className="text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full bg-slate-50 pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <li>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden text-right lg:block">
              <span className="block text-sm font-semibold text-slate-800">User Name</span>
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-tight">Admin Role</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
               <User size={24} className="text-slate-500 translate-y-1" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;