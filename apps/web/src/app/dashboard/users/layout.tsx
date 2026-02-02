//dashboard/users/layout.tsx
import AdminLayout from "../../../components/Layouts/DashboardLayout";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}