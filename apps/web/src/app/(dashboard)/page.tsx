import LogoutButton from "./LogoutButton";
import { createClient } from "../../utils/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();

  supabase.auth.getUser().then(({ data: { user }, error }) => {
    console.log("Dashboard user:", user);
    console.log("Dashboard user error:", error);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <LogoutButton />
    </div>
  );
}