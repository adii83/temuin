/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ReportData } from "@/components/admin/admin-decision-modal";
import { createClient } from "@/utils/supabase/client";

type AdminEditTemuanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  report: ReportData | null;
  onSave: (id: string, updatedData: Partial<ReportData>) => void | Promise<void>;
};

export function AdminEditTemuanModal({
  isOpen,
  onClose,
  report,
  onSave,
}: AdminEditTemuanModalProps) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [characteristics, setCharacteristics] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Menunggu");
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (report) {
      setItemName(report.itemName);
      setCategory(report.category);
      setCharacteristics(report.characteristics || "");
      setImages(report.images || []);
      setSelectedStatus(report.status);
      setUploadError("");
    }
  }, [report]);

  if (!isOpen || !report || !mounted) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name.replace(/\s/g, "_")}`;
      const { error } = await supabase.storage
        .from("item-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        setUploadError(`Gagal upload ${file.name}: ${error.message}`);
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (images.length < 3) {
      setUploadError("⚠️ Wajib minimal 3 foto sebelum menyimpan!");
      return;
    }
    setIsSaving(true);
    await onSave(report.id, {
      itemName,
      category,
      characteristics,
      images,
      status: selectedStatus,
    });
    setIsSaving(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              Review &amp; Publikasi
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <p className="mb-6 text-sm text-slate-600">
            Rapikan informasi laporan dari pengguna sebelum dipublikasikan ke katalog Barang Temuan Resmi.
          </p>

          {/* Read-only original data */}
          <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h4 className="mb-4 text-sm font-semibold text-slate-900">
              Data Laporan Asli (Read-Only)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500">Tanggal Penemuan</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{report.date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Lokasi Penemuan</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{report.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-medium text-slate-500">Nomor WhatsApp / Kontak Aktif</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{report.contact || "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Status */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Ubah Status Laporan Temuan</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              >
                <option value="Menunggu">Menunggu (Barang Belum Diterima)</option>
                <option value="Barang Diterima">Barang Diterima (Verifikasi Fisik)</option>
                <option value="Tayang">Tayang (Publikasi ke Katalog)</option>
                <option value="Telah Diklaim">Telah Diklaim</option>
                <option value="Ditolak">Ditolak (Laporan Spam)</option>
              </select>
            </label>

            {/* Item Name */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama Barang</span>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            {/* Category */}
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

            {/* Characteristics */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Ciri-ciri barang</span>
              <textarea
                value={characteristics}
                onChange={(e) => setCharacteristics(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-900"
              />
            </label>

            {/* Photo Management */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Kelola Foto Barang{" "}
                  <span className={images.length >= 3 ? "text-teal-700 font-semibold" : "text-red-500 font-semibold"}>
                    ({images.length}/minimal 3 foto)
                  </span>
                </span>
              </div>

              {/* Existing images grid */}
              {images.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File Upload Drop Zone */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition-colors ${
                  isUploading
                    ? "border-teal-300 bg-teal-50 cursor-wait"
                    : "border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50 cursor-pointer"
                }`}
              >
                {isUploading ? (
                  <p className="text-sm font-medium text-teal-700 animate-pulse">
                    ⏳ Sedang mengupload foto...
                  </p>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mb-3 h-9 w-9 text-slate-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-slate-700">
                      Klik untuk pilih foto dari laptop
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG, WEBP — bisa pilih beberapa sekaligus
                    </p>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                disabled={isUploading}
              />

              {uploadError && (
                <p className="mt-3 text-sm font-medium text-red-600">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
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
              disabled={isSaving || isUploading}
              className="rounded-full bg-teal-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-900 disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Pembaruan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
