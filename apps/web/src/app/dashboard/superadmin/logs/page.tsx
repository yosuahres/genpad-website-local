'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { History, User, PlusCircle, Pencil, Trash2, Package } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchFromBackend('/audit/logs');
        setLogs(data || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT': return <PlusCircle className="text-green-500" size={20} />;
      case 'UPDATE': return <Pencil className="text-blue-500" size={20} />;
      case 'DELETE': return <Trash2 className="text-red-500" size={20} />;
      default: return <Package className="text-slate-500" size={20} />;
    }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <History size={24} /> Activity Feed
        </h2>
      </div>

      <div className="max-w-4xl">
        {loading ? (
          <div className="flex justify-center p-12 text-slate-400">Loading activities...</div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No activities recorded yet.
          </div>
        ) : (
          <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
            {logs.map((log) => (
              <div key={log.id} className="relative flex items-start gap-4 group">
                {/* Icon Column */}
                <div className="relative flex items-center justify-center bg-white rounded-full w-10 h-10 shadow-sm border border-slate-200 z-10 shrink-0 group-hover:border-indigo-300 transition-colors">
                  {getActionIcon(log.action)}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-bold text-black mr-2">
                        {log.users?.name || 'System User'}
                      </span>
                      <span className="text-sm text-slate-600">
                        {log.action === 'INSERT' && 'created a new'}
                        {log.action === 'UPDATE' && 'modified'}
                        {log.action === 'DELETE' && 'removed'}
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded mx-1 text-xs">
                          {log.entity_type}
                        </span>
                      </span>
                    </div>
                    <time className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </time>
                  </div>

                  {/* Changes Section */}
                  <div className="mt-3 text-sm">
                    {log.action === 'UPDATE' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Before</p>
                          <pre className="text-xs text-red-600 whitespace-pre-wrap font-mono break-all">
                            {JSON.stringify(log.old_value, null, 2)}
                          </pre>
                        </div>
                        <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-3">
                          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">After</p>
                          <pre className="text-xs text-green-700 whitespace-pre-wrap font-mono break-all">
                            {JSON.stringify(log.new_value, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                          {log.action === 'INSERT' ? 'New Data' : 'Deleted Data'}
                        </p>
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                          {JSON.stringify(log.action === 'INSERT' ? log.new_value : log.old_value, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    Entity ID: {log.entity_id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}