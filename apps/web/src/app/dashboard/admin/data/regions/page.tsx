'use client';

import { useState } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { Modal } from "../../../../../components/common/modal";
import MasterDataTable from "../../../../../components/common/table";
import { fetchFromBackend } from "../../../../../utils/api";

export default function RegionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [refreshKey, setRefreshKey] = useState(0); // Added refreshKey

  const columns = [
    { key: 'code', label: 'Region Code', sortable: true },
    { key: 'name', label: 'Region Name', sortable: true },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const endpoint = editItem ? `/regions/${editItem.id}` : '/regions';
    await fetchFromBackend(endpoint, { method, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <MasterDataTable 
          key={refreshKey} // Pass key here
          title="Regions"
          endpoint="/regions"
          columns={columns}
          onAdd={() => { setEditItem(null); setFormData({ name: '', code: '' }); setIsModalOpen(true); }}
          onEdit={(item: any) => { setEditItem(item); setFormData({ name: item.name, code: item.code }); setIsModalOpen(true); }}
          onDelete={async (id: string) => { 
            if(confirm('Delete region?')) { 
              await fetchFromBackend(`/regions/${id}`, { method: 'DELETE' }); 
              setRefreshKey(prev => prev + 1); 
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? "Edit Region" : "Add Region"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Region Code</label>
            <input className="w-full px-3 py-2 border rounded-lg" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Region Name</label>
            <input className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">Save Region</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}