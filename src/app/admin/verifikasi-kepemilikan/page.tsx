"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AdminShell } from "@/components/shells/admin-shell";
import { AdminDecisionModal, ReportData } from "@/components/admin/admin-decision-modal";

type ClaimRow = {
  id: string;
  item_id: string;
  status: string;
  claim_notes: string | null;
  proof_image_urls: string[] | null;
  admin_notes: string | null;
  created_at: string;
  found_items?: {
    item_name?: string | null;
    category?: string | null;
    location?: string | null;
    image_urls?: string[] | null;
  } | null;
};

export default function VerifikasiKepemilikanPage() {
  const [claims, setClaims] = useState<ReportData[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<ReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("claims")
        .select(`
          *,
          found_items (
            item_name,
            category,
            location,
            image_urls
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted: ReportData[] = (data as ClaimRow[]).map((item) => ({
          id: item.id,
          type: "Kepemilikan",
          itemName: item.found_items?.item_name || "Barang Tidak Diketahui",
          category: item.found_items?.category || "Lainnya",
          date: new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
          }),
          location: item.found_items?.location || "-",
          characteristics: item.admin_notes || "Pengajuan menunggu catatan keputusan admin.",
          claimNotes: item.claim_notes || "Pengguna tidak menulis bukti kepemilikan.",
          images: item.proof_image_urls || [],
          status: item.status,
          targetItemId: item.item_id,
          targetImage: item.found_items?.image_urls?.[0],
        }));
        setClaims(formatted);
      }
      setIsLoading(false);
    };

    fetchClaims();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = claim.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveDecision = async (id: string, newStatus: string, adminNote: string) => {
    const supabase = createClient();
    const claim = claims.find((item) => item.id === id);
    const { error } = await supabase
      .from("claims")
      .update({ status: newStatus, admin_notes: adminNote })
      .eq("id", id);

    if (error) {
      alert("Gagal menyimpan keputusan klaim: " + error.message);
      return;
    }

    if (claim?.targetItemId && ["Siap Diambil", "Selesai"].includes(newStatus)) {
      await supabase
        .from("found_items")
        .update({ status: "Telah Diklaim" })
        .eq("id", claim.targetItemId);
    }

    setClaims((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, characteristics: adminNote || r.characteristics } : r))
    );
    setIsModalOpen(false);
  };

  return (
    <AdminShell
      title="Verifikasi Kepemilikan"
      description="Tinjau bukti kepemilikan yang dikirimkan oleh pengguna untuk mengklaim barang temuan."
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Daftar Klaim Aktif
          </h2>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100 bg-white p-4 sm:flex-row sm:px-8">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari ID klaim atau nama barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-900 focus:bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none transition-colors focus:border-teal-900 sm:w-auto"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diperiksa">Diperiksa</option>
            <option value="Siap Diambil">Siap Diambil</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 bg-slate-50/40 p-6 sm:px-8">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Memuat data verifikasi kepemilikan...
            </div>
          ) : filteredClaims.length > 0 ? (
            filteredClaims.map((claim) => {
              return (
              <div 
                key={claim.id} 
                className="group flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all hover:border-teal-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] sm:flex-row"
              >
                {/* Target Item Visual */}
                <div className="flex w-full items-center gap-5 border-b border-slate-100 pb-5 sm:w-1/3 sm:border-0 sm:border-r sm:pb-0 sm:pr-6">
                  {claim.targetImage ? (
                    <>
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={claim.targetImage} alt={claim.itemName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Barang Target</p>
                        <p className="mt-1 font-semibold text-slate-900 line-clamp-1">{claim.itemName}</p>
                        <p className="mt-1 text-xs font-medium text-slate-500">ID: {claim.targetItemId}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200/50">
                        <span className="text-2xl text-slate-300">?</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Barang Target</p>
                        <p className="mt-1 font-semibold text-slate-900 line-clamp-1">{claim.itemName}</p>
                        <p className="mt-1 text-xs font-medium text-slate-500">Tidak ada visual</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Claim Metadata */}
                <div className="flex w-full flex-1 flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-teal-950">{claim.id}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                          claim.status === "Diperiksa" || claim.status === "Menunggu"
                            ? "bg-amber-100 text-amber-900"
                            : claim.status === "Ditolak"
                            ? "bg-red-100 text-red-800"
                            : "bg-teal-100 text-teal-900"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Diajukan pada {claim.date}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedClaim(claim);
                      setIsModalOpen(true);
                    }}
                    className="w-full shrink-0 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-teal-950 shadow-sm transition-all hover:border-teal-900 hover:bg-teal-950 hover:text-white sm:w-auto"
                  >
                    Review Bukti
                  </button>
                </div>
              </div>
            );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm text-slate-500">Tidak ada data klaim yang cocok dengan pencarian/filter Anda.</p>
            </div>
          )}
        </div>
      </div>

      <AdminDecisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedClaim}
        onSave={handleSaveDecision}
      />
    </AdminShell>
  );
}
