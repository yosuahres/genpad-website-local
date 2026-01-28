// dashboard/page.tsx
"use client"; // Required for client-side state/auth logic

import Sidebar from "../../components/Layouts/sidebar/Sidebar";
import Header from "../../components/Layouts/header/header";
import { useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (user) console.log("Dashboard user:", user);
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-100 overflow-y-auto">
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">dashboard</h2>
        </div>
      </main>
    </div>
  );
}