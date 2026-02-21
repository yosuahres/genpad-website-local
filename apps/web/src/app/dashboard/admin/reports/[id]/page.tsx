'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { fetchFromBackend } from "../../../../../utils/api";
import { 
  ArrowLeft, FileText, Download, Clock, CheckCircle2, 
  User, Calendar, ShieldCheck, HardDrive 
} from 'lucide-react';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDocument = useCallback(async () => {
    try {
      const data = await fetchFromBackend(`/documents/${id}`);
      setDoc(data);
    } catch (err) {
      console.error("Failed to load document", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadDocument(); }, [loadDocument]);

  if (loading) return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-8 text-center text-slate-500 font-medium">Loading document...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-black mb-8 group transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Reports</span>
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Metadata Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-8">Document Details</h2>
              <div className="space-y-6">
                <DetailRow icon={<User size={16}/>} label="Child" value={doc.child?.name || doc.child_id} />
                <DetailRow icon={<FileText size={16}/>} label="Type" value={doc.document_type} />
                <DetailRow icon={<HardDrive size={16}/>} label="Format & Size" value={`${doc.file_type} • ${(doc.file_size / 1024).toFixed(2)} KB`} />
                <DetailRow 
                  icon={doc.upload_status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-500"/> : <Clock size={16} className="text-amber-500"/>} 
                  label="Status" value={doc.upload_status} highlight 
                />
                <DetailRow icon={<ShieldCheck size={16}/>} label="Checksum" value={doc.checksum} isMono />
                <DetailRow icon={<User size={16}/>} label="Uploader" value={doc.uploader?.name || doc.uploaded_by} />
                <DetailRow icon={<Calendar size={16}/>} label="Created" value={new Date(doc.created_at).toLocaleString()} />
                <DetailRow icon={<Calendar size={16}/>} label="Synced" value={doc.synced_at ? new Date(doc.synced_at).toLocaleString() : 'Pending'} />
              </div>
              <a href={doc.file_path} target="_blank" download className="mt-10 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                <Download size={18} /> Download
              </a>
            </div>
          </div>

          <div className="xl:col-span-3">
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm h-[850px] flex flex-col">
              <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><FileText size={16} className="text-slate-500" /></div>
                  <span className="text-xs font-bold text-slate-500 font-mono truncate max-w-md">{doc.file_path}</span>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-200/50">
                {doc.file_type === 'application/pdf' ? (
                  <iframe src={`${doc.file_path}#toolbar=0`} className="w-full h-full border-none" title="PDF Preview" />
                ) : doc.file_type.startsWith('image/') ? (
                  <div className="w-full h-full flex items-center justify-center p-12">
                    <img src={doc.file_path} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white" />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText size={80} className="mb-6 opacity-20" />
                    <p className="font-bold text-slate-600">Preview Unavailable</p>
                    <p className="text-sm mt-2">This file type cannot be rendered in browser.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ icon, label, value, isMono = false, highlight = false }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-slate-300">{icon}</div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">{label}</span>
        <span className={`text-sm font-bold block truncate ${highlight ? 'text-blue-600 uppercase' : 'text-slate-700'} ${isMono ? 'font-mono text-[11px]' : ''}`}>
          {value}
        </span>
      </div>
    </div>
  );
}