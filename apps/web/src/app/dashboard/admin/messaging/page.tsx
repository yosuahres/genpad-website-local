// apps/web/src/app/dashboard/admin/messaging/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { Send, Loader2, Wifi, WifiOff, QrCode, LogOut } from 'lucide-react';

export default function MessagingPage() {
  const [data, setData] = useState([]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  
  // WhatsApp connection state
  const [waStatus, setWaStatus] = useState<{ connected: boolean; connecting: boolean }>({ connected: false, connecting: false });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check WhatsApp connection status
  const checkWAStatus = useCallback(async () => {
    try {
      const res = await fetchFromBackend('/messaging/status');
      setWaStatus(res);
      if (res.connected) setQrCode(null);
      return res;
    } catch (err) {
      console.error('WA Status Error:', err);
      return null;
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  // Request QR code for pairing
  const requestQR = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetchFromBackend('/messaging/qr');
      if (res.connected) {
        setWaStatus({ connected: true, connecting: false });
        setQrCode(null);
      } else if (res.qr) {
        setQrCode(res.qr);
        setWaStatus({ connected: false, connecting: true });
        // Poll for connection status while QR is shown
        const interval = setInterval(async () => {
          const status = await checkWAStatus();
          if (status?.connected) {
            clearInterval(interval);
            setQrCode(null);
          }
        }, 3000);
        // Stop polling after 2 minutes
        setTimeout(() => clearInterval(interval), 120000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to get QR code');
    } finally {
      setCheckingStatus(false);
    }
  };

  // Disconnect WhatsApp
  const disconnectWA = async () => {
    if (!confirm('Disconnect WhatsApp? You will need to scan QR again.')) return;
    try {
      await fetchFromBackend('/messaging/disconnect', { method: 'POST' });
      setWaStatus({ connected: false, connecting: false });
      setQrCode(null);
    } catch (err: any) {
      alert(err.message || 'Failed to disconnect');
    }
  };

  const loadList = useCallback(async () => {
    try {
      const res = await fetchFromBackend('/children?include=parent_asuh'); 
      setData(res.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  }, []);

  useEffect(() => {
    checkWAStatus();
    loadList();
  }, [checkWAStatus, loadList]);

  const handleSend = async (childId: string) => {
    if (!waStatus.connected) {
      alert('WhatsApp is not connected. Please scan the QR code first.');
      return;
    }
    setSendingId(childId);
    try {
      await fetchFromBackend('/messaging/send-card', {
        method: 'POST',
        body: JSON.stringify({ childId })
      });
      alert("Sent successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to send");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Send Report Cards</h2>

        {/* WhatsApp Connection Status Card */}
        <div className={`mb-6 p-4 rounded-lg border ${
          waStatus.connected 
            ? 'bg-green-50 border-green-200' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {waStatus.connected ? (
                <Wifi className="text-green-600" size={20} />
              ) : (
                <WifiOff className="text-amber-600" size={20} />
              )}
              <div>
                <p className={`font-semibold text-sm ${waStatus.connected ? 'text-green-800' : 'text-amber-800'}`}>
                  {waStatus.connected ? 'WhatsApp Connected' : 'WhatsApp Disconnected'}
                </p>
                <p className={`text-xs ${waStatus.connected ? 'text-green-600' : 'text-amber-600'}`}>
                  {waStatus.connected 
                    ? 'Ready to send messages with images' 
                    : 'Scan QR code to connect your WhatsApp'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {waStatus.connected ? (
                <button 
                  onClick={disconnectWA}
                  className="flex items-center gap-2 px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  <LogOut size={14} /> Disconnect
                </button>
              ) : (
                <button 
                  onClick={requestQR}
                  disabled={checkingStatus}
                  className="flex items-center gap-2 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {checkingStatus ? <Loader2 className="animate-spin" size={14} /> : <QrCode size={14} />}
                  {checkingStatus ? 'Loading...' : 'Show QR Code'}
                </button>
              )}
            </div>
          </div>

          {/* QR Code Display */}
          {qrCode && !waStatus.connected && (
            <div className="mt-4 p-4 bg-white rounded-lg border text-center">
              <p className="text-sm text-slate-600 mb-3">
                Open WhatsApp on your phone &gt; Settings &gt; Linked Devices &gt; Link a Device
              </p>
              <div className="inline-block p-4 bg-white border-2 border-slate-200 rounded-xl">
                {/* Render QR code as text (the API returns a QR string, render via img with qr API) */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCode)}`} 
                  alt="WhatsApp QR Code" 
                  width={256} 
                  height={256}
                  className="mx-auto"
                />
              </div>
              <p className="text-xs text-slate-400 mt-3">QR code refreshes automatically. Waiting for scan...</p>
            </div>
          )}
        </div>
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
                        disabled={!phoneNumber || !waStatus.connected || sendingId === item.id}
                        className="bg-indigo-600 text-white px-4 py-2 rounded text-xs disabled:bg-slate-300"
                        title={!waStatus.connected ? 'Connect WhatsApp first' : ''}
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