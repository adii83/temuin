"use client";

/* eslint-disable @next/next/no-img-element */
import { FormEvent, useEffect, useMemo, useState } from "react";

import { FoundItemDetailModal } from "@/components/user/found-item-detail-modal";
import { FoundItem } from "@/lib/found-items";
import { createClient } from "@/utils/supabase/client";

type OwnershipFormProps = {
  initialItemId?: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500";

type FoundItemRow = {
  id: string;
  item_name: string;
  category: string;
  location: string;
  found_date: string;
  image_urls: string[] | null;
  characteristics: string | null;
};

const formatFoundItem = (item: FoundItemRow): FoundItem => {
  const images = item.image_urls && item.image_urls.length > 0 ? item.image_urls : [fallbackImage];

  return {
    id: item.id,
    name: item.item_name,
    category: item.category,
    location: item.location,
    date: new Date(item.found_date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    dateValue: item.found_date,
    image: images[0],
    images,
    characteristics: item.characteristics || "Tidak ada ciri khusus yang dicatat.",
  };
};

export function OwnershipForm({ initialItemId }: OwnershipFormProps) {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(initialItemId || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [proofFiles, setProofFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("found_items")
        .select("*")
        .eq("status", "Tayang")
        .order("found_date", { ascending: false });

      const formatted = ((data || []) as FoundItemRow[]).map(formatFoundItem);
      setItems(formatted);

      if (!initialItemId || !formatted.some((item) => item.id === initialItemId)) {
        setSelectedItemId(formatted[0]?.id || "");
      }

      setIsLoading(false);
    };

    loadItems();
  }, [initialItemId]);

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedItemId) || items[0];
  }, [items, selectedItemId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem) return;

    // Simpan referensi form SEBELUM await apapun
    // (React menghapus event.currentTarget setelah await pertama)
    const form = event.currentTarget;

    setIsSubmitting(true);
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Sesi tidak ditemukan. Silakan login ulang.");
      setIsSubmitting(false);
      return;
    }

    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const id = `AK-${dateStr}-${rand}`;
    const formData = new FormData(form);
    const claimNotes = String(formData.get("ownershipProof") || "").trim();

    // Cek apakah sudah pernah mengajukan klaim untuk barang yang sama
    const { data: existing } = await supabase
      .from("claims")
      .select("id")
      .eq("item_id", selectedItem.id)
      .eq("claimer_id", user.id)
      .maybeSingle();

    if (existing) {
      setMessage("⚠️ Anda sudah pernah mengajukan klaim untuk barang ini. Pantau statusnya di halaman Lacak Status.");
      setIsSubmitting(false);
      return;
    }

    // Upload foto bukti ke Supabase Storage (item-images — public bucket)
    const proofImageUrls: string[] = [];
    if (proofFiles && proofFiles.length > 0) {
      for (const file of Array.from(proofFiles)) {
        const fileName = `proof/${id}_${Date.now()}_${file.name.replace(/\s/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("item-images")
            .getPublicUrl(fileName);
          proofImageUrls.push(urlData.publicUrl);
        }
      }
    }

    const { error } = await supabase.from("claims").insert({
      id,
      item_id: selectedItem.id,
      claimer_id: user.id,
      status: "Menunggu",
      claim_notes: claimNotes,
      proof_image_urls: proofImageUrls,
    });

    if (error) {
      setMessage(`Gagal mengirim pengajuan: ${error.message}`);
    } else {
      form.reset();
      setProofFiles(null);
      setMessage("✅ Pengajuan terkirim! Progresnya bisa dipantau di Lacak Status.");
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/80 bg-white/90 p-6 text-sm text-slate-500 shadow-[var(--shadow-card)]">
        Memuat barang temuan dari Supabase...
      </section>
    );
  }

  if (!selectedItem) {
    return (
      <section className="rounded-3xl border border-white/80 bg-white/90 p-8 text-center shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold text-slate-700">Belum ada barang temuan yang dapat diklaim.</p>
        <p className="mt-2 text-sm text-slate-500">Barang akan muncul di sini setelah admin mempublikasikan laporan temuan.</p>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
      <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[var(--shadow-card)]">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Barang yang diajukan
            </span>
            <select
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-900 focus:bg-white"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.location}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Bukti kepemilikan
            </span>
            <textarea
              name="ownershipProof"
              required
              placeholder="Tuliskan nomor seri, isi barang, ciri khusus, atau informasi pendukung"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-900 focus:bg-white"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Foto bukti <span className="font-normal text-slate-400">(Tidak Wajib)</span>
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setProofFiles(e.target.files)}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-teal-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            {proofFiles && proofFiles.length > 0 && (
              <p className="mt-2 text-xs text-teal-700 font-medium">
                ✓ {proofFiles.length} foto dipilih — akan diupload saat pengajuan dikirim
              </p>
            )}
          </label>

          {message ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit rounded-full bg-teal-950 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-70"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>
      </section>

      <aside
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,23,42,0.26)_100%)]" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-900">
            {selectedItem.category}
          </span>
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-900/70">
            Barang Dipilih
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            {selectedItem.name}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {selectedItem.location}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
            {selectedItem.date}
          </p>
        </div>
      </aside>

      <FoundItemDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
