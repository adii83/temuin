"use client";

import { useState } from "react";

import { UserShell } from "@/components/shells/user-shell";

export default function LaporTemuanPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileError, setFileError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length < 3) {
      setFileError("Mohon unggah minimal 3 bukti foto.");
      return;
    }
    setFileError("");
    // Simpan referensi form SEBELUM await apapun
    const form = e.currentTarget;
    setIsSubmitting(true);

    const formData = new FormData(form);
    const item_name = formData.get("item_name") as string;
    const contact_info = formData.get("contact_info") as string;
    const category = formData.get("category") as string;
    const found_date = formData.get("found_date") as string;
    const location = formData.get("location") as string;
    const characteristics = formData.get("characteristics") as string;

    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Prepare ID: LT-YYMMDD-RAND
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const id = `LT-${dateStr}-${rand}`;

    // Upload foto ke Supabase Storage (item-images bucket)
    const image_urls: string[] = [];
    for (const file of Array.from(files)) {
      const fileName = `${id}_${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("item-images")
          .getPublicUrl(fileName);
        image_urls.push(urlData.publicUrl);
      }
    }

    const { error } = await supabase.from("found_items").insert({
      id,
      reporter_id: user?.id || null,
      item_name,
      contact_info,
      category,
      found_date,
      location,
      characteristics,
      image_urls,
      status: "Menunggu"
    });

    setIsSubmitting(false);

    if (!error) {
      setSubmitted(true);
      setShowSuccessModal(true);
      form.reset();
      setFiles(null);
    } else {
      alert("Gagal mengirim laporan: " + error.message);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Green top bar */}
            <div className="bg-teal-950 px-8 py-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">Laporan Berhasil Dikirim</p>
                  <h2 className="mt-0.5 text-lg font-bold">Terima kasih! 🎉</h2>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              <div className="rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Langkah Selanjutnya</p>
                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-900">
                  Segera serahkan barang temuan ke:
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <span className="mt-0.5 text-2xl">📍</span>
                  <div>
                    <p className="font-bold text-teal-900">Gedung Pusat Penerimaan Barang Hilang</p>
                    <p className="text-sm font-medium text-slate-700">GKB 1 — Lantai 3</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Laporan Anda sudah tercatat di sistem. Admin akan memverifikasi dan mempublikasikan barang ke katalog setelah menerima barang secara fisik.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full rounded-full bg-teal-950 py-3 text-sm font-bold text-white shadow-md hover:bg-teal-900 transition-colors"
              >
                Mengerti, Saya Akan Segera Ke Sana
              </button>
            </div>
          </div>
        </div>
      )}

      <UserShell
        title="Lapor Temuan"
        description="Laporkan barang yang ditemukan di area kampus."
      >
      <div className="w-full">
        <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[var(--shadow-card)] sm:p-8">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Nama barang
              </span>
              <input
                required
                name="item_name"
                placeholder="Contoh: Tumbler stainless navy"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Nomor WhatsApp / Kontak Aktif
              </span>
              <input
                required
                name="contact_info"
                type="tel"
                placeholder="Contoh: 081234567890"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Kategori
              </span>
              <select
                required
                name="category"
                defaultValue=""
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-900 focus:bg-white"
              >
                <option value="" disabled>Pilih kategori...</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Dokumen">Dokumen</option>
                <option value="Perlengkapan">Perlengkapan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Tanggal ditemukan
              </span>
              <input
                required
                name="found_date"
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Lokasi ditemukan
              </span>
              <input
                required
                name="location"
                placeholder="Contoh: Lobby rektorat"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Ciri-ciri barang
              </span>
              <textarea
                required
                name="characteristics"
                placeholder="Tuliskan warna, merek, kondisi, atau ciri khusus"
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Foto barang temuan <span className="text-red-500">* (Wajib minimal 3 foto)</span>
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-teal-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {fileError && <p className="mt-2 text-sm text-red-500">{fileError}</p>}
            </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="mt-6 rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-70"
            >
              {isSubmitting ? "Mengirim..." : submitted ? "Laporan Terkirim - Cek Lacak Status" : "Kirim Laporan"}
            </button>
          </form>
        </section>
      </div>
    </UserShell>
    </>
  );
}
