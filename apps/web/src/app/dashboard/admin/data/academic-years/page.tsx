// apps/web/src/app/dashboard/admin/data/academic-years/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { fetchFromBackend } from "../../../../../utils/api";
import { Trash2, Plus, Pencil, Download, Square, CheckSquare2Icon, MinusSquare, CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from "../../../../../components/common/modal";
import { Pagination } from "../../../../../components/common/pagination";
import { exportToExcel } from "../../../../../utils/exportutils";

interface AcademicYear {
  id: string;
  year_label: string;
  is_active: boolean;
}

export default function AcademicYearsPage() {
  const [items, setItems] = useState<AcademicYear[]>([]);
  const [selected, setSelected] = useState<AcademicYear | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AcademicYear | null>(null);
  const [formData, setFormData] = useState({ year_label: '', is_active: false });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFromBackend(`/academic-years?page=${page}&limit=${PAGE_SIZE}`);
      setItems(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE) || 1);
      setSelected(null);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openModal = (item?: AcademicYear) => {
    setEditItem(item || null);
    setFormData(item ? { year_label: item.year_label, is_active: item.is_active } : { year_label: '', is_active: false });
    setIsModalOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `/academic-years/${editItem.id}` : '/academic-years';
    try {
      await fetchFromBackend(url, { method, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      loadData();
    } catch (err) { alert("Action failed. Ensure format is YYYY/YYYY"); }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Academic Years</h2>
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="bg-slate-100/80 border-b border-slate-200 py-4 px-6 flex items-center gap-6">
            <button onClick={() => openModal()} className="toolbar-btn text-blue-600"><Plus size={18} /> Add New</button>
            <button onClick={() => openModal(selected!)} disabled={!selected} className={`toolbar-btn ${selected ? "text-slate-600" : "text-slate-300"}`}><Pencil size={18} /> Edit</button>
            <button onClick={async () => { if(confirm('Delete?')) { await fetchFromBackend(`/academic-years/${selected?.id}`, {method:'DELETE'}); loadData(); } }} disabled={!selected} className={`toolbar-btn ${selected ? "text-slate-600 hover:text-red-600" : "text-slate-300"}`}><Trash2 size={18} /> Delete</button>
            <button onClick={() => exportToExcel(items, 'AcademicYears')} className="toolbar-btn text-slate-600"><Download size={18} /> Export</button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] text-slate-500 font-extrabold tracking-widest">
                <th className="py-4 w-16 text-center border-r border-slate-200">{selected && <button onClick={() => setSelected(null)}><MinusSquare size={18} className="text-blue-600 mx-auto"/></button>}</th>
                <th className="py-4 px-6 border-r border-slate-200">Year Label</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? <tr><td colSpan={3} className="py-10 text-center text-slate-400">Loading...</td></tr> : 
                items.map((item) => (
                <tr key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} className={`cursor-pointer ${selected?.id === item.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                  <td className="py-5 text-center">{selected?.id === item.id ? <CheckSquare2Icon size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}</td>
                  <td className="py-5 px-6 text-sm border-r border-slate-100 font-medium">{item.year_label}</td>
                  <td className="py-5 px-6 text-sm">
                    {item.is_active ? 
                      <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px] uppercase tracking-wider"><CheckCircle2 size={14}/> Active</span> : 
                      <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-wider"><XCircle size={14}/> Inactive</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Year" : "Create Year"}>
        <form onSubmit={handleAction} className="space-y-5 pt-2">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Year Label (YYYY/YYYY)</label>
            <input className="w-full p-2.5 border border-slate-200 rounded text-sm font-mono" placeholder="2024/2025" value={formData.year_label} onChange={e => setFormData({...formData, year_label: e.target.value})} required />
          </div>
          <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" className="w-4 h-4 accent-indigo-600" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
            <span className="text-sm font-bold text-slate-700">Set as Active Year</span>
          </label>
          <button className="w-full bg-slate-900 text-white py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-black">Save Year</button>
        </form>
      </Modal>

      <style jsx>{`.toolbar-btn { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.2s; } .toolbar-btn:disabled { opacity: 0.5; cursor: not-allowed; }`}</style>
    </DashboardLayout>
  );
}