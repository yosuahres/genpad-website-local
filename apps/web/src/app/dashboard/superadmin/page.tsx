// apps/web/src/app/dashboard/superadmin/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../constants/navigation";
import { Users, ShieldCheck, Activity, AlertCircle } from "lucide-react";
import { fetchFromBackend } from "../../../utils/api";

interface DashboardStats {
  totalAdmins: number;
  activeSessions: number;
  totalLogs: number;
  systemHealth: string;
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      try {
        // const data = await fetchFromBackend("/stats/superadmin-overview");
        // setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black">SuperAdmin</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Admins" 
            value={loading ? "..." : stats?.totalAdmins ?? 0} 
            icon={<Users className="w-6 h-6 text-blue-600" />}
            description="Active region administrators"
          />
          <StatsCard 
            title="System Health" 
            value={loading ? "..." : stats?.systemHealth ?? "Stable"} 
            icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
            description="Overall platform status"
          />
          <StatsCard 
            title="Recent Activities" 
            value={loading ? "..." : stats?.totalLogs ?? 0} 
            icon={<Activity className="w-6 h-6 text-purple-600" />}
            description="Logs in the last 24 hours"
          />
          <StatsCard 
            title="Security Alerts" 
            value="0" 
            icon={<AlertCircle className="w-6 h-6 text-red-600" />}
            description="Critical system alerts"
          />
        </div>

        {/* Placeholder for Recent Logs or Activity Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-black">Recent System Audit</h3>
          <div className="text-gray-400 text-sm text-center py-10 border-2 border-dashed rounded-lg">
            Activity stream visualization or detailed log preview goes here.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatsCard({ title, value, icon, description }: { 
  title: string; value: string | number; icon: React.ReactNode; description: string 
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-black mt-1">{value}</h3>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
}