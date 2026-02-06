'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Download, Square, CheckSquare2Icon, MinusSquare } from 'lucide-react';
import { exportToExcel } from "../../utils/exportutils";
import { Pagination } from "../common/pagination";
import { fetchFromBackend } from "../../utils/api";

interface MasterTableProps {
  title: string;
  endpoint: string;
  columns: { key: string; label: string; render?: (val: any) => React.ReactNode }[];
  FormComponent: React.FC<{ initialData?: any; onSuccess: () => void }>;
}

export default function MasterDataTable({ title, endpoint, columns, FormComponent }: MasterTableProps) {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    const res = await fetchFromBackend(`${endpoint}?page=${page}&limit=10`);
    setItems(res.data || []);
    setTotal(res.total || 0);
  }, [endpoint, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-4">
          <button onClick={() => { setSelected(null); setIsModalOpen(true); }} className="flex items-center gap-2 text-xs font-black uppercase"><Plus size={18}/> Add</button>
          <button onClick={() => setIsModalOpen(true)} disabled={!selected} className="disabled:opacity-30 flex items-center gap-2 text-xs font-black uppercase"><Pencil size={18}/> Edit</button>
          <button onClick={async () => { if(confirm('Delete?')) { await fetchFromBackend(`${endpoint}/${selected.id}`, {method:'DELETE'}); load(); }}} disabled={!selected} className="disabled:opacity-30 text-red-600 flex items-center gap-2 text-xs font-black uppercase"><Trash2 size={18}/> Delete</button>
          <button onClick={() => exportToExcel(items, title)} className="flex items-center gap-2 text-xs font-black uppercase"><Download size={18}/> Export</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-extrabold tracking-widest text-slate-500">
            <tr>
              <th className="py-4 w-16 text-center border-r border-slate-200">
                {selected && <MinusSquare className="mx-auto text-blue-600 cursor-pointer" onClick={() => setSelected(null)} />}
              </th>
              {columns.map(col => <th key={col.key} className="px-6 py-4 border-r border-slate-200 last:border-r-0">{col.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} onClick={() => setSelected(item)} className={`cursor-pointer hover:bg-slate-50 ${selected?.id === item.id ? 'bg-blue-50' : ''}`}>
                <td className="py-4 text-center">
                  {selected?.id === item.id ? <CheckSquare2Icon size={18} className="text-blue-600 mx-auto" /> : <Square size={18} className="text-slate-300 mx-auto" />}
                </td>
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 text-sm">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={page} totalPages={Math.ceil(total/10)} totalItems={total} pageSize={10} onPageChange={setPage} />
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <FormComponent initialData={selected} onSuccess={() => { setIsModalOpen(false); load(); }} />
            <button onClick={() => setIsModalOpen(false)} className="mt-4 text-sm text-slate-500 underline w-full text-center">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}