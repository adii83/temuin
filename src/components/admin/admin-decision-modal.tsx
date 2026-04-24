/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export type ReportData = {
  id: string;
  type: "Kehilangan" | "Temuan" | "Kepemilikan";
  itemName: string;
  category: string;
  date: string;
  location: string;
  characteristics: string;
  contact?: string;
  images?: string[];
  status: string;
  targetItemId?: string;
  targetImage?: string;
  claimNotes?: string;
};

type AdminDecisionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  report: ReportData | null;
  onSave: (id: string, newStatus: string, adminNote: string) => void | Promise<void>;
};

export function AdminDecisionModal({
  isOpen,
  onClose,
  report,
  onSave,
}: AdminDecisionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("Diperiksa");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (report) {
      setSelectedStatus(report.status === "Menunggu" ? "Diperiksa" : report.status);
      setAdminNote("");
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleSave = async () => {
    await onSave(report.id, selectedStatus, adminNote);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              Proses Laporan
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {report.type} - {report.itemName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Left: Report Details */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Detail Laporan
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">ID Laporan</p>
                  <p className="font-medium text-slate-900">{report.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Kategori</p>
                  <p className="font-medium text-slate-900">{report.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tanggal Kejadian / Pengajuan</p>
                  <p className="font-medium text-slate-900">{report.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Lokasi Penemuan (Referensi)</p>
                  <p className="font-medium text-slate-900">{report.location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {report.type === "Kepemilikan" ? "Bukti Kepemilikan dari Pengguna" : "Keterangan / Ciri-ciri Tambahan"}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {report.type === "Kepemilikan" ? report.claimNotes || "-" : report.characteristics}
                  </p>
                </div>
                
                <div>
                  <p className="mb-2 text-xs text-slate-500">Lampiran Foto Bukti</p>
                  {report.images && report.images.length > 0 ? (
                    <div className="overflow-hidden rounded-xl bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={report.images[0]} alt="Bukti Lampiran" className="h-48 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                      <span className="text-xs text-slate-400">Tidak ada foto bukti yang dilampirkan.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Admin Action Form */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-teal-900/70">
                Form Keputusan
              </h3>
              
              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Ubah Status Laporan
                  </span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-900"
                  >
                    <option value="Diperiksa">Diperiksa (Menunggu Keputusan)</option>
                    <option value="Siap Diambil">Disetujui (Siap Diambil)</option>
                    <option value="Selesai">Selesai (Barang Telah Diambil)</option>
                    <option value="Ditolak">Ditolak (Verifikasi Gagal)</option>
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Catatan Admin / Sistem
                    </span>
                    <span className="text-[10px] uppercase text-slate-400">
                      Dapat dilihat oleh user
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Tulis instruksi pengambilan atau alasan penolakan di sini..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-900"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminNote("Pengajuan disetujui. Silakan ambil barang Anda di Gedung Administrasi Lantai 1 pada jam kerja (08.00 - 16.00). Harap bawa Kartu Tanda Mahasiswa (KTM) sebagai syarat wajib pengambilan.")}
                      className="rounded-full bg-slate-200/60 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200"
                    >
                      Template: Disetujui
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminNote("Ciri-ciri barang tidak sesuai dengan laporan yang dikirimkan. Laporan dikembalikan ke status 'Sedang Dicari' untuk dicocokkan kembali di kemudian hari.")}
                      className="rounded-full bg-slate-200/60 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200"
                    >
                      Template: Ditolak
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-teal-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-900"
          >
            Simpan Keputusan
          </button>
        </div>
      </div>
    </div>
  );
}
