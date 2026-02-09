'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, Download, Square, CheckSquare2Icon, 
  MinusSquare, ArrowUp, ArrowDown, ArrowUpDown 
} from 'lucide-react';
import { exportToExcel } from "../../utils/exportutils";
import { Pagination } from "./pagination";
import { fetchFromBackend } from "../../utils/api";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (val: any, item: any) => React.ReactNode;
}

interface MasterTableProps {
  title: string;
  endpoint: string;
  columns: Column[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export default function MasterDataTable({ title, endpoint, columns, onAdd, onEdit, onDelete }: MasterTableProps) {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });

  const load = useCallback(async () => {
    setLoading(true);
    let url = `${endpoint}?page=${page}&limit=10`;
    if (sortConfig.key && sortConfig.direction) {
      url += `&sort=${sortConfig.key}&order=${sortConfig.direction}`;
    }
    const res = await fetchFromBackend(url);
    setItems(res.data || []);
    setTotal(res.total || 0);
    setLoading(false);
  }, [endpoint, page, sortConfig]);

  useEffect(() => { load(); }, [load]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => exportToExcel(items, title)} className="toolbar-btn"><Download size={18}/> Export</button>
          {onAdd && <button onClick={onAdd} className="toolbar-btn bg-blue-600 text-white"><Plus size={18}/> Add New</button>}
          {onEdit && <button onClick={() => onEdit(selected)} disabled={!selected} className="toolbar-btn"><Pencil size={18}/> Edit</button>}
          {onDelete && <button onClick={() => onDelete(selected.id)} disabled={!selected} className="toolbar-btn text-red-600"><Trash2 size={18}/> Delete</button>}
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-extrabold uppercase tracking-widest">
          <tr>
            <th className="py-4 w-16 text-center">
              {selected ? <button onClick={() => setSelected(null)}><MinusSquare size={18} className="text-blue-600 mx-auto"/></button> : <Square size={18} className="mx-auto"/>}
            </th>
            {columns.map(col => (
              <th key={col.key} className="py-4 px-4 cursor-pointer hover:bg-slate-100" onClick={() => col.sortable !== false && handleSort(col.key)}>
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable !== false && (
                    sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>) : <ArrowUpDown size={14} className="opacity-30"/>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} onClick={() => setSelected(item)} className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${selected?.id === item.id ? 'bg-blue-50/50' : ''}`}>
              <td className="py-4 text-center">
                {selected?.id === item.id ? <CheckSquare2Icon size={20} className="text-blue-600 mx-auto"/> : <Square size={20} className="text-slate-300 mx-auto"/>}
              </td>
              {columns.map(col => (
                <td key={col.key} className="py-4 px-4 text-sm text-slate-600">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={page} totalPages={Math.ceil(total / 10)} onPageChange={setPage} />
    </div>
  );
}