"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import { ReportData } from "@/components/admin/admin-decision-modal";
import { AdminEditTemuanModal } from "@/components/admin/admin-edit-temuan-modal";
import { AdminAddTemuanModal } from "@/components/admin/admin-add-temuan-modal";
import { AdminShell } from "@/components/shells/admin-shell";

type FoundItemRow = {
  id: string;
  item_name: string;
  category: string;
  found_date: string;
  location: string;
  contact_info: string | null;
  characteristics: string | null;
  image_urls: string[] | null;
  status: string;
};

export default function LaporanTemuanPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formatted: ReportData[] = (data as FoundItemRow[]).map((item) => ({
          id: item.id,
          type: "Temuan",
          itemName: item.item_name,
          category: item.category,
          date: item.found_date,
          location: item.location,
          contact: item.contact_info || "-",
          characteristics: item.characteristics || "-",
          images: item.image_urls || [],
          status: item.status,
        }));
        setReports(formatted);
      }
      setIsLoading(false);
    };

    fetchReports();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (report: ReportData) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleSaveEdit = async (id: string, updatedData: Partial<ReportData>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("found_items")
      .update({
        item_name: updatedData.itemName,
        category: updatedData.category,
        characteristics: updatedData.characteristics,
        image_urls: updatedData.images || [],
        status: updatedData.status,
      })
      .eq("id", id)
      .select("id, status");

    if (error) {
      alert("Gagal menyimpan: " + error.message);
      return;
    }

    // Jika data kosong, berarti RLS memblokir update secara diam-diam
    if (!data || data.length === 0) {
      alert("⚠️ Perubahan TIDAK tersimpan ke database! RLS memblokir update.\nPastikan akun Anda terdaftar sebagai 'admin' di tabel public.users.");
      return;
    }

    // Update state lokal setelah konfirmasi berhasil simpan
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
    handleCloseModal();
  };

  const handleAddNew = async (newReport: ReportData) => {
    const supabase = createClient();
    const foundDate = /^\d{4}-\d{2}-\d{2}$/.test(newReport.date)
      ? newReport.date
      : new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("found_items").insert({
      id: newReport.id,
      reporter_id: null,
      item_name: newReport.itemName,
      category: newReport.category,
      found_date: foundDate,
      location: newReport.location,
      characteristics: newReport.characteristics,
      contact_info: newReport.contact || "Admin Pos Keamanan",
      status: newReport.status,
      image_urls: newReport.images || [],
    });

    if (error) {
      alert("Gagal menambahkan barang temuan: " + error.message);
      return;
    }

    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <AdminShell
      title="Kelola Laporan Temuan"
      description="Review dan rapikan laporan barang temuan dari pengguna sebelum dipublikasikan ke katalog publik."
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Daftar Temuan (Menunggu Review)
          </h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full bg-teal-950 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-900"
          >
            + Tambah Temuan Manual
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
            <option value="Menunggu">Menunggu</option>
            <option value="Barang Diterima">Barang Diterima</option>
            <option value="Tayang">Tayang</option>
            <option value="Telah Diklaim">Telah Diklaim</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold sm:px-8">ID Laporan</th>
                <th className="px-6 py-4 font-semibold">Nama Barang (Asli)</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
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
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        report.status === "Tayang" ? "bg-teal-100 text-teal-900" : "bg-slate-100 text-slate-600"
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
                      Review & Edit
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

      <AdminEditTemuanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
        onSave={handleSaveEdit}
      />

      <AdminAddTemuanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNew}
      />
    </AdminShell>
  );
}
