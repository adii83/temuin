import Link from "next/link";

const highlights = [
  "Laporan resmi kampus",
  "Verifikasi oleh admin",
  "Serah terima terkontrol",
];

const latestFindings = [
  {
    item: "Laptop Asus Vivobook",
    location: "Gedung B, Lantai 2",
    date: "24 Apr 2026",
  },
  {
    item: "Dompet Kulit Hitam",
    location: "Area Parkir Timur",
    date: "23 Apr 2026",
  },
  {
    item: "Tumbler Stainless Navy",
    location: "Perpustakaan Pusat",
    date: "23 Apr 2026",
  },
];

const flow = [
  {
    number: "01",
    title: "Lapor",
    body: "Pengguna mengirim laporan kehilangan atau temuan.",
  },
  {
    number: "02",
    title: "Verifikasi",
    body: "Admin memeriksa laporan dan menerima barang fisik.",
  },
  {
    number: "03",
    title: "Serah Terima",
    body: "Barang diberikan kepada pemilik sah melalui admin.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f3eb_0%,#f3f6f3_52%,#fcfaf6_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
        <header className="sticky top-4 z-10 rounded-full border border-white/80 bg-white/82 px-5 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-950 text-sm font-semibold text-white">
                T
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-900/70">
                  TEMUIN
                </p>
                <p className="text-sm text-slate-600">
                  Lost and Found Kampus
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-teal-900 hover:text-teal-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-teal-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-900"
              >
                Daftar
              </Link>
            </nav>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(245,239,228,0.76))] px-7 py-12 shadow-[0_32px_100px_rgba(15,23,42,0.08)] sm:px-10 lg:px-14 lg:py-18">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,162,92,0.18),transparent_65%)]" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(11,59,63,0.14),transparent_68%)]" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-teal-900/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-teal-900/75">
                Platform layanan kampus
              </span>
              <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-display)] text-5xl leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
                TEMUIN
              </h1>
              <p className="mt-4 max-w-2xl text-xl leading-8 text-slate-700 sm:text-2xl">
                Sistem resmi kampus untuk barang hilang dan barang temuan.
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Sederhana, aman, dan terstruktur untuk membantu proses pelaporan,
                verifikasi, dan serah terima.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-teal-950 px-7 py-4 text-sm font-semibold text-white hover:bg-teal-900"
                >
                  Masuk ke TEMUIN
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/85 px-7 py-4 text-sm font-semibold text-slate-700 hover:border-teal-900 hover:text-teal-900"
                >
                  Buat Akun Pengguna
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-teal-900/70">
                    Temuan terbaru
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Contoh daftar barang yang sudah diterima admin
                  </p>
                </div>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-teal-900 hover:text-teal-700"
                >
                  Lihat semua
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {latestFindings.map((item) => (
                  <article
                    key={item.item}
                    className="rounded-[1.5rem] border border-slate-100 bg-[var(--color-paper)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">
                          {item.item}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.location}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--color-teal-100)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-900">
                        Resmi
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                      {item.date}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 py-10 md:grid-cols-3">
          {[
            ["Aman", "Semua proses dikelola melalui layanan kampus."],
            ["Jelas", "Alur dibuat singkat dan mudah dipahami."],
            ["Terkontrol", "Verifikasi dan serah terima dilakukan admin."],
          ].map(([title, body]) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-white/80 bg-white/78 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-900/70">
                {title}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-900/70">
              Alur layanan
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-950 sm:text-5xl">
              Satu alur yang singkat, formal, dan mudah diikuti.
            </h2>
          </div>

          <div className="grid gap-4">
            {flow.map((step) => (
              <article
                key={step.number}
                className="grid gap-4 rounded-[1.75rem] border border-white/80 bg-white/82 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:grid-cols-[88px_1fr] sm:items-start"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-950 text-sm font-semibold tracking-[0.2em] text-white sm:h-16 sm:w-16">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
