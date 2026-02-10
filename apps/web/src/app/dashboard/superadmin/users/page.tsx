'use client';

import { useState } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { Modal } from "../../../../components/common/modal";
import { UserForm } from "../../../../components/common/form";
import MasterDataTable from "../../../../components/common/table";
import { fetchFromBackend } from "../../../../utils/api";

export default function SuperAdminUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: ROLE_IDS.ADMIN });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const columns = [
    { key: 'name', label: 'Admin Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
  ];

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/users/${currentId}` : '/users';
    await fetchFromBackend(url, { method, body: JSON.stringify(formData) });
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      <div className="p-6">
        <MasterDataTable 
          title="System Administrators"
          endpoint={`/users?roleId=${ROLE_IDS.ADMIN}`}
          columns={columns}
          onAdd={() => {
            setFormData({ name: '', email: '', password: '', role_id: ROLE_IDS.ADMIN });
            setIsEdit(false);
            setIsModalOpen(true);
          }}
          onEdit={(user) => {
            setFormData({ name: user.name, email: user.email, password: '', role_id: user.role_id });
            setCurrentId(user.id);
            setIsEdit(true);
            setIsModalOpen(true);
          }}
          onDelete={async (id) => {
            if(confirm('Revoke Admin access?')) {
              await fetchFromBackend(`/users/${id}`, { method: 'DELETE' });
              window.location.reload();
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Edit Admin" : "New Admin"}>
        <UserForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAction}
          isEdit={isEdit}
          submitLabel={isEdit ? "Update Admin" : "Register Admin"}
        />
      </Modal>
    </DashboardLayout>
  );
}