import Sidebar from "../../../components/Layouts/sidebar/Sidebar";
import Header from "../../../components/Layouts/header/header";

export default function DataLayout({
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