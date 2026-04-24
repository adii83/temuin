"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AdminShell } from "@/components/shells/admin-shell";
import { AdminDetailKehilanganModal, LostReportData } from "@/components/admin/admin-detail-kehilangan-modal";

type LostItemRow = {
  id: string;
  item_name: string;
  category: string;
  lost_date: string;
  location: string;
  characteristics: string | null;
  contact_info: string | null;
  image_urls: string[] | null;
  status: string;
  users?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
};

export default function LaporanKehilanganPage() {
  const [reports, setReports] = useState<LostReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<LostReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLostItems = async () => {
      setIsLoading(true);
      const supabase = createClient();
      // We join with users table to get the reporter's name and email if available
      const { data, error } = await supabase
        .from("lost_items")
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted: LostReportData[] = (data as LostItemRow[]).map((item) => ({
          id: item.id,
          itemName: item.item_name,
          category: item.category,
          date: item.lost_date,
          location: item.location,
          characteristics: item.characteristics || "-",
          reporterName: item.users?.full_name || "Tanpa Nama",
          reporterContact: item.contact_info || item.users?.email || "-",
          images: item.image_urls || [],
          status: item.status,
        }));
        setReports(formatted);
      }
      setIsLoading(false);
    };

    fetchLostItems();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (report: LostReportData) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("lost_items")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Gagal memperbarui status: " + error.message);
      return;
    }

    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <AdminShell
      title="Kelola Laporan Kehilangan"
      description="Pantau dan kelola laporan kehilangan dari mahasiswa. Gunakan database ini untuk mencocokkan ciri-ciri barang saat ada barang temuan baru diserahkan."
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Daftar Laporan Kehilangan
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
              placeholder="Cari ID atau nama barang..."
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
            <option value="Mencari">Mencari</option>
            <option value="Ditemukan">Ditemukan</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold sm:px-8">ID Laporan</th>
                <th className="px-6 py-4 font-semibold">Nama Barang</th>
                <th className="px-6 py-4 font-semibold">Tanggal Hilang</th>
                <th className="px-6 py-4 font-semibold">Pelapor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold sm:px-8">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    Memuat data dari Supabase...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="whitespace-nowrap px-6 py-5 font-medium text-teal-900 sm:px-8">
                    {report.id}
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-900">
                    {report.itemName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {report.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {report.reporterName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        report.status === "Mencari"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right sm:px-8">
                    <button
                      onClick={() => handleOpenModal(report)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-teal-900 shadow-sm hover:border-teal-900 hover:bg-teal-50"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    Tidak ada laporan yang cocok dengan pencarian/filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminDetailKehilanganModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
        onUpdateStatus={handleUpdateStatus}
      />
    </AdminShell>
  );
}
