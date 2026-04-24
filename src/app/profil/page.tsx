"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { UserShell } from "@/components/shells/user-shell";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [status, setStatus] = useState("aktif");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("full_name, email, role, status")
        .eq("id", user.id)
        .single();

      setName(data?.full_name || user.user_metadata?.full_name || "");
      setEmail(data?.email || user.email || "");
      setRole(data?.role || "mahasiswa");
      setStatus(data?.status || "aktif");
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const initial = useMemo(() => name.trim().charAt(0).toUpperCase() || "P", [name]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Sesi tidak ditemukan. Silakan login ulang.");
      setIsSaving(false);
      return;
    }

    if (password && password !== confirmPassword) {
      setMessage("Konfirmasi password belum sama.");
      setIsSaving(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("users")
      .update({ full_name: name, email })
      .eq("id", user.id);

    if (profileError) {
      setMessage(`Gagal menyimpan profil: ${profileError.message}`);
      setIsSaving(false);
      return;
    }

    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({ password });

      if (passwordError) {
        setMessage(`Profil tersimpan, tetapi password gagal diubah: ${passwordError.message}`);
        setIsSaving(false);
        return;
      }
    }

    event.currentTarget.reset();
    setMessage("Profil berhasil diperbarui.");
    setIsSaving(false);
  };

  return (
    <UserShell
      title="Profil"
      description="Kelola informasi akun pengguna kampus."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
        <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[var(--shadow-card)]">
          {isLoading ? (
            <p className="text-sm text-slate-500">Memuat profil dari Supabase...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Nama lengkap
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Email kampus
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Password baru
                  </span>
                  <input
                    name="password"
                    type="password"
                    placeholder="Masukkan password baru"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Konfirmasi password
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password baru"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
                  />
                </label>
              </div>

              {message ? (
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSaving}
                className="mt-6 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-70"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          )}
        </section>

        <aside className="rounded-3xl border border-white/80 bg-[#0b3b3f] p-6 text-white shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d7c08a]">
            Akun Kampus
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold text-teal-950">
              {initial}
            </span>
            <div>
              <p className="font-semibold">{name || "Pengguna"}</p>
              <p className="text-sm text-white/68">{email || "Email belum tersedia"}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 text-sm text-white/76">
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Peran</dt>
              <dd className="font-semibold capitalize text-white">{role}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt>Status</dt>
              <dd className="font-semibold capitalize text-white">{status}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </UserShell>
  );
}
