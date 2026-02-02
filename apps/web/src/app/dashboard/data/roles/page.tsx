"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { DataTablePage } from "../../../../components/ui/baseTablePage";
import { BaseModal } from "../../../../components/ui/baseModal";
import { AddRoleForm } from "./addRoleForm";

export default function RolesPage() {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: res } = await supabase.from("roles").select("id, name");
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <DataTablePage
        title="System Roles"
        description="Define access levels and permissions."
        columns={["ID", "Role Name"]}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      >
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50/30">
            <td className="px-8 py-5 text-sm text-gray-500">#{item.id}</td>
            <td className="px-8 py-5">
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {item.name}
              </span>
            </td>
            <td className="px-8 py-5 text-right">
              <button className="text-gray-400 hover:text-blue-600">Edit</button>
            </td>
          </tr>
        ))}
      </DataTablePage>

      <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Role">
        <AddRoleForm 
          onCancel={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      </BaseModal>
    </>
  );
}