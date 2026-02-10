// apps/web/src/components/common/table.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Pencil, Trash2, FileSpreadsheet, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, MoreVertical, ArrowDown, ArrowUp, Loader2, Search, X 
} from 'lucide-react';
import { exportToExcel } from "../../utils/exportutils";
import { fetchFromBackend } from "../../utils/api";

export default function MasterDataTable({ title, endpoint, columns, onAdd, onEdit, onDelete }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Derived state for pagination
  const totalPages = Math.ceil(total / limit) || 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fix: Use URLSearchParams to handle existing '?' in the endpoint
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (sortConfig.key) {
        params.append('sort', sortConfig.key);
        params.append('order', sortConfig.direction);
      }

      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${endpoint}${separator}${params.toString()}`;
      
      const res = await fetchFromBackend(url);
      setItems(res.data || []);
      setTotal(res.total || 0);
    } catch (e) { 
      console.error("Failed to load data:", e); 
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, limit, sortConfig, debouncedSearch]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setActiveMenu(null);
  };

  return (
    <div className="flex flex-col w-full border border-gray-300 bg-white rounded-md overflow-hidden shadow-sm">
      
      {/* TOOLBAR */}
      <div className="flex items-center justify-between h-14 border-b border-gray-300 px-3 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => exportToExcel(items, title)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 font-medium">
            <FileSpreadsheet size={18} /> <span>Export</span>
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button onClick={onAdd} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 font-medium">
            <Plus size={18} /> <span>Add</span>
          </button>
          <button disabled={!selected} onClick={() => onEdit(selected)} className="flex items-center gap-2 text-sm text-gray-700 disabled:opacity-30 font-medium text-nowrap">
            <Pencil size={18} /> <span>Edit</span>
          </button>
          <button disabled={!selected} onClick={() => onDelete(selected?.id)} className="flex items-center gap-2 text-sm text-gray-700 disabled:opacity-30 font-medium text-nowrap">
            <Trash2 size={18} /> <span>Delete</span>
          </button>
        </div>

        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-10 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="block w-full overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="table-fixed min-w-[1200px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50">
              <th className="sticky left-0 z-30 w-12 border-b border-r border-gray-300 bg-gray-50 p-2 text-center">
                <input type="checkbox" className="rounded-sm accent-blue-600" />
              </th>
              {columns.map((col: any) => (
                <th key={col.key} className="w-60 sticky top-0 z-20 border-b border-r border-gray-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between relative">
                    <span className="truncate flex items-center gap-2">
                      {col.label}
                      {sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-blue-600"/> : <ArrowDown size={12} className="text-blue-600"/>
                      )}
                    </span>
                    <button onClick={() => setActiveMenu(activeMenu === col.key ? null : col.key)} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700">
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === col.key && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>
                        <div className="absolute right-0 mt-8 w-40 bg-white border border-gray-200 rounded shadow-xl z-50 py-1 normal-case font-normal text-sm">
                          <button onClick={() => handleSort(col.key, 'asc')} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-gray-700">
                            <ArrowUp size={14} /> Sort Ascending
                          </button>
                          <button onClick={() => handleSort(col.key, 'desc')} className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-gray-700">
                            <ArrowDown size={14} /> Sort Descending
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="py-20 text-center text-gray-400">No records found.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} className={`group hover:bg-blue-50/50 transition-colors ${selected?.id === item.id ? 'bg-blue-50' : ''}`}>
                  <td className={`sticky left-0 z-10 border-r border-gray-200 p-2 text-center transition-colors ${selected?.id === item.id ? 'bg-blue-50' : 'bg-white group-hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={selected?.id === item.id} readOnly className="accent-blue-600" />
                  </td>
                  {columns.map((col: any) => (
                    <td key={col.key} className="border-r border-gray-200 px-4 py-3 text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                      {col.render ? col.render(item[col.key], item) : (item[col.key] || '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* UPDATED FOOTER */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-300 bg-white shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex border rounded border-gray-300 overflow-hidden shadow-sm text-gray-600">
            <button 
              disabled={page === 1}
              onClick={() => setPage(1)} 
              className="p-1.5 hover:bg-gray-100 border-r border-gray-300 disabled:opacity-30"
            >
              <ChevronsLeft size={18}/>
            </button>
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              className="p-1.5 hover:bg-gray-100 border-r border-gray-300 disabled:opacity-30"
            >
              <ChevronLeft size={18}/>
            </button>
            
            <div className="px-4 py-1.5 text-sm font-bold bg-blue-600 text-white flex items-center">
              {page}
            </div>

            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)} 
              className="p-1.5 hover:bg-gray-100 border-r border-gray-300 disabled:opacity-30"
            >
              <ChevronRight size={18}/>
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(totalPages)} 
              className="p-1.5 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronsRight size={18}/>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={limit}
              onChange={(e) => {setLimit(Number(e.target.value)); setPage(1);}}
              className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
            >
              {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Per Page</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
          Showing <span className="font-semibold text-gray-800">{items.length}</span> of <span className="font-semibold text-gray-800">{total}</span>
        </div>
      </div>
    </div>
  );
}