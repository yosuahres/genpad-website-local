"use client";

import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

export function AddRoleForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("roles").insert([{ name }]);
    setLoading(false);
    if (!error) onSuccess();
    else alert(error.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Role Name</label>
        <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
          placeholder="e.g. Moderator" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex gap-4 pt-6 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="flex-1 py-4 border border-gray-300 text-black font-bold rounded-xl hover:bg-gray-50 transition-all">
          CANCEL
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
          {loading ? "SAVING..." : "SAVE ROLE"}
        </button>
      </div>
    </form>
  );
}