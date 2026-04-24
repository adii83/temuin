"use client";

import { useState } from "react";

import { UserShell } from "@/components/shells/user-shell";

export default function LaporKehilanganPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofFiles, setProofFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simpan referensi form SEBELUM await apapun
    const form = e.currentTarget;
    setIsSubmitting(true);

    const formData = new FormData(form);
    const item_name = formData.get("item_name") as string;
    const contact_info = formData.get("contact_info") as string;
    const category = formData.get("category") as string;
    const lost_date = formData.get("lost_date") as string;
    const location = formData.get("location") as string;
    const characteristics = formData.get("characteristics") as string;

    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Prepare ID: LK-YYMMDD-RAND
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const id = `LK-${dateStr}-${rand}`;

    // Upload foto bukti ke Supabase Storage (opsional)
    const image_urls: string[] = [];
    if (proofFiles && proofFiles.length > 0) {
      for (const file of Array.from(proofFiles)) {
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
    }

    const { error } = await supabase.from("lost_items").insert({
      id,
      reporter_id: user?.id || null,
      item_name,
      contact_info,
      category,
      lost_date,
      location,
      characteristics,
      image_urls,
      status: "Mencari"
    });

    setIsSubmitting(false);

    if (!error) {
      setSubmitted(true);
      setProofFiles(null);
      form.reset();
    } else {
      alert("Gagal mengirim laporan: " + error.message);
    }
  };

  return (
    <UserShell
      title="Lapor Kehilangan"
      description="Kirim laporan barang hilang ke layanan kampus."
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
                placeholder="Contoh: Dompet kulit hitam"
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
                Tanggal kehilangan
              </span>
              <input
                required
                name="lost_date"
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Lokasi terakhir
              </span>
              <input
                required
                name="location"
                placeholder="Contoh: Perpustakaan pusat"
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
                placeholder="Tuliskan warna, merek, isi barang, atau ciri khusus"
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Foto barang atau bukti pendukung <span className="font-normal text-slate-400">(Tidak Wajib)</span>
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setProofFiles(e.target.files)}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-teal-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {proofFiles && proofFiles.length > 0 && (
                <p className="mt-2 text-xs font-medium text-teal-700">
                  ✓ {proofFiles.length} foto dipilih — akan diupload saat laporan dikirim
                </p>
              )}
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
  );
}
