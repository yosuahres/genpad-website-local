// apps/web/src/app/dashboard/admin/data/regions/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { fetchFromBackend } from "../../../../../utils/api";
import { Trash2, Plus, Pencil, Download, Square, CheckSquare2Icon, MinusSquare } from 'lucide-react';
import { Modal } from "../../../../../components/common/modal";
import { Pagination } from "../../../../../components/common/pagination";
import { exportToExcel } from "../../../../../utils/exportutils";

interface Region {
  id: string;
  name: string;
  code: string;
}

export default function RegionsPage() {
  // --- State Management ---
  const [items, setItems] = useState<Region[]>([]);
  const [selected, setSelected] = useState<Region | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Region | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;

  // --- Data Actions ---
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFromBackend(`/regions?page=${page}&limit=${PAGE_SIZE}`);
      setItems(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE) || 1);
      setSelected(null);
    } catch (err) {
      console.error("Failed to load regions:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openModal = (item?: Region) => {
    if (item) {
      setEditItem(item);
      setFormData({ name: item.name, code: item.code });
    } else {
      setEditItem(null);
      setFormData({ name: '', code: '' });
    }
    setIsModalOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const url = editItem ? `/regions/${editItem.id}` : '/regions';
    
    try {
      await fetchFromBackend(url, { method, body: JSON.stringify(formData) });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert("Action failed. Please check your inputs.");
    }
  };

  const handleDelete = async () => {
    if (!selected || !confirm(`Delete region "${selected.name}"?`)) return;
    try {
      await fetchFromBackend(`/regions/${selected.id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // --- Render Helpers ---
  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl font-bold text-black tracking-tight">Regions Management</h2>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-sm">
          {/* Toolbar */}
          <div className="bg-slate-100/80 border-b border-slate-200 py-4 px-6 flex items-center gap-6">
            <button onClick={() => openModal()} className="toolbar-btn text-blue-600">
              <Plus size={18} /> Add New
            </button>
            <button 
              onClick={() => openModal(selected!)} 
              disabled={!selected} 
              className={`toolbar-btn ${!selected ? "text-slate-300" : "text-slate-600"}`}
            >
              <Pencil size={18} /> Edit
            </button>
            <button 
              onClick={handleDelete} 
              disabled={!selected} 
              className={`toolbar-btn ${!selected ? "text-slate-300" : "text-slate-600 hover:text-red-600"}`}
            >
              <Trash2 size={18} /> Delete
            </button>
            <div className="h-4 w-[1px] bg-slate-300 mx-2" />
            <button onClick={() => exportToExcel(items, 'Regions')} className="toolbar-btn text-slate-600">
              <Download size={18} /> Export
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] text-slate-500 font-extrabold tracking-widest">
                <th className="py-4 w-16 text-center border-r border-slate-200">
                  {selected && <button onClick={() => setSelected(null)}><MinusSquare size={18} className="text-blue-600 mx-auto"/></button>}
                </th>
                <th className="py-4 px-6 border-r border-slate-200">Region Name</th>
                <th className="py-4 px-6">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                 <tr><td colSpan={3} className="py-10 text-center text-slate-400">Loading...</td></tr>
              ) : items.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelected(selected?.id === item.id ? null : item)} 
                  className={`cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}
                >
                  <td className="py-5 text-center">
                    {selected?.id === item.id ? <CheckSquare2Icon size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-5 px-6 text-sm border-r border-slate-100 font-medium text-slate-700">{item.name}</td>
                  <td className="py-5 px-6 text-sm font-mono text-slate-500">{item.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            totalItems={items.length} 
            pageSize={PAGE_SIZE} 
            onPageChange={setPage} 
          />
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editItem ? "Edit Region" : "Create New Region"}
      >
        <form onSubmit={handleAction} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Region Name</label>
            <input 
              className="w-full p-2.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g. Southeast Asia" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Region Code</label>
            <input 
              className="w-full p-2.5 border border-slate-200 rounded text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g. SEA" 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
              required 
            />
          </div>
          <div className="pt-4">
            <button className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded text-sm font-bold transition-colors">
              {editItem ? "Update Region" : "Create Region"}
            </button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.2s;
        }
        .toolbar-btn:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </DashboardLayout>
  );
}