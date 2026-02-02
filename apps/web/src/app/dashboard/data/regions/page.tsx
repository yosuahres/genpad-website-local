"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { DataTablePage } from "../../../../components/ui/baseTablePage";
import { BaseModal } from "../../../../components/ui/baseModal";
import { AddRegionForm } from "./addRegionForm";

export default function RegionsPage() {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: res } = await supabase.from("regions").select("id, name, code");
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DataTablePage
        title="Regions"
        description="Manage geographical areas and regional codes."
        columns={["ID", "Code", "Name"]}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      >
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-all">
            <td className="px-8 py-5 text-sm text-gray-500">#{item.id}</td>
            <td className="px-8 py-5 font-mono text-blue-600 font-bold">{item.code}</td>
            <td className="px-8 py-5 font-semibold text-gray-900">{item.name}</td>
            <td className="px-8 py-5 text-right">
              <button className="text-gray-400 hover:text-blue-600 mr-3">Edit</button>
              <button className="text-gray-400 hover:text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </DataTablePage>

      <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Region">
        <AddRegionForm 
          onCancel={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      </BaseModal>
    </>
  );
}