"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { DataTablePage } from "../../../../components/ui/baseTablePage";
import { BaseModal } from "../../../../components/ui/baseModal";
import { AddAnakAsuhForm } from "./addAnakAsuhForm";

export default function ChildrenPage() {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: res } = await supabase
      .from("children")
      .select(`*, regions(name)`);
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <>
      <DataTablePage
        title="Anak Asuh"
        description="Database of children under guardianship."
        columns={["Code", "Name", "Region", "Level", "Academic Year"]}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      >
        {data.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
          <tr key={item.child_code} className="hover:bg-blue-50/30">
            <td className="px-8 py-5 text-xs font-mono text-gray-500">{item.child_code}</td>
            <td className="px-8 py-5 font-bold text-gray-900">{item.name}</td>
            <td className="px-8 py-5 text-sm">{item.regions?.name || "N/A"}</td>
            <td className="px-8 py-5 text-sm capitalize">{item.education_level}</td>
            <td className="px-8 py-5 text-sm">{item.academic_year_id}</td>
            <td className="px-8 py-5 text-right">
              <button className="text-blue-600 font-semibold text-sm">View Profile</button>
            </td>
          </tr>
        ))}
      </DataTablePage>

      <BaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Anak Asuh">
        <AddAnakAsuhForm 
          onCancel={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      </BaseModal>
    </>
  );
}