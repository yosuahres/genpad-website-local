// apps/web/src/app/dashboard/admin/data/children/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { fetchFromBackend } from "../../../../../utils/api";
import { Trash2, Plus, Pencil, Download, Square, CheckSquare2Icon, MinusSquare } from 'lucide-react';
import { Modal } from "../../../../../components/common/modal";
import { Pagination } from "../../../../../components/common/pagination";
import { exportToExcel } from "../../../../../utils/exportutils";

export default function ChildrenPage() {
  const [items, setItems] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    child_code: '', name: '', region_id: '', education_level: '', academic_year_id: '' 
  });
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFromBackend(`/children?page=${page}&limit=${PAGE_SIZE}`);
      setItems(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE) || 1);
      setSelected(null);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page]);

  const loadDropdowns = async () => {
    const [regRes, yearRes] = await Promise.all([
      fetchFromBackend('/regions'),
      fetchFromBackend('/academic-years')
    ]);
    setRegions(regRes.data || []);
    setAcademicYears(yearRes.data || []);
  };

  useEffect(() => { loadData(); loadDropdowns(); }, [loadData]);

  const openModal = (item?: any) => {
    setEditItem(item || null);
    setFormData(item ? 
      { child_code: item.child_code, name: item.name, region_id: item.region_id, education_level: item.education_level, academic_year_id: item.academic_year_id } : 
      { child_code: '', name: '', region_id: '', education_level: '', academic_year_id: '' }
    );
    setIsModalOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `/children/${editItem.id}` : '/children';
    try {
      await fetchFromBackend(url, { method, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      loadData();
    } catch (err) { alert("Action failed"); }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Children (Anak Asuh)</h2>
        
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
          {/* Toolbar */}
          <div className="bg-slate-100/80 border-b border-slate-200 py-4 px-6 flex items-center gap-6">
            <button onClick={() => openModal()} className="toolbar-btn text-blue-600"><Plus size={18} /> Add New</button>
            <button onClick={() => openModal(selected)} disabled={!selected} className={`toolbar-btn ${selected ? "text-slate-600" : "text-slate-300"}`}><Pencil size={18} /> Edit</button>
            <button onClick={async () => { if(confirm('Delete?')) { await fetchFromBackend(`/children/${selected.id}`, {method:'DELETE'}); loadData(); } }} disabled={!selected} className={`toolbar-btn ${selected ? "text-slate-600 hover:text-red-600" : "text-slate-300"}`}><Trash2 size={18} /> Delete</button>
            <button onClick={() => exportToExcel(items, 'Children')} className="toolbar-btn text-slate-600"><Download size={18} /> Export</button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] text-slate-500 font-extrabold tracking-widest">
                <th className="py-4 w-16 text-center border-r border-slate-200">{selected && <button onClick={() => setSelected(null)}><MinusSquare size={18} className="text-blue-600 mx-auto"/></button>}</th>
                <th className="py-4 px-6 border-r border-slate-200">Child Code</th>
                <th className="py-4 px-6 border-r border-slate-200">Name</th>
                <th className="py-4 px-6 border-r border-slate-200">Region</th>
                <th className="py-4 px-6">Education</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? <tr><td colSpan={5} className="py-10 text-center text-slate-400">Loading...</td></tr> : 
                items.map((item) => (
                <tr key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} className={`cursor-pointer ${selected?.id === item.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                  <td className="py-5 text-center">{selected?.id === item.id ? <CheckSquare2Icon size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}</td>
                  <td className="py-5 px-6 text-xs font-mono font-bold text-slate-500">{item.child_code}</td>
                  <td className="py-5 px-6 text-sm font-medium">{item.name}</td>
                  <td className="py-5 px-6 text-sm">{item.region?.name || 'Unknown'}</td>
                  <td className="py-5 px-6 text-sm">{item.education_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Child" : "Add Child"}>
        <form onSubmit={handleAction} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Child Code</label>
              <input className="w-full p-2.5 border border-slate-200 rounded text-sm font-mono" value={formData.child_code} onChange={e => setFormData({...formData, child_code: e.target.value})} required />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Education Level</label>
              <select className="w-full p-2.5 border border-slate-200 rounded text-sm bg-white" value={formData.education_level} onChange={e => setFormData({...formData, education_level: e.target.value})} required>
                <option value="">Select Level</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="KULIAH">KULIAH</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Full Name</label>
            <input className="w-full p-2.5 border border-slate-200 rounded text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Region</label>
            <select className="w-full p-2.5 border border-slate-200 rounded text-sm bg-white" value={formData.region_id} onChange={e => setFormData({...formData, region_id: e.target.value})} required>
              <option value="">Select Region</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Academic Year</label>
            <select className="w-full p-2.5 border border-slate-200 rounded text-sm bg-white" value={formData.academic_year_id} onChange={e => setFormData({...formData, academic_year_id: e.target.value})} required>
              <option value="">Select Year</option>
              {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_label}</option>)}
            </select>
          </div>
          <button className="w-full bg-slate-900 text-white py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-black">Save Data</button>
        </form>
      </Modal>

      <style jsx>{`.toolbar-btn { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; } .toolbar-btn:disabled { opacity: 0.5; cursor: not-allowed; }`}</style>
    </DashboardLayout>
  );
}