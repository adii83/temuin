"use client";

import { useEffect, useState } from "react";

import { AdminShell } from "@/components/shells/admin-shell";
import { createClient } from "@/utils/supabase/client";

type DashboardStats = {
  lost: number;
  activeFound: number;
  completedClaims: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    lost: 0,
    activeFound: 0,
    completedClaims: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const [lost, activeFound, completedClaims] = await Promise.all([
        supabase.from("lost_items").select("id", { count: "exact", head: true }),
        supabase
          .from("found_items")
          .select("id", { count: "exact", head: true })
          .in("status", ["Tayang", "Barang Diterima", "Menunggu"]),
        supabase
          .from("claims")
          .select("id", { count: "exact", head: true })
          .eq("status", "Selesai"),
      ]);

      setStats({
        lost: lost.count || 0,
        activeFound: activeFound.count || 0,
        completedClaims: completedClaims.count || 0,
      });
      setIsLoading(false);
    };

    loadStats();
  }, []);

  const cards = [
    ["Laporan Kehilangan", stats.lost, "Total laporan di database"],
    ["Barang Temuan Aktif", stats.activeFound, "Menunggu proses atau klaim"],
    ["Klaim Selesai", stats.completedClaims, "Berhasil dikembalikan"],
  ];

  return (
    <AdminShell
      title="Dashboard Utama"
      description="Ringkasan aktivitas operasional TEMUIN Kampus hari ini."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map(([label, value, caption]) => (
          <div key={label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-slate-900">
              {isLoading ? "..." : value}
            </p>
            <p className="mt-2 text-xs text-teal-600">{caption}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
