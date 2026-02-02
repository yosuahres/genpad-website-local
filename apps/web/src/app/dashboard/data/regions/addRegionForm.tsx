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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Region Name</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Jawa Barat"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Region Code</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="e.g. JBR"
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 active:scale-95 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading} 
          className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-semibold disabled:bg-gray-400 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200"
        >
          {loading ? "Saving..." : "Save Region"}
        </button>
      </div>
    </form>
  );
}