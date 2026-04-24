"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AdminShell } from "@/components/shells/admin-shell";
import { AdminEditUserModal, UserData } from "@/components/admin/admin-edit-user-modal";

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
};

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted: UserData[] = (data as UserRow[]).map((item) => ({
          id: item.id,
          name: item.full_name,
          email: item.email,
          role: item.role === "admin" ? "Administrator" : "Mahasiswa",
          status: item.status === "aktif" ? "Aktif" : "Diblokir",
        }));
        setUsers(formatted);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua Peran");

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "Semua Peran" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenEdit = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveEdit = async (id: string, updatedData: Partial<UserData>, newPassword?: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({
        full_name: updatedData.name,
        email: updatedData.email,
      })
      .eq("id", id);

    if (error) {
      alert("Gagal menyimpan pengguna: " + error.message);
      return;
    }

    if (newPassword) {
      alert("Profil tersimpan. Reset password user lain membutuhkan server admin Supabase, jadi belum dijalankan dari browser.");
    }
    
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    );
    handleCloseModal();
  };

  return (
    <AdminShell
      title="Kelola Pengguna"
      description="Lihat dan kelola daftar pengguna aplikasi TEMUIN. Lakukan reset password jika diperlukan."
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Daftar Pengguna
          </h2>
          <button className="rounded-full bg-teal-950 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-900">
            Tambah Admin
          </button>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 bg-white p-4 sm:flex-row sm:px-8">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-900 focus:bg-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none transition-colors focus:border-teal-900 sm:w-auto"
          >
            <option value="Semua Peran">Semua Peran</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold sm:px-8">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">Email Kampus</th>
                <th className="px-6 py-4 font-semibold">Peran</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold sm:px-8">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Memuat data pengguna dari Supabase...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="whitespace-nowrap px-6 py-5 font-medium text-slate-900 sm:px-8">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {user.email}
                  </td>
                  <td className={`whitespace-nowrap px-6 py-5 ${user.role === "Administrator" ? "font-semibold text-teal-900" : ""}`}>
                    {user.role}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right sm:px-8">
                    <button
                      onClick={() => handleOpenEdit(user)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-teal-900 shadow-sm hover:border-teal-900 hover:bg-teal-50"
                    >
                      Edit Profil
                    </button>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Tidak ada pengguna yang cocok dengan pencarian/filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminEditUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onSave={handleSaveEdit}
      />
    </AdminShell>
  );
}
