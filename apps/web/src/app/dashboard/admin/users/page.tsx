'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { Trash2, Edit, UserPlus } from 'lucide-react';
import { Modal } from "../../../../components/common/modal";
import { UserForm } from "../../../../components/dashboard/userform";
import { Pagination } from "../../../../components/common/pagination";

export default function PengurusLokalPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const loadUsers = async () => {
    try {
      const response = await fetchFromBackend(
        `/users?roleId=3&page=${page}&limit=${PAGE_SIZE}`
      );
      setUsers(response.data || []);
      setTotalPages(Math.ceil((response.total || 0) / PAGE_SIZE));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { loadUsers(); }, [page]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editUser ? 'PUT' : 'POST';
    const url = editUser ? `/users/${editUser.id}` : '/users';
    const body = editUser ? { name: formData.name } : { ...formData, role_id: ROLE_IDS.PENGURUS_LOKAL };

    try {
      await fetchFromBackend(url, { method, body: JSON.stringify(body) });
      closeModal();
      loadUsers();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this account?")) return;
    try {
      await fetchFromBackend(`/users/${id}`, { method: 'DELETE' });
      loadUsers();
    } catch (err) {
      alert("Deletion failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditUser(null);
    setFormData({ email: '', name: '', password: '' });
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-black">Pengurus Lokal Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all">
          <UserPlus size={18} /> Add Pengurus
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-black">Name</th>
              <th className="p-4 text-xs font-bold uppercase text-black">Email</th>
              <th className="p-4 text-xs font-bold uppercase text-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50">
                <td className="p-4 text-sm font-semibold text-black">{user.name}</td>
                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setEditUser(user); setFormData({ ...formData, name: user.name }); setIsModalOpen(true); }} className="text-slate-400 hover:text-indigo-600 p-2">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-600 p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editUser ? "Edit Pengurus" : "Create Pengurus"}>
        <UserForm formData={formData} setFormData={setFormData} onSubmit={handleAction} isEdit={!!editUser} submitLabel={editUser ? "Save Changes" : "Create Account"} />
      </Modal>
    </DashboardLayout>
  );
}