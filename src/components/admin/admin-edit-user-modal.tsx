/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type AdminEditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (id: string, updatedData: Partial<UserData>, newPassword?: string) => void | Promise<void>;
};

export function AdminEditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
}: AdminEditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword(""); // Always start password blank
    }
  }, [user]);

  if (!isOpen || !user || !mounted) return null;

  const handleSave = async () => {
    await onSave(user.id, { name, email }, password || undefined);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              Kelola Akun
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
              Edit Pengguna
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama Lengkap</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email Kampus</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
              <label className="block">
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-semibold text-amber-900">
                    Reset Password (Opsional)
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-700/70 mt-1 sm:mt-0">
                    Kosongkan jika tidak diubah
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Masukkan password baru..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-amber-200/60 bg-white px-4 py-3 text-sm outline-none focus:border-amber-500"
                />
                <p className="mt-2 text-xs text-amber-800/80">
                  Mengisi kolom ini akan langsung menimpa (override) password lama milik pengguna tanpa perlu verifikasi email.
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-teal-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-900"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
