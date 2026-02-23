'use client';

import { useState } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { Modal } from "../../../../../components/common/modal";
import MasterDataTable from "../../../../../components/common/table";
import { fetchFromBackend } from "../../../../../utils/api";

export default function AcademicYearsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [formData, setFormData] = useState({ 
    year_label: '', 
    is_active: true 
  });

  const columns = [
    { key: 'year_label', label: 'Academic Year', sortable: true },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const endpoint = editItem ? `/academic-years/${editItem.id}` : '/academic-years';
    
    await fetchFromBackend(endpoint, { 
      method, 
      body: JSON.stringify(formData) 
    });
    
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <MasterDataTable 
          key={refreshKey}
          title="Academic Years"
          endpoint="/academic-years"
          columns={columns}
          onAdd={() => { 
            setEditItem(null); 
            setFormData({ year_label: '', is_active: true }); 
            setIsModalOpen(true); 
          }}
          onEdit={(item: any) => { 
            setEditItem(item); 
            setFormData({ year_label: item.year_label, is_active: item.is_active }); 
            setIsModalOpen(true); 
          }}
          onDelete={async (id: string) => { 
            if(confirm('Delete academic year record?')) { 
              await fetchFromBackend(`/academic-years/${id}`, { method: 'DELETE' }); 
              setRefreshKey(prev => prev + 1); 
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Academic Year Information">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Label (YYYY/YYYY)</label>
            <input 
              className="w-full px-3 py-2 border rounded-lg text-black" 
              placeholder="e.g. 2023/2024" 
              value={formData.year_label} 
              onChange={e => setFormData({...formData, year_label: e.target.value})} 
              required 
              pattern="\d{4}/\d{4}"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={e => setFormData({...formData, is_active: e.target.checked})}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Set as Active Year
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 mt-4">
            Save Academic Year
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}