// apps/web/src/app/dashboard/admin/data/parent-asuh/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { Modal } from "../../../../../components/common/modal";
import MasterDataTable from "../../../../../components/common/table";
import { fetchFromBackend } from "../../../../../utils/api";

export default function ParentAsuhPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [formData, setFormData] = useState({ name: '', phone_number: '', address: '' });

  const columns = [
    { key: 'name', label: 'Parent Name', sortable: true },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'address', label: 'Address' },
    { key: 'created_at', label: 'Joined Date' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const endpoint = editItem ? `/parent-asuh/${editItem.id}` : '/parent-asuh';
    await fetchFromBackend(endpoint, { method, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <MasterDataTable 
          key={refreshKey}
          title="Parent Asuh (Foster Parents)"
          endpoint="/parent-asuh"
          columns={columns}
          onAdd={() => { 
            setEditItem(null); 
            setFormData({ name: '', phone_number: '', address: '' }); 
            setIsModalOpen(true); 
          }}
          onEdit={(item: any) => { setEditItem(item); setFormData(item); setIsModalOpen(true); }}
          onDelete={async (id: string) => { 
            if(confirm('Delete this parent record?')) { 
              await fetchFromBackend(`/parent-asuh/${id}`, { method: 'DELETE' }); 
              setRefreshKey(prev => prev + 1); 
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Parent Information">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full px-3 py-2 border rounded-lg" 
            placeholder="Parent Full Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
          />
          <input 
            className="w-full px-3 py-2 border rounded-lg" 
            placeholder="Phone Number" 
            value={formData.phone_number} 
            onChange={e => setFormData({...formData, phone_number: e.target.value})} 
          />
          <textarea 
            className="w-full px-3 py-2 border rounded-lg" 
            placeholder="Address" 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Save Parent Record
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}