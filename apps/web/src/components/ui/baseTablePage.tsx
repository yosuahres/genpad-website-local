"use client";

import { ReactNode } from "react";

interface DataTablePageProps {
  title: string;
  description: string;
  onAddClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  columns: string[];
  children: ReactNode;
  loading?: boolean;
}

export function DataTablePage({
  title,
  description,
  onAddClick,
  searchTerm,
  onSearchChange,
  columns,
  children,
  loading
}: DataTablePageProps) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-500 mt-2">{description}</p>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </button>
      </header>

      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-600 uppercase tracking-wider">
                {columns.map((col) => (
                  <th key={col} className="px-8 py-5">{col}</th>
                ))}
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}