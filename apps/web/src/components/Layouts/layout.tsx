// app/admin/layout.tsx
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-100 overflow-y-auto">
        <Header />
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}