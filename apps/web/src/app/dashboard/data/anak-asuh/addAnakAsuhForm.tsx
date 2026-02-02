"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

export function AddAnakAsuhForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const supabase = createClient();
  const [regions, setRegions] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    child_code: "",
    name: "",
    region_id: "",
    education_level: "",
    academic_year_id: ""
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      const [reg, year] = await Promise.all([
        supabase.from("regions").select("id, name"),
        supabase.from("academic_years").select("id, year_label").order("year_label", { ascending: false })
      ]);
      if (reg.data) setRegions(reg.data);
      if (year.data) setAcademicYears(year.data);
    };
    fetchMetadata();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("children").insert([{
        ...formData,
        academic_year_id: parseInt(formData.academic_year_id),
        created_by: user?.id
      }]);
      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-xl text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium";
  const labelClass = "block text-sm font-bold text-black mb-2 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className={labelClass}>Full Name</label>
          <input type="text" required className={inputClass} value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Child Code</label>
          <input type="text" required className={inputClass} value={formData.child_code}
            onChange={(e) => setFormData({...formData, child_code: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Region</label>
          <select required className={inputClass} value={formData.region_id}
            onChange={(e) => setFormData({...formData, region_id: e.target.value})}>
            <option value="">Select Region</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Education Level</label>
          <select required className={inputClass} value={formData.education_level}
            onChange={(e) => setFormData({...formData, education_level: e.target.value})}>
            <option value="">Select Level</option>
            {["SD", "SMP", "SMA", "Kuliah"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Academic Year</label>
          <select required className={inputClass} value={formData.academic_year_id}
            onChange={(e) => setFormData({...formData, academic_year_id: e.target.value})}>
            <option value="">Select Year</option>
            {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-4 pt-6 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="flex-1 py-4 border border-gray-300 text-black font-bold rounded-xl hover:bg-gray-50 transition-all">
          CANCEL
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-lg">
          {loading ? "SAVING..." : "SAVE CHILD DATA"}
        </button>
      </div>
    </form>
  );
}