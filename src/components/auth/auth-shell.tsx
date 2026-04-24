"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";

import { AUTH_COOKIE, USER_ROLE } from "@/lib/auth";

type AuthShellProps = {
  title: string;
  subtitle: string;
  eyebrow: string;
  role: "user" | "admin";
  submitLabel: string;
  footer: ReactNode;
  showFullName?: boolean;
};

export function AuthShell({
  title,
  subtitle,
  eyebrow,
  submitLabel,
  footer,
  showFullName = false,
}: AuthShellProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const fullName = showFullName ? (formData.get("fullName") as string) : "";

      // Custom Validations
      if (!email || !password || (showFullName && !fullName)) {
        throw new Error("Mohon lengkapi semua kolom pendaftaran.");
      }
      
      if (!email.endsWith("@kampus.ac.id")) {
        throw new Error("Gunakan email kampus yang sah (berakhiran @kampus.ac.id)");
      }

      if (password.length < 8) {
        throw new Error("Password terlalu pendek. Minimal 8 karakter.");
      }

      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      if (showFullName) {
        // Register Flow
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;
        
        // Auto set role as user for new signups
        document.cookie = `${AUTH_COOKIE}=${USER_ROLE}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
        router.push("/barang-temuan");
      } else {
        // Login Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Fetch user role from public.users to determine routing
        if (data.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

          const userRole = profile?.role === "admin" ? "admin" : USER_ROLE;
          document.cookie = `${AUTH_COOKIE}=${userRole}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
          router.push(userRole === "admin" ? "/admin/laporan-temuan" : "/barang-temuan");
        }
      }
      router.refresh();
    } catch (err: unknown) {
      // Show our custom UI error instead of browser alert
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan saat autentikasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5efe4_0%,#eef4f2_100%)] px-6 py-8 text-[var(--color-ink)] sm:px-8">
      <div className="section-shell mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl rounded-[2.4rem] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex items-center bg-[linear-gradient(150deg,#0b3b3f_0%,#11464b_52%,#1e646c_100%)] px-7 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(201,162,92,0.14),transparent_70%)]" />
          <div className="relative max-w-lg">
            <Link
              href="/"
              className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/78"
            >
              TEMUIN
            </Link>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.34em] text-[#d8c08a]">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-8 text-white/74 sm:text-base">
              {subtitle}
            </p>
          </div>
        </section>

        <section className="relative flex items-center bg-[rgba(255,253,248,0.92)] px-6 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-900/70">
                Akses akun
              </p>
              
              {/* Custom Error Popup/Alert */}
              {errorMsg && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-red-500">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  <p>{errorMsg}</p>
                </div>
              )}

              <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                {showFullName ? (
                  <div className="block">
                    <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
                      Nama lengkap
                    </label>
                    <input
                      id="fullName"
                      required
                      name="fullName"
                      type="text"
                      placeholder="Nama lengkap"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-900 focus:bg-white"
                    />
                  </div>
                ) : null}
                <div className="block">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email kampus
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@kampus.ac.id"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-900 focus:bg-white"
                  />
                </div>
                <div className="block">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      required
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-12 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-900 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Toggle mata diklik! Status baru:", !showPassword);
                        setShowPassword(!showPassword);
                      }}
                      className="absolute right-4 top-1/2 z-20 -translate-y-1/2 p-2 text-slate-400 hover:text-teal-900"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 pointer-events-none">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 pointer-events-none">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-teal-950 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-70"
                >
                  {isSubmitting ? "Memproses..." : submitLabel}
                </button>
              </form>
              {footer ? (
                <div className="mt-6 text-sm leading-7 text-slate-600">{footer}</div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
