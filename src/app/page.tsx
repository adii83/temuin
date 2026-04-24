/* eslint-disable @next/next/no-img-element */
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
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    item: "Dompet Kulit Hitam",
    location: "Area Parkir Timur",
    date: "23 Apr 2026",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
  },
  {
    item: "Tumbler Stainless Navy",
    location: "Perpustakaan Pusat",
    date: "23 Apr 2026",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    item: "Flashdisk 64GB",
    location: "Lab Komputer",
    date: "22 Apr 2026",
    image:
      "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80",
  },
];

const flow = [
  {
    number: "01",
    title: "Laporan Masuk",
    body: "Pengguna mengirim laporan kehilangan atau temuan melalui sistem.",
  },
  {
    number: "02",
    title: "Verifikasi Admin",
    body: "Admin memeriksa data laporan dan menerima barang fisik yang dititipkan.",
  },
  {
    number: "03",
    title: "Proses Serah Terima",
    body: "Barang diberikan kepada pemilik sah setelah verifikasi kepemilikan selesai.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f3eb_0%,#f1f5f2_50%,#fcfaf6_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
        <header className="sticky top-4 z-20 rounded-full border border-white/80 bg-white/78 px-5 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="glass-line" />
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
                  Lost & Found Kampus
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

        <section className="section-shell relative mt-12 rounded-[2.75rem] px-7 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute left-12 top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(11,59,63,0.06),transparent_70%)]" />
          <div className="absolute right-12 top-14 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,162,92,0.08),transparent_70%)]" />

          <div className="relative flex min-h-[24rem] items-start py-4 sm:min-h-[28rem] sm:items-center">
            <div className="max-w-4xl">
              <span className="inline-flex rounded-full border border-teal-900/10 bg-white/82 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-teal-900/75">
                Platform layanan kampus
              </span>
              <h1 className="mt-8 font-[family-name:var(--font-display)] text-6xl leading-[0.96] text-slate-950 sm:text-7xl lg:text-[7.25rem]">
                TEMUIN
              </h1>
              <p className="mt-6 max-w-3xl text-2xl leading-10 text-slate-700 sm:text-3xl sm:leading-[3rem]">
                Sistem resmi kampus untuk barang hilang dan barang temuan.
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Ringkas, aman, dan terstruktur untuk membantu proses pelaporan,
                verifikasi, dan serah terima.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
          </div>
        </section>

        <section className="section-shell mt-10 rounded-[2.4rem] px-6 py-8 sm:px-8">
          <div className="relative grid gap-5 md:grid-cols-3">
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
          </div>
        </section>

        <section className="section-shell mt-10 rounded-[2.6rem] px-6 py-10 sm:px-8 lg:px-10">
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-900/70">
                Temuan terbaru
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-950 sm:text-5xl">
                Daftar barang temuan resmi.
              </h2>
            </div>
            <Link
              href="/login"
              className="hidden rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:border-teal-900 hover:text-teal-900 sm:inline-flex"
            >
              Lihat semua
            </Link>
          </div>

          <div className="relative mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {latestFindings.map((item) => (
              <article
                key={item.item}
                className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/86 shadow-[0_18px_54px_rgba(15,23,42,0.06)]"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <div className="absolute right-5 top-5 rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-900">
                    Resmi
                  </div>
                  <img
                    src={item.image}
                    alt={item.item}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(15,23,42,0.18)_100%)]" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="min-h-[3.75rem] text-xl leading-tight font-semibold text-slate-950">
                    {item.item}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">{item.location}</p>
                  <p className="mt-auto pt-5 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                    {item.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell mt-10 rounded-[2.6rem] px-6 py-10 sm:px-8 lg:px-10">
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-900/70">
                Alur layanan
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-slate-950 sm:text-5xl">
                Satu alur yang singkat, formal, dan mudah diikuti.
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-7 top-0 hidden h-full w-px bg-[linear-gradient(180deg,rgba(11,59,63,0.12),rgba(11,59,63,0.38),rgba(11,59,63,0.12))] sm:block" />
              <div className="grid gap-5">
                {flow.map((step) => (
                  <article
                    key={step.number}
                    className="relative grid gap-4 rounded-[1.75rem] border border-white/80 bg-white/84 p-6 shadow-[0_18px_54px_rgba(15,23,42,0.05)] sm:grid-cols-[88px_1fr] sm:items-start"
                  >
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#d7c08a]/40 bg-teal-950 text-sm font-semibold tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(11,59,63,0.22)] sm:h-16 sm:w-16">
                      {step.number}
                    </div>
                    <div className="rounded-[1.35rem] border border-slate-100 bg-[linear-gradient(180deg,#fffdfa_0%,#f7f3eb_100%)] p-5">
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
            </div>
          </div>
        </section>

        <footer className="mt-10 overflow-hidden rounded-[2.2rem] border border-white/80 bg-[#0b3b3f] text-white shadow-[0_24px_70px_rgba(11,59,63,0.18)]">
          <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr] lg:px-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-teal-950">
                  T
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
                    TEMUIN
                  </p>
                  <p className="text-sm text-white/72">Lost & Found Kampus</p>
                </div>
              </div>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/68">
                Layanan resmi kampus untuk membantu pelaporan, verifikasi, dan
                serah terima barang hilang maupun temuan.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7c08a]">
                Layanan
              </p>
              <div className="mt-5 grid gap-3 text-sm text-white/70">
                <Link href="/login" className="hover:text-white">
                  Barang temuan
                </Link>
                <Link href="/login" className="hover:text-white">
                  Lapor kehilangan
                </Link>
                <Link href="/login" className="hover:text-white">
                  Lapor temuan
                </Link>
                <Link href="/login" className="hover:text-white">
                  Lacak status
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7c08a]">
                Akses
              </p>
              <div className="mt-5 grid gap-3 text-sm text-white/70">
                <Link href="/login" className="hover:text-white">
                  Login pengguna
                </Link>
                <Link href="/register" className="hover:text-white">
                  Daftar akun
                </Link>
                <Link href="/admin/login" className="hover:text-white">
                  Login admin
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7c08a]">
                Informasi
              </p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-white/70">
                <p>Unit layanan barang hilang dan temuan kampus</p>
                <p>Senin sampai Jumat, 08.00 sampai 16.00</p>
                <p>Gedung layanan administrasi kampus</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 text-sm text-white/58 md:flex-row md:items-center md:justify-between">
              <p>© 2026 TEMUIN. Sistem layanan kampus.</p>
              <p>Terstruktur, aman, dan terverifikasi.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
