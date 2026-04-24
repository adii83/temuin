/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect */
import { FoundItem } from "@/lib/found-items";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type FoundItemDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: FoundItem | null;
};

export function FoundItemDetailModal({
  isOpen,
  onClose,
  item,
}: FoundItemDetailModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !item || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/70">
              Detail Barang Temuan
            </p>
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
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                <img
                  src={item.images[activeImage] || item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Thumbnail strip */}
              {item.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImage === idx
                          ? "border-teal-900 ring-2 ring-teal-900/20"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx+1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Item Details matching the Form */}
            <div className="flex flex-col space-y-6">
              <div>
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-slate-900">
                  {item.name}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold tracking-wider text-teal-900">
                    ID: {item.id}
                  </span>
                </div>
              </div>

              <div className="space-y-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Tanggal Ditemukan
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {item.date}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Lokasi Ditemukan
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {item.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Ciri-ciri barang
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    {item.characteristics}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href={`/verifikasi-kepemilikan?barang=${encodeURIComponent(item.id)}`}
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-full bg-teal-950 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-teal-950/20 hover:bg-teal-900"
                >
                  Ajukan Klaim Kepemilikan
                </Link>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Pastikan Anda memiliki bukti (foto, struk, kardus, dll) yang menunjukkan kepemilikan sah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
