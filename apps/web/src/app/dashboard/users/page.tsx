"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("profiles")
        .select("id, email, role, created_at")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium tracking-wide">Fetching users...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 lg:p-10">
      {/* Header Section - Full Width */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-2">Oversee all registered accounts and system privileges.</p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </Link>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search email, role, or ID..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Showing {filteredUsers.length} users
        </div>
      </div>

      {/* Full Width Table Container */}
      {error ? (
        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700">
          <p className="font-bold text-lg">System Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">User Profile</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Access Role</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Registration Date</th>
                  <th className="px-8 py-5 text-right text-sm font-bold text-gray-600 uppercase tracking-wider">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{user.email}</div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight border ${
                          user.role === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-bold">
                        <button className="text-blue-600 hover:text-blue-800 px-3 py-1 hover:bg-blue-100 rounded-md transition-all mr-2">Edit</button>
                        <button className="text-red-500 hover:text-red-700 px-3 py-1 hover:bg-red-50 rounded-md transition-all">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-lg font-medium">No users found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}