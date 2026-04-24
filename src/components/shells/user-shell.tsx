"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

import { SmoothLink } from "@/components/smooth-link";
import { AUTH_COOKIE } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";

type UserShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const userNav = [
  { href: "/barang-temuan", label: "Barang Temuan" },
  { href: "/lapor-kehilangan", label: "Lapor Kehilangan" },
  { href: "/lapor-temuan", label: "Lapor Temuan" },
  { href: "/verifikasi-kepemilikan", label: "Ajukan Kepemilikan" },
  { href: "/status", label: "Lacak Status" },
];

export function UserShell({ title, description, children }: UserShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileName, setProfileName] = useState("Pengguna");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user || !isMounted) return;

        const { data } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (isMounted) {
          setProfileName(data?.full_name || user.email?.split("@")[0] || "Pengguna");
        }
      } catch {
        if (isMounted) {
          setProfileName("Pengguna");
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const profileInitial = useMemo(() => {
    return profileName.trim().charAt(0).toUpperCase() || "P";
  }, [profileName]);

  const handleLogout = () => {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
    router.push("/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5efe4_0%,#f9f7f2_100%)] text-[var(--color-ink)]">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        <header className="sticky top-5 z-20 rounded-[1.75rem] border border-white/70 bg-white/88 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Link href="/barang-temuan" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-950 text-sm font-semibold text-white">
                T
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.34em] text-teal-900/70">
                  TEMUIN
                </span>
                <span className="block text-sm text-slate-600">
                  Lost & Found Kampus
                </span>
              </span>
            </Link>

            <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-slate-50/80 p-1">
              {userNav.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SmoothLink
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold ${
                      isActive
                        ? "bg-teal-950 text-white shadow-[0_10px_24px_rgba(11,59,63,0.18)]"
                        : "text-slate-600 hover:bg-white hover:text-teal-900"
                    }`}
                  >
                    {item.label}
                  </SmoothLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-teal-900 hover:text-teal-900"
              >
                Keluar
              </button>
              <Link
                href="/profil"
                title={profileName}
                aria-label={`Profil ${profileName}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-950 text-base font-semibold text-white shadow-sm ring-2 ring-white hover:bg-teal-900"
              >
                {profileInitial}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-900/70">
            Area Pengguna
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </section>

        <section className="mt-6">{children}</section>
      </div>
    </main>
  );
}
