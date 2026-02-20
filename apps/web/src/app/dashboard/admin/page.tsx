import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../constants/navigation";

export default function AdminPage() {
  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <h2 className="text-2xl font-bold text-black-800 mb-6">Admin Dashboard</h2>
      {/* Content goes here */}
    </DashboardLayout>
  );
}