"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

import { AUTH_COOKIE } from "@/lib/auth";

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const adminNav = [
  {
    href: "/admin/laporan-kehilangan",
    label: "Laporan Kehilangan",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/laporan-temuan",
    label: "Laporan Temuan",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/admin/verifikasi-kepemilikan",
    label: "Klaim Kepemilikan",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    href: "/admin/pengguna",
    label: "Kelola Pengguna",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export function AdminShell({ title, description, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-[linear-gradient(135deg,rgba(11,59,63,0.98),rgba(19,83,90,0.96))] text-white">
        <div className="flex items-center gap-3 border-b border-white/10 px-8 py-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-teal-950">
            A
          </span>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#d7c08a]">
              Admin Panel
            </span>
            <span className="block text-sm font-semibold tracking-wide">
              TEMUIN Kampus
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {adminNav.map((item) => {
            const isActive = pathname === item.href || (pathname === '/admin/antrian' && item.href === '/admin/dashboard');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-500/20 hover:text-red-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-72">
        <div className="mx-auto max-w-7xl px-8 py-10">
          <header className="mb-10">
            <h1 className="text-3xl font-[family-name:var(--font-display)] font-semibold text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          </header>

          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
