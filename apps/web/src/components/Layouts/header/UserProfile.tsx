// apps/web/src/components/Layouts/header/UserProfile.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { createClient } from "~/utils/supabase/client";

interface UserData {
  name: string;
  role_id: number;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('name, role_id')
          .eq('id', user.id)
          .single();

        if (data) setUserData(data);
        if (error) console.error("Error fetching profile:", error.message);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const getRoleLabel = (id: number) => {
    switch (id) {
      case 1: return 'Super Admin';
      case 2: return 'Admin';
      default: return 'User';
    }
  };

  if (loading) return <div className="h-10 w-24 animate-pulse bg-slate-100 rounded-lg" />;

  return (
    <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
      <div className="hidden text-right md:block">
        <p className="text-sm font-semibold text-slate-800 leading-tight">
          {userData?.name || "Unknown User"}
        </p>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          {userData ? getRoleLabel(userData.role_id) : "Guest"}
        </p>
      </div>
      <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
        <User size={20} />
      </div>
    </div>
  );
};

export default UserProfile;