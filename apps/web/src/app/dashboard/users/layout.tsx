//dashboard/users/layout.tsx
import AdminLayout from "../../../components/Layouts/layout";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}