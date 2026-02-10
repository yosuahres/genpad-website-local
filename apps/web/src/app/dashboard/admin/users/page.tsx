// apps/web/src/app/dashboard/admin/users/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { Modal } from "../../../../components/common/modal";
import { UserForm } from "../../../../components/common/form";
import MasterDataTable from "../../../../components/common/table";
import { fetchFromBackend } from "../../../../utils/api";

export default function AdminUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: ROLE_IDS.PENGURUS_LOKAL });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add a key to force refresh table

  const columns = [
    { key: 'name', label: 'Full Name', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
  ];

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/users/${currentId}` : '/users';
    await fetchFromBackend(url, { method, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    // Refresh without full page reload
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="p-6">
        <MasterDataTable 
          key={refreshKey} // Changing this key forces the component to remount/refetch
          title="Local Staff Management"
          endpoint={`/users?roleId=${ROLE_IDS.PENGURUS_LOKAL}`}
          columns={columns}
          onAdd={() => {
            setFormData({ name: '', email: '', password: '', role_id: ROLE_IDS.PENGURUS_LOKAL });
            setIsEdit(false);
            setIsModalOpen(true);
          }}
          onEdit={(user: any) => {
            setFormData({ name: user.name, email: user.email, password: '', role_id: user.role_id });
            setCurrentId(user.id);
            setIsEdit(true);
            setIsModalOpen(true);
          }}
          onDelete={async (id: string) => {
            if(confirm('Delete user?')) {
              await fetchFromBackend(`/users/${id}`, { method: 'DELETE' });
              setRefreshKey(prev => prev + 1);
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Staff" : "Add Staff"}>
        <UserForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAction}
          isEdit={isEdit}
          submitLabel={isEdit ? "Update Staff Member" : "Create Staff Account"}
        />
      </Modal>
    </DashboardLayout>
  );
}