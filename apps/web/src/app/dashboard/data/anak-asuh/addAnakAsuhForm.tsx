"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

export function AddAnakAsuhForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const supabase = createClient();
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    child_code: "",
    name: "",
    region_id: "",
    education_level: "",
    academic_year_id: ""
  });

  useEffect(() => {
    const fetchRegions = async () => {
      const { data } = await supabase.from("regions").select("id, name");
      if (data) setRegions(data);
    };
    fetchRegions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("children").insert([formData]);
    setLoading(false);
    if (!error) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" 
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Child Code</label>
          <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none" 
            value={formData.child_code} onChange={(e) => setFormData({...formData, child_code: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Region</label>
          <select required className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
            value={formData.region_id} onChange={(e) => setFormData({...formData, region_id: e.target.value})}>
            <option value="">Select Region</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-semibold">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}