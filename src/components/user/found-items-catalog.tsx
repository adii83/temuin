"use client";

/* eslint-disable @next/next/no-img-element */
import { useDeferredValue, useState } from "react";

import { SmoothLink } from "@/components/smooth-link";
import { FoundItemDetailModal } from "@/components/user/found-item-detail-modal";
import { FoundItem, foundItemCategories } from "@/lib/found-items";

type FoundItemsCatalogProps = {
  initialItems: FoundItem[];
};

export function FoundItemsCatalog({ initialItems }: FoundItemsCatalogProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Terbaru");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filteredItems = initialItems
    .filter((item) => {
      const search = deferredQuery.toLowerCase().trim();
      const matchesSearch =
        !search ||
        [item.name, item.category, item.location].some((value) =>
          value.toLowerCase().includes(search),
        );
      const matchesCategory = category === "Semua" || item.category === category;
      const matchesDate = !date || item.dateValue === date;

      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) =>
      sort === "Terbaru"
        ? b.dateValue.localeCompare(a.dateValue)
        : a.dateValue.localeCompare(b.dateValue),
    );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/80 bg-white/88 p-5 shadow-[var(--shadow-card)]">
        <div className="grid gap-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama barang, lokasi, atau kategori"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm outline-none focus:border-teal-900 focus:bg-white"
          />

          <div className="grid gap-3 lg:grid-cols-[160px_190px_1fr] lg:items-center">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-teal-900 focus:bg-white"
            >
              <option>Terbaru</option>
              <option>Terlama</option>
            </select>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-teal-900 focus:bg-white"
            />

            <div className="flex flex-wrap gap-2">
              {foundItemCategories.map((itemCategory) => (
                <button
                  key={itemCategory}
                  type="button"
                  onClick={() => setCategory(itemCategory)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    category === itemCategory
                      ? "border-teal-950 bg-teal-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-teal-900 hover:text-teal-900"
                  }`}
                >
                  {itemCategory}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer flex min-h-[26rem] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/92 shadow-[0_18px_54px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,23,42,0.2)_100%)]" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-900">
                {item.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h2 className="min-h-[3.5rem] text-xl leading-tight font-semibold text-slate-950">
                {item.name}
              </h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>{item.location}</p>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                  {item.date}
                </p>
              </div>
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={(e) => {
                    // Prevent triggering article click when clicking the button directly
                    e.stopPropagation();
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-teal-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
                >
                  <SmoothLink
                    href={`/verifikasi-kepemilikan?barang=${encodeURIComponent(
                      item.id,
                    )}`}
                    className="block h-full w-full"
                  >
                    Ajukan Kepemilikan
                  </SmoothLink>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-white/80 bg-white/88 p-8 text-center text-sm text-slate-600 shadow-[var(--shadow-card)]">
          Tidak ada barang temuan yang sesuai filter.
        </div>
      ) : null}

      <FoundItemDetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
}
