"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import Link from "next/link";

export default function AddUserPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Create the user in Supabase Auth
      // Note: In a production environment, you might want to use a Supabase Admin Auth Client 
      // via an Edge Function or Server Action to bypass email confirmation if desired.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: role } // Optional: passing metadata
        }
      });

      if (authError) throw authError;

      // 2. The profile is usually created via a Database Trigger in Supabase,
      // but if you don't have one, you'd manually insert it here:
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role: role }) // Assuming the trigger already created the row
          .eq("id", authData.user.id);
        
        if (profileError) throw profileError;
      }

      setMessage({ type: 'success', text: "User created successfully! Check email for confirmation." });
      setTimeout(() => router.push("/dashboard/users"), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : "Failed to create user" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
        <Link href="/dashboard/users" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to List
        </Link>
      </div>

      <form onSubmit={handleAddUser} className="bg-white p-8 border border-gray-200 rounded-xl shadow-sm space-y-6">
        {message && (
          <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
        >
          {loading ? "Creating..." : "Create User Account"}
        </button>
      </form>
    </div>
  );
}