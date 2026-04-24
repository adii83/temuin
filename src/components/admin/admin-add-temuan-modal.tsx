import { useState } from "react";
import { ReportData } from "@/components/admin/admin-decision-modal";

type AdminAddTemuanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newData: ReportData) => void | Promise<void>;
};

export function AdminAddTemuanModal({
  isOpen,
  onClose,
  onAdd,
}: AdminAddTemuanModalProps) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Elektronik");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [characteristics, setCharacteristics] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    // Generate a random ID for mock purposes
    const randomId = `LT-240426-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
    
    await onAdd({
      id: randomId,
      type: "Temuan",
      itemName,
      category,
      date: date || new Date().toISOString().slice(0, 10),
      location,
      characteristics,
      status: "Tayang", // Auto publish for admin input
      contact: "Admin Pos Keamanan", // Default contact
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80"], // Mock image
    });
    
    // Reset form
    setItemName("");
    setCategory("Elektronik");
    setDate("");
    setLocation("");
    setCharacteristics("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              Input Laporan Baru
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
              Tambah Barang Temuan (Manual)
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
          <div className="mb-6 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
            <p className="text-sm text-teal-900">
              Laporan yang diinput melalui jalur Admin ini akan <strong>secara otomatis berstatus Tayang</strong> ke katalog publik.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Foto Barang Temuan (Minimal 3 Foto) <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[1, 2, 3].map((num) => (
                  <div 
                    key={num} 
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-2 py-6 text-center transition-colors hover:border-teal-500 hover:bg-teal-50/30"
                  >
                    <svg className="mb-2 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-teal-900">Foto {num}</span>
                  </div>
                ))}
                {/* Opsi Tambah Lebih Banyak */}
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-2 py-6 text-center transition-colors hover:border-teal-500 hover:bg-teal-50/30">
                  <span className="text-2xl font-light text-slate-400">+</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tambah Lagi</span>
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Wajib melampirkan minimal 3 sudut foto (Depan, Belakang, Detail). Anda dapat mengunggah foto tambahan jika terdapat banyak ciri khusus atau kerusakan pada barang.
              </p>
            </div>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama Barang Temuan</span>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Contoh: Dompet Hitam Kulit"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Kategori</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              >
                <option value="Elektronik">Elektronik</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Dokumen">Dokumen</option>
                <option value="Perlengkapan">Perlengkapan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Tanggal Ditemukan</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Lokasi Penemuan</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Gedung A, Lantai 2"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Ciri-ciri & Keterangan Tambahan</span>
              <textarea
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                rows={4}
                placeholder="Tuliskan detail barang..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="rounded-full bg-teal-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-900"
            >
              Tambahkan Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
