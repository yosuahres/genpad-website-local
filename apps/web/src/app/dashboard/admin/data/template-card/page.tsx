'use client';
import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { fetchFromBackend } from "../../../../../utils/api";
import { Trash2, MinusSquare, Plus, Pencil, Download, Square, CheckSquare2Icon } from 'lucide-react';
import { Modal } from "../../../../../components/common/modal";
import { Pagination } from "../../../../../components/common/pagination";
import { exportToExcel } from "../../../../../utils/exportutils";

export default function TemplateCardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', template_type: '' , template_file: '', is_active: true });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const loadData = useCallback(async () => {
    try {
      const response = await fetchFromBackend(`/template-cards?page=${page}&limit=${PAGE_SIZE}`);
      setItems(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE) || 1);
      setSelected(null);
    } catch (err) { console.error(err); }
  }, [page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `/template-cards/${editItem.id}` : '/template-cards';
    try {
      await fetchFromBackend(url, { method, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      setEditItem(null);
      setFormData({ name: '', template_type: '' , template_file: '', is_active: true });
      loadData();
    } catch (err) { alert("Action failed"); }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Template Cards Management</h2>
        <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100/80">
              <tr className="border-b border-slate-200">
                <th colSpan={3} className="py-4 px-6">
                  <div className="flex items-center gap-6">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 hover:text-black tracking-widest"><Plus size={18} /> Add New</button>
                    <button onClick={() => { setEditItem(selected); setFormData({ name: selected.name, template_type: selected.template_type, template_file: selected.template_file, is_active: selected.is_active }); setIsModalOpen(true); }} disabled={!selected} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${selected ? "text-slate-600" : "text-slate-300"}`}><Pencil size={18} /> Edit</button>
                    <button onClick={async () => { if(confirm('Delete?')) { await fetchFromBackend(`/template-cards/${selected.id}`, {method:'DELETE'}); loadData(); } }} disabled={!selected} className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${selected ? "text-slate-600 hover:text-red-600" : "text-slate-300"}`}><Trash2 size={18} /> Delete</button>
                    <button onClick={() => exportToExcel(items, 'Template Cards')} className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 tracking-widest"><Download size={18} /> Export</button>
                  </div>
                </th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] text-slate-500 font-extrabold tracking-widest">
                <th className="py-4 w-16 text-center border-r border-slate-200">{selected && <button onClick={() => setSelected(null)}><MinusSquare size={18} className="text-blue-600"/></button>}</th>
                <th className="py-4 px-6 border-r border-slate-200">Region Name</th>
                <th className="py-4 px-6">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} className={`cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                  <td className="py-5 text-center">{selected?.id === item.id ? <CheckSquare2Icon size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}</td>
                  <td className="py-5 px-6 text-sm border-r border-slate-100">{item.name}</td>
                  <td className="py-5 px-6 text-sm">{item.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Template Card" : "Create Template Card"}>
        <form onSubmit={handleAction} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          {/* <input className="w-full p-2 border rounded" placeholder="Is Active" value={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.value})} required /> */}
          <button className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Save</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}