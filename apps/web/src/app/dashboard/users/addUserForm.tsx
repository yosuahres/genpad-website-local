"use client";

import { useState } from "react";
import { createClient } from "../../../utils/supabase/client";

interface AddUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddUserForm({ onSuccess, onCancel }: AddUserFormProps) {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, role: formData.role } }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: formData.fullName, role: formData.role })
          .eq("id", authData.user.id);
        if (profileError) throw profileError;
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          placeholder="Name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input
          type="password"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          placeholder="••••••••"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-semibold disabled:bg-gray-400">
          {loading ? "Creating..." : "Save User"}
        </button>
      </div>
    </form>
  );
}