
"use client";

import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

interface AddRoleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddRoleForm({ onSuccess, onCancel }: AddRoleFormProps) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("roles").insert([{ name }]);
    setLoading(false);
    if (!error) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Role Name</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Moderator"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-semibold disabled:bg-gray-400">
          {loading ? "Saving..." : "Save Role"}
        </button>
      </div>
    </form>
  );
}