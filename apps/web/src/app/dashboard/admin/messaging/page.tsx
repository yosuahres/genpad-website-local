// apps/web/src/app/dashboard/admin/messaging/page.tsx
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
      console.log('DEBUG: Fetching children list...');
      const res = await fetchFromBackend('/children?include=parent_asuh'); 
      console.log('DEBUG: Raw Data Received:', res.data);
      setData(res.data || []);
    } catch (err) {
      console.error('DEBUG: Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  const handleSend = async (childId: string) => {
    setSendingId(childId);
    console.log(`DEBUG: Initiating send for Child ID: ${childId}`);
    try {
      const response = await fetchFromBackend('/messaging/send-card', {
        method: 'POST',
        body: JSON.stringify({ childId })
      });
      console.log('DEBUG: Send Response:', response);
      alert("Sent successfully!");
    } catch (err: any) {
      console.error('DEBUG: Send Error Details:', err);
      alert(err.message || "Failed to send");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Send Report Cards</h2>
        <div className="bg-white border rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
              <tr>
                <th className="p-4 border-b">Child Name</th>
                <th className="p-4 border-b">Parent</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => {
                const parent = Array.isArray(item.parent_asuh) ? item.parent_asuh[0] : item.parent_asuh;
                const phoneNumber = parent?.phone_number;
                
                // Detailed debug for specific rows missing phone numbers
                if (!phoneNumber) {
                   console.warn(`DEBUG: Child "${item.name}" (ID: ${item.id}) is missing a phone number. Parent data:`, item.parent_asuh);
                }

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-6 text-sm font-medium text-slate-700">{item.name}</td>
                    <td className="py-5 px-6 text-sm text-slate-600">
                      {parent?.name || 'N/A'}
                    </td>
                    <td className="py-5 px-6 text-sm font-mono text-slate-500">
                      {phoneNumber || '-'}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleSend(item.id)}
                        disabled={!phoneNumber || sendingId === item.id}
                        className="bg-indigo-600 text-white px-4 py-2 rounded text-xs disabled:bg-slate-300"
                      >
                        {sendingId === item.id ? <Loader2 className="animate-spin" size={14}/> : <Send size={14}/>}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}