/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type LostReportData = {
  id: string;
  itemName: string;
  category: string;
  date: string;
  location: string;
  characteristics: string;
  reporterName: string;
  reporterContact: string;
  images?: string[];
  status: string;
};

type AdminDetailKehilanganModalProps = {
  isOpen: boolean;
  onClose: () => void;
  report: LostReportData | null;
  onUpdateStatus: (id: string, newStatus: string) => void | Promise<void>;
};

export function AdminDetailKehilanganModal({
  isOpen,
  onClose,
  report,
  onUpdateStatus,
}: AdminDetailKehilanganModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Mencari");

  useEffect(() => {
    setMounted(true);
    if (report) {
      setSelectedStatus(report.status);
    }
  }, [report]);

  if (!isOpen || !report || !mounted) return null;

  const handleSaveStatus = async () => {
    await onUpdateStatus(report.id, selectedStatus);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              Detail Laporan Kehilangan
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
              {report.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <h4 className="mb-4 text-sm font-semibold text-slate-900">
                Informasi Pelapor
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Nama Lengkap</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{report.reporterName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Kontak</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{report.reporterContact}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Detail Barang Hilang
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Nama Barang</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{report.itemName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Kategori</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{report.category}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Tanggal Kehilangan</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{report.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Lokasi Terakhir</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{report.location}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500">Ciri-ciri barang</p>
                <div className="mt-2 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                  {report.characteristics}
                </div>
              </div>

              {report.images && report.images.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-slate-500">Foto Referensi Barang</p>
                  <div className="mt-2 overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={report.images[0]} alt="Referensi Barang" className="h-48 w-full object-cover" />
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Ubah Status Laporan Kehilangan
                  </span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-900"
                  >
                    <option value="Mencari">Mencari (Diproses)</option>
                    <option value="Ditemukan">Ditemukan (Siap Diambil)</option>
                    <option value="Selesai">Selesai (Telah Dikembalikan)</option>
                    <option value="Ditolak">Ditolak (Laporan Tidak Valid)</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-slate-500">
              Gunakan data ini untuk mencocokkan barang temuan baru.
            </span>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                className="rounded-full bg-teal-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-900"
              >
                Simpan Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
