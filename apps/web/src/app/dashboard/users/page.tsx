"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { BaseModal } from "../../../components/ui/baseModal";
import { AddUserForm } from "./addUserForm";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  created_at: string;
}

export default function UsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("profiles")
        .select("id, email, role, full_name, created_at")
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
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Fetching users...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-2">Manage registered accounts and system roles.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-bold text-gray-600 uppercase tracking-wider">
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-semibold text-gray-900">{user.full_name || "New User"}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap uppercase text-xs font-bold text-blue-700">{user.role}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REUSABLE MODAL CALL */}
      <BaseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New User"
      >
        <AddUserForm 
          onCancel={() => setIsAddModalOpen(false)} 
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchUsers();
          }} 
        />
      </BaseModal>
    </div>
  );
}