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
    // Fetching all requested fields including related region name
    const { data: res } = await supabase
      .from("children")
      .select(`
        child_code, 
        name, 
        region_id, 
        education_level, 
        academic_year_id, 
        created_at, 
        updated_at,
        regions(name)
      `)
      .order('created_at', { ascending: false });
    
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = data.filter(i => 
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.child_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DataTablePage
        title="Anak Asuh"
        description="Database of children under guardianship."
        columns={["Code", "Name", "Region", "Level", "AY ID", "Last Updated"]}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      >
        {filtered.map((item) => (
          <tr key={item.child_code} className="hover:bg-blue-50/30">
            <td className="px-8 py-5 text-xs font-mono text-blue-600 font-bold">{item.child_code}</td>
            <td className="px-8 py-5 font-bold text-gray-900">{item.name}</td>
            <td className="px-8 py-5 text-sm">{item.regions?.name || "Unknown"}</td>
            <td className="px-8 py-5 text-sm">
              <span className="capitalize px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs font-medium">
                {item.education_level}
              </span>
            </td>
            <td className="px-8 py-5 text-sm font-mono text-gray-500">{item.academic_year_id}</td>
            <td className="px-8 py-5 text-xs text-gray-400">
              {new Date(item.updated_at).toLocaleDateString()}
            </td>
            <td className="px-8 py-5 text-right">
              <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Edit</button>
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