'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { Modal } from "../../../../../components/common/modal";
import MasterDataTable from "../../../../../components/common/table";
import { fetchFromBackend } from "../../../../../utils/api";

export default function ChildrenPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [formData, setFormData] = useState({ 
    child_code: '', name: '', region_id: '', education_level: '', academic_year_id: '' 
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      const [regionsRes, yearsRes] = await Promise.all([
        fetchFromBackend('/regions'),
        fetchFromBackend('/academic-years')
      ]);
      setRegions(regionsRes.data || []);
      setAcademicYears(yearsRes.data || []);
    };
    loadDropdowns();
  }, []);

  const columns = [
    { key: 'child_code', label: 'Code', sortable: true },
    { key: 'name', label: 'Full Name', sortable: true },
    { key: 'education_level', label: 'Level' },
    { key: 'region_id', label: 'Region ID' },
    { key: 'academic_year_id', label: 'Year ID' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editItem ? 'PUT' : 'POST';
    const endpoint = editItem ? `/children/${editItem.id}` : '/children';
    await fetchFromBackend(endpoint, { method, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <MasterDataTable 
          key={refreshKey}
          title="Children Data"
          endpoint="/children"
          columns={columns}
          onAdd={() => { 
            setEditItem(null); 
            setFormData({ child_code: '', name: '', region_id: '', education_level: '', academic_year_id: '' }); 
            setIsModalOpen(true); 
          }}
          onEdit={(item: any) => { setEditItem(item); setFormData(item); setIsModalOpen(true); }}
          onDelete={async (id: string) => { 
            if(confirm('Delete child record?')) { 
              await fetchFromBackend(`/children/${id}`, { method: 'DELETE' }); 
              setRefreshKey(prev => prev + 1); 
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Child Information">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full px-3 py-2 border rounded-lg" placeholder="Child Code" value={formData.child_code} onChange={e => setFormData({...formData, child_code: e.target.value})} required />
          <input className="w-full px-3 py-2 border rounded-lg" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <select className="w-full px-3 py-2 border rounded-lg" value={formData.region_id} onChange={e => setFormData({...formData, region_id: e.target.value})} required>
            <option value="">Select Region</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select className="w-full px-3 py-2 border rounded-lg" value={formData.academic_year_id} onChange={e => setFormData({...formData, academic_year_id: e.target.value})} required>
            <option value="">Select Academic Year</option>
            {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_label}</option>)}
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">Save Record</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}