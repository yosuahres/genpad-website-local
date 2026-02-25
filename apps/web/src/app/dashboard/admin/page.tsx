'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../constants/navigation";
import { fetchFromBackend } from "../../../utils/api";
import { 
  Users, 
  Baby, 
  MapPin, 
  Send, 
  FileText, 
  PlusCircle,
  Loader2,
  AlertCircle
} from "lucide-react";

interface DashboardStats {
  childrenCount: number;
  parentsCount: number;
  regionsCount: number;
  documentsCount: number;
  recentReports: any[];
  isLoading: boolean;
  error: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    childrenCount: 0,
    parentsCount: 0,
    regionsCount: 0,
    documentsCount: 0,
    recentReports: [],
    isLoading: true,
    error: null
  });

  // Fetch data from NestJS Controllers
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [children, parents, regions, documents] = await Promise.all([
          fetchFromBackend('/children?limit=1'), //
          fetchFromBackend('/parent-asuh?page=1'), //
          fetchFromBackend('/regions?limit=1'), //
          fetchFromBackend('/documents?limit=5') //
        ]);

        setStats({
          childrenCount: children.total || 0,
          parentsCount: parents.total || 0,
          regionsCount: regions.total || 0,
          documentsCount: documents.total || 0,
          recentReports: documents.data || [],
          isLoading: false,
          error: null
        });
      } catch (err) {
        setStats(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Failed to load dashboard data. Please check your connection." 
        }));
      }
    }
    loadDashboardData();
  }, []);

  // Quick Action: Trigger Messaging Service
  const handleBroadcast = async () => {
    const confirmSend = confirm("Send report notifications to all parents?");
    if (!confirmSend) return;

    try {
      // Triggering the messaging controller
      await fetchFromBackend('/messaging/send-card', {
        method: 'POST',
        body: JSON.stringify({ broadcast: true }),
      });
      alert("Broadcast initiated!");
    } catch (error) {
      alert("Error sending broadcast. Verify childId requirements in API.");
    }
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="space-y-6 p-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Overview of Genpad Management System</p>
        </div>

        {stats.error && (
          <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{stats.error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Anak Asuh" value={stats.childrenCount} icon={Baby} loading={stats.isLoading} />
          <StatCard title="Parent Asuh" value={stats.parentsCount} icon={Users} loading={stats.isLoading} />
          <StatCard title="Regions" value={stats.regionsCount} icon={MapPin} loading={stats.isLoading} />
          <StatCard title="Total Reports" value={stats.documentsCount} icon={FileText} loading={stats.isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 text-sm">Latest Document Activity</h3>
              <button onClick={() => router.push('/dashboard/admin/reports')} className="text-xs text-blue-600 font-medium">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3">Child</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentReports.map((report: any) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{report.child_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-600">{report.type || 'Report'}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(report.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {!stats.isLoading && stats.recentReports.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400">No recent reports.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Functional Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <ActionButton 
                  label="Broadcast Whatsapp" 
                  icon={Send} 
                  onClick={handleBroadcast} 
                  color="text-blue-600 bg-blue-50" 
                />
                <ActionButton 
                  label="Add New Child" 
                  icon={PlusCircle} 
                  onClick={() => router.push('/dashboard/admin/data/children')} 
                  color="text-green-600 bg-green-50" 
                />
                <ActionButton 
                  label="Manage Parents" 
                  icon={Users} 
                  onClick={() => router.push('/dashboard/admin/data/parent-asuh')} 
                  color="text-purple-600 bg-purple-50" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Sub-components for cleaner code
function StatCard({ title, value, icon: Icon, loading }: any) {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-gray-300 mt-2" /> : <h3 className="text-xl font-bold mt-1 text-gray-900">{value}</h3>}
      </div>
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Icon className="w-5 h-5" /></div>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-all active:scale-95 ${color}`}
    >
      <Icon className="w-4 h-4 mr-3" />
      {label}
    </button>
  );
}