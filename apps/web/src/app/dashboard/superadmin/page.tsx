import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../constants/navigation";

export default function SuperAdminPage() {
  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Global Command Center</h2>
      {/* Content goes here */}
    </DashboardLayout>
  );
}