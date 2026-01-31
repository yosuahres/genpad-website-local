"use client";

import React, { useState, useRef, useEffect } from 'react';
import LogoutButton from "./LogoutButton";
import Link from "next/link";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
      <h1 className="text-lg font-semibold text-gray-800 tracking-tight">GenPad</h1>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            isDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
          } focus:outline-none`}
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
            JD
          </div>
          <span className="text-sm font-medium text-gray-700">Account</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in duration-100">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-xs text-gray-400 uppercase font-semibold">Settings</p>
            </div>
            
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              My Profile
            </Link>
            
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Account Settings
            </Link>

            <div className="my-1 border-t border-gray-50"></div>
            
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;