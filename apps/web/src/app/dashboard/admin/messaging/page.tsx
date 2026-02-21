'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { Send, Loader2 } from 'lucide-react';

export default function MessagingPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch children with their parent_asuh details
      const res = await fetchFromBackend('/children?include=parent_asuh'); 
      setData(res.data || []);
    } catch (err) {
      console.error("Failed to load children list:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  const handleSend = async (childId: string) => {
    setSendingId(childId);
    try {
      // Updated to match the backend rewrite: 
      // Only childId is needed as the backend fetches the template automatically
      await fetchFromBackend('/messaging/send-card', {
        method: 'POST',
        body: JSON.stringify({ childId })
      });
      alert("Card sent successfully via Fonnte!");
    } catch (err: any) {
      alert(err.message || "Failed to send card");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Send Report Cards</h2>
        
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] text-slate-500 font-extrabold tracking-widest">
                <th className="py-4 px-6 border-r border-slate-200">Child Name</th>
                <th className="py-4 px-6 border-r border-slate-200">Parent Asuh</th>
                <th className="py-4 px-6 border-r border-slate-200">Phone</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="py-10 text-center text-slate-400">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-slate-400">No data found</td></tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-6 text-sm font-medium text-slate-700">{item.name}</td>
                    <td className="py-5 px-6 text-sm text-slate-600">{item.parent_asuh?.name || 'N/A'}</td>
                    <td className="py-5 px-6 text-sm font-mono text-slate-500">{item.parent_asuh?.phone || '-'}</td>
                    <td className="py-5 px-6 text-center">
                      <button 
                        onClick={() => handleSend(item.id)}
                        disabled={!item.parent_asuh || sendingId === item.id}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold uppercase disabled:bg-slate-300 hover:bg-indigo-700 transition-all shadow-sm"
                      >
                        {sendingId === item.id ? (
                          <>
                            <Loader2 className="animate-spin" size={14}/> 
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={14}/>
                            Send Card
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}