"use client";

import { useState } from "react";

import { AdminDecisionModal, ReportData } from "@/components/admin/admin-decision-modal";
import { AdminShell } from "@/components/shells/admin-shell";

const initialReports: ReportData[] = [
  {
    id: "LK-240426-001",
    type: "Kehilangan",
    itemName: "Dompet Hitam",
    category: "Aksesoris",
    date: "24 Apr 2026",
    location: "Perpustakaan Pusat",
    characteristics: "Bahan kulit, isi KTP dan KTM atas nama Budi.",
    status: "Menunggu",
  },
  {
    id: "AK-240426-014",
    type: "Kepemilikan",
    itemName: "Laptop Asus Vivobook",
    category: "Elektronik",
    date: "24 Apr 2026",
    location: "Barang Temuan di Gedung B",
    characteristics: "Mengajukan klaim dengan foto laptop beserta struk pembelian.",
    status: "Diproses",
  },
  {
    id: "LT-230426-011",
    type: "Temuan",
    itemName: "Flashdisk 64GB",
    category: "Elektronik",
    date: "23 Apr 2026",
    location: "Lab Komputer 2",
    characteristics: "Warna silver merk Sandisk, ada gantungan kunci beruang.",
    status: "Menunggu",
  },
];

export default function AdminQueuePage() {
  const [reports, setReports] = useState<ReportData[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (report: ReportData) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleSaveDecision = (id: string, newStatus: string, adminNote: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    // In a real app, you would also save the adminNote to the database here.
    console.log("Saved decision for", id, ":", newStatus, "Note:", adminNote);
    handleCloseModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-slate-100 text-slate-600";
      case "Diproses":
        return "bg-amber-100 text-amber-800";
      case "Siap Diambil":
      case "Tayang":
        return "bg-teal-100 text-teal-900";
      case "Selesai":
        return "bg-emerald-100 text-emerald-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <AdminShell
      title="Dashboard Operasional"
      description="Kelola laporan kehilangan, temuan, dan verifikasi kepemilikan. Anda dapat mengubah status dan memberikan instruksi langsung kepada pengguna."
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Daftar Antrean Aktif
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold sm:px-8">ID Laporan</th>
                <th className="px-6 py-4 font-semibold">Tipe</th>
                <th className="px-6 py-4 font-semibold">Nama Barang</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold sm:px-8">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="whitespace-nowrap px-6 py-5 font-medium text-teal-900 sm:px-8">
                    {report.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {report.type}
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-900">
                    {report.itemName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    {report.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-right sm:px-8">
                    <button
                      onClick={() => handleOpenModal(report)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-teal-900 shadow-sm hover:border-teal-900 hover:bg-teal-50"
                    >
                      Proses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminDecisionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        report={selectedReport}
        onSave={handleSaveDecision}
      />
    </AdminShell>
  );
}
