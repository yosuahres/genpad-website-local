'use client';

import { useState } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { Modal } from "../../../../../components/common/modal";
import MasterDataTable from "../../../../../components/common/table";
import { CheckCircle2, XCircle } from 'lucide-react';
import { fetchFromBackend } from "../../../../../utils/api";

export default function AcademicYearsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState({ year_label: '', is_active: false });

  const columns = [
    { key: 'year_label', label: 'Year Label', sortable: true },
    { 
      key: 'is_active', 
      label: 'Status', 
      render: (val: boolean) => val ? (
        <span className="flex items-center text-green-600 font-bold text-[10px] uppercase tracking-wider gap-1.5"><CheckCircle2 size={14}/> Active</span>
      ) : (
        <span className="flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-wider gap-1.5"><XCircle size={14}/> Inactive</span>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const endpoint = editItem ? `/academic-years/${editItem.id}` : '/academic-years';
    try {
      await fetchFromBackend(endpoint, { method, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      window.location.reload(); 
    } catch (err) {
      alert("Action failed. Ensure format is YYYY/YYYY");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this year?')) {
      await fetchFromBackend(`/academic-years/${id}`, { method: 'DELETE' });
      window.location.reload();
    }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <MasterDataTable 
          title="Academic Years"
          endpoint="/academic-years"
          columns={columns}
          onAdd={() => { setEditItem(null); setFormData({ year_label: '', is_active: true }); setIsModalOpen(true); }}
          onEdit={(item) => { setEditItem(item); setFormData(item); setIsModalOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Year" : "Create Year"}>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Year Label (YYYY/YYYY)</label>
            <input 
              className="w-full p-2.5 border border-slate-200 rounded text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/20" 
              placeholder="2024/2025" 
              value={formData.year_label} 
              onChange={e => setFormData({...formData, year_label: e.target.value})} 
              required 
            />
          </div>
          <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-indigo-600" 
              checked={formData.is_active} 
              onChange={e => setFormData({...formData, is_active: e.target.checked})} 
            />
            <span className="text-sm font-bold text-slate-700">Set as Active Year</span>
          </label>
          <button className="w-full bg-slate-900 text-white py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-black transition-all">
            Save Year
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}