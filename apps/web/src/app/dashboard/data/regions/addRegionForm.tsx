"use client";

import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

export function AddRegionForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("regions").insert([formData]);
    setLoading(false);
    if (!error) onSuccess();
    else alert(error.message);
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium";
  const labelClass = "block text-sm font-bold text-black mb-2 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass}>Region Name</label>
        <input type="text" required className={inputClass} placeholder="e.g. Jawa Barat"
          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>
      <div>
        <label className={labelClass}>Region Code</label>
        <input type="text" required className={inputClass} placeholder="e.g. JBR"
          value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
      </div>
      <div className="flex gap-4 pt-6 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="flex-1 py-4 border border-gray-300 text-black font-bold rounded-xl hover:bg-gray-50 transition-all">
          CANCEL
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
          {loading ? "SAVING..." : "SAVE REGION"}
        </button>
      </div>
    </form>
  );
}