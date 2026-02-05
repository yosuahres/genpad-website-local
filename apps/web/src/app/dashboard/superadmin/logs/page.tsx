// apps/web/src/app/dashboard/superadmin/logs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { History, ChevronRight, Clock, Search, Trash2, X } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchFromBackend('/audit/logs');
      setLogs(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadLogs(); }, []);

  const handleClear = async () => {
    if (!confirm("Clear all history permanently?")) return;
    try {
      await fetchFromBackend('/audit/logs', { method: 'DELETE' });
      setLogs([]);
    } catch (err) { alert("Failed to clear logs"); }
  };

  const filteredLogs = logs.filter(log => 
    `${log.users?.name} ${log.action} ${log.entity_type} ${log.users?.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatKey = (k: string) => {
    const map: any = { role_id: 'Access Level', name: 'Name', email: 'Email' };
    return map[k] || k;
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <History size={20} /> Activity Logs
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search logs..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button onClick={handleClear} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <Trash2 size={16} /> Clear History
          </button>
        </div>
      </div>

      <div className="w-full border-t border-slate-200">
        <div className="flex px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="w-8"></div>
          <div className="flex-1">Description</div>
          <div className="w-48 text-right pr-4">Change by</div>
          <div className="w-48 text-right">Date & Time</div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400 italic">Loading activity...</div>
        ) : filteredLogs.map((log) => (
          <div key={log.id} className="border-b border-slate-100">
            <div 
              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              className="flex items-center px-6 py-4 hover:bg-slate-50/80 cursor-pointer text-sm transition-colors"
            >
              <div className="w-8">
                <ChevronRight size={14} className={`text-slate-300 transition-transform ${expandedId === log.id ? 'rotate-90 text-indigo-500' : ''}`} />
              </div>
              <div className="flex-1 text-slate-700">
                <span className="font-bold text-black">{log.users?.name || 'System'}</span>
                <span className="text-slate-500 mx-2">
                  {log.action.includes('CREATE') ? 'created' : log.action.includes('UPDATE') ? 'modified' : 'removed'}
                </span>
                <span className="font-medium text-black capitalize">{log.entity_type}</span>
              </div>
              <div className="w-48 text-right text-slate-400 text-xs pr-4 truncate">{log.users?.email}</div>
              <div className="w-48 text-right text-slate-400 text-xs">
                {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            </div>

            {expandedId === log.id && (
              <div className="px-14 pb-4 bg-slate-50/30">
                <div className="border-l-2 border-slate-200 pl-6 py-2 space-y-1">
                  {log.action.includes('UPDATE') ? (
                    Object.keys(log.new_value || {}).map(key => {
                      if (JSON.stringify(log.old_value?.[key]) === JSON.stringify(log.new_value?.[key]) || key === 'updated_at') return null;
                      return (
                        <div key={key} className="text-xs py-0.5">
                          <span className="text-slate-500 w-24 inline-block font-medium">{formatKey(key)}:</span>
                          <span className="text-slate-400 line-through mr-2">{String(log.old_value?.[key] || 'None')}</span>
                          <span className="text-slate-300 mr-2">→</span>
                          <span className="text-black font-bold">{String(log.new_value?.[key])}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-400 italic">Full data {log.action.includes('CREATE') ? 'added' : 'removed'} for ID: {log.entity_id}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}