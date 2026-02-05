'use client';

import { MoreVertical, ArrowUp, ArrowDown, Square, CheckSquare2Icon, MinusSquare } from 'lucide-react';
import { useState } from 'react';

interface UserTableProps {
  users: any[];
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  formatDate: (date: string) => string;
}

export function UserTable({ users, selectedUser, setSelectedUser, onSort, formatDate }: UserTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({
    key: 'created_at',
    direction: 'desc'
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const HeaderItem = ({ label, sortKey }: { label: string, sortKey: string }) => (
    <th className="py-4 px-6 text-[11px] font-extrabold uppercase text-slate-500 tracking-widest border-r border-slate-200 group">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <div className="flex items-center gap-1">
          {sortConfig.key === sortKey && (
            sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
          )}
          <button 
            onClick={() => handleSort(sortKey)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    </th>
  );

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="py-4 w-16 border-r border-slate-200 text-center">
            {selectedUser && (
              <button onClick={() => setSelectedUser(null)} className="text-blue-600">
                <MinusSquare size={18}/>
              </button>
            )}
          </th>
          <HeaderItem label="Name" sortKey="name" />
          <HeaderItem label="Email Address" sortKey="email" />
          <HeaderItem label="Created At (UTC)" sortKey="created_at" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {users.map((user) => {
          const isSelected = selectedUser?.id === user.id;
          return (
            <tr 
              key={user.id} 
              onClick={() => setSelectedUser(isSelected ? null : user)}
              className={`cursor-pointer transition-colors group ${isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}
            >
              <td className="py-5 text-center">
                <div className="flex justify-center">
                  {isSelected ? <CheckSquare2Icon size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-300 group-hover:text-blue-400" />}
                </div>
              </td>
              <td className={`py-5 px-6 text-sm border-r border-slate-100 ${isSelected ? "font-bold text-black" : "text-slate-800"}`}>{user.name}</td>
              <td className={`py-5 px-6 text-sm border-r border-slate-100 ${isSelected ? "text-black" : "text-slate-600"}`}>{user.email}</td>
              <td className={`py-5 px-6 text-sm ${isSelected ? "text-black" : "text-slate-600"}`}>{formatDate(user.created_at)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}