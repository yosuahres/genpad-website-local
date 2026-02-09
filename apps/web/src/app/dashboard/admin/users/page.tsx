'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { 
  Trash2, MinusSquare, Plus, Pencil, Square, CheckSquare2Icon, 
  Download // 1. Added Download icon
} from 'lucide-react';
import { Modal } from "../../../../components/common/modal";
import { UserForm } from "../../../../components/common/form";
import { Pagination } from "../../../../components/common/pagination";
import { exportToExcel } from "../../../../utils/exportutils"; // 2. Added export utility

export default function PengurusLokalPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const PAGE_SIZE = 10;

  const loadUsers = useCallback(async () => {
    try { 
      const response = await fetchFromBackend(
        `/users?roleId=${ROLE_IDS.PENGURUS_LOKAL}&page=${page}&limit=${PAGE_SIZE}`
      );
      
      const items = response.data || [];
      const count = response.total || 0;
      
      setUsers(items);
      setTotalItems(count);
      
      const calcPages = Math.ceil(count / PAGE_SIZE);
      setTotalPages(calcPages > 0 ? calcPages : 1);
      
      setSelectedUser(null);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditUser(null);
    setFormData({ email: '', name: '', password: '' });
  };

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

  const handleDelete = async () => {
    if (!selectedUser || !confirm("Permanently delete this account?")) return;
    try {
      await fetchFromBackend(`/users/${selectedUser.id}`, { method: 'DELETE' });
      loadUsers();
    } catch (err) {
      alert("Deletion failed");
    }
  };

  const formatDateTimeUTC = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="mb-6 px-4">
        <h2 className="text-xl font-bold text-black mb-8 tracking-tight">Pengurus Lokal Management</h2>
        
        <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100/80">
              <tr className="border-b border-slate-200">
                <th colSpan={4} className="py-4 px-6">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setIsModalOpen(true)} 
                      className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 hover:text-black tracking-widest transition-colors"
                    >
                      <Plus size={18} /> Add New
                    </button>
                    <button 
                      onClick={() => { 
                        setEditUser(selectedUser); 
                        setFormData({ ...formData, name: selectedUser.name }); 
                        setIsModalOpen(true); 
                      }} 
                      disabled={!selectedUser} 
                      className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${selectedUser ? "text-slate-600 hover:text-black" : "text-slate-300 cursor-not-allowed"}`}
                    >
                      <Pencil size={18} /> Edit
                    </button>
                    <button 
                      onClick={handleDelete} 
                      disabled={!selectedUser} 
                      className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${selectedUser ? "text-slate-600 hover:text-red-600" : "text-slate-300 cursor-not-allowed"}`}
                    >
                      <Trash2 size={18} /> Delete
                    </button>

                    {/* 3. Added Divider and Export Button */}
                    <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                    <button 
                      onClick={() => exportToExcel(users, 'PengurusLokal')} 
                      className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 hover:text-black tracking-widest transition-colors"
                    >
                      <Download size={18} /> Export
                    </button>
                  </div>
                </th>
              </tr>

              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 w-16 border-r border-slate-200 text-center">
                  {selectedUser && (
                    <button onClick={() => setSelectedUser(null)} className="text-blue-600">
                      <MinusSquare size={18}/>
                    </button>
                  )}
                </th>
                <th className="py-4 px-6 text-[11px] font-extrabold uppercase text-slate-500 tracking-widest border-r border-slate-200">Name</th>
                <th className="py-4 px-6 text-[11px] font-extrabold uppercase text-slate-500 tracking-widest border-r border-slate-200">Email Address</th>
                <th className="py-4 px-6 text-[11px] font-extrabold uppercase text-slate-500 tracking-widest">Created At (UTC)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {users.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                return (
                  <tr 
                    key={user.id} 
                    onClick={() => setSelectedUser(isSelected ? null : user)}
                    className={`cursor-pointer transition-colors group ${isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-5 text-center">
                      <div className="flex justify-center">
                        {isSelected ? (
                          <CheckSquare2Icon size={18} className="text-blue-600" />
                        ) : (
                          <Square size={18} className="text-slate-300 group-hover:text-blue-400" />
                        )}
                      </div>
                    </td>
                    <td className={`py-5 px-6 text-sm border-r border-slate-100 ${isSelected ? "font-bold text-black" : "text-slate-800"}`}>
                      {user.name}
                    </td>
                    <td className={`py-5 px-6 text-sm border-r border-slate-100 ${isSelected ? "text-black" : "text-slate-600"}`}>
                      {user.email}
                    </td>
                    <td className={`py-5 px-6 text-sm ${isSelected ? "text-black" : "text-slate-600"}`}>
                      {formatDateTimeUTC(user.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            totalItems={totalItems} 
            pageSize={PAGE_SIZE} 
            onPageChange={setPage} 
          />
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editUser ? "Edit Pengurus" : "Create Pengurus"}
      >
        <UserForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleAction} 
          isEdit={!!editUser} 
          submitLabel={editUser ? "Save Changes" : "Create Account"} 
        />
      </Modal>
    </DashboardLayout>
  );
}