'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { Eye, Download, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Modal } from "../../../../components/common/modal";
import { Pagination } from "../../../../components/common/pagination";

export default function ReportsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFromBackend(`/documents?page=${page}&limit=${PAGE_SIZE}`);
      setItems(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE) || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadData(); }, [loadData]);

  const openPreview = (item: any) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Reports & Documents</h2>
        
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] text-slate-500 font-extrabold tracking-widest">
                <th className="py-4 px-6 border-r border-slate-200">Child</th>
                <th className="py-4 px-6 border-r border-slate-200">Type</th>
                <th className="py-4 px-6 border-r border-slate-200">Status</th>
                <th className="py-4 px-6 border-r border-slate-200">Size</th>
                <th className="py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? <tr><td colSpan={5} className="py-10 text-center text-slate-400">Loading...</td></tr> : 
                items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="font-medium text-sm text-slate-900">{item.child?.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{item.child?.child_code}</div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded uppercase">{item.document_type}</span>
                  </td>
                  <td className="py-5 px-6">
                    {item.upload_status === 'completed' ? 
                      <div className="flex items-center text-emerald-600 gap-1 text-xs font-bold"><CheckCircle2 size={14}/> SYNCED</div> :
                      <div className="flex items-center text-amber-500 gap-1 text-xs font-bold"><Clock size={14}/> PENDING</div>
                    }
                  </td>
                  <td className="py-5 px-6 text-sm text-slate-500">{(item.file_size / 1024).toFixed(1)} KB</td>
                  <td className="py-5 px-6">
                    <div className="flex gap-3">
                      <button onClick={() => openPreview(item)} className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>

      {/* Details & Preview Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Document Details">
        {selected && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-4 text-left">
              <DetailItem label="Child ID" value={selected.child_id} />
              <DetailItem label="Document Type" value={selected.document_type} />
              <DetailItem label="File Type" value={selected.file_type} />
              <DetailItem label="File Size" value={`${(selected.file_size / 1024).toFixed(2)} KB`} />
              <DetailItem label="Checksum" value={selected.checksum} isMono />
              <DetailItem label="Uploaded By" value={selected.uploader?.name || selected.uploaded_by} />
              <DetailItem label="Created At" value={new Date(selected.created_at).toLocaleString()} />
              <DetailItem label="Synced At" value={selected.synced_at ? new Date(selected.synced_at).toLocaleString() : 'N/A'} />
            </div>
            
            <div className="border-t border-slate-100 pt-6">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block">File Preview</label>
              <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center">
                <FileText size={48} className="text-slate-300 mb-4" />
                <p className="text-xs font-medium text-slate-600 mb-4 truncate max-w-full">{selected.file_path}</p>
                <a 
                  href={selected.file_path} 
                  target="_blank" 
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-black transition-all"
                >
                  <Download size={14} /> Download File
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function DetailItem({ label, value, isMono = false }: { label: string, value: string, isMono?: boolean }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">{label}</label>
      <div className={`text-sm font-semibold text-slate-700 truncate ${isMono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}