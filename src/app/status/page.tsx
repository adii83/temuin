import { UserShell } from "@/components/shells/user-shell";
import { createClient } from "@/utils/supabase/server";

type StatusItem = {
  title: string;
  type: "Kehilangan" | "Temuan" | "Kepemilikan";
  state: string;
  date: string;
  createdAt: string;
  reference: string;
  detail: string;
  steps: string[];
  currentStep: number;
  statusColor: string;
};

type LostItemRow = {
  id: string;
  item_name: string;
  status: string;
  created_at: string;
};

type FoundItemRow = {
  id: string;
  item_name: string;
  status: string;
  created_at: string;
};

type ClaimRow = {
  id: string;
  item_id: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  found_items?: {
    item_name?: string | null;
  } | null;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusColor = (state: string) => {
  if (state === "Ditolak") return "bg-red-100 text-red-800";
  if (state === "Selesai") return "bg-emerald-100 text-emerald-800";
  if (["Siap Diambil", "Tayang", "Ditemukan", "Telah Diklaim"].includes(state)) {
    return "bg-teal-100 text-teal-900";
  }

  return "bg-amber-100 text-amber-900";
};

const foundStep = (state: string) => {
  const map: Record<string, number> = {
    Menunggu: 1,
    "Barang Diterima": 2,
    Tayang: 3,
    "Telah Diklaim": 4,
    Ditolak: 2,
  };

  return map[state] || 1;
};

const lostStep = (state: string) => {
  const map: Record<string, number> = {
    Mencari: 2,
    Ditemukan: 4,
    Selesai: 5,
    Ditolak: 4,
  };

  return map[state] || 1;
};

const claimStep = (state: string) => {
  const map: Record<string, number> = {
    Menunggu: 1,
    Diperiksa: 2,
    "Siap Diambil": 4,
    Selesai: 5,
    Ditolak: 3,
  };

  return map[state] || 1;
};

export default async function StatusPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [lostResponse, foundResponse, claimsResponse] = await Promise.all([
    user
      ? supabase
          .from("lost_items")
          .select("*")
          .eq("reporter_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    user
      ? supabase
          .from("found_items")
          .select("*")
          .eq("reporter_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    user
      ? supabase
          .from("claims")
          .select("*, found_items(item_name)")
          .eq("claimer_id", user.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const lostItems: StatusItem[] = ((lostResponse.data || []) as LostItemRow[]).map((item) => ({
    title: `Laporan Kehilangan - ${item.item_name}`,
    type: "Kehilangan",
    state: item.status,
    date: formatDate(item.created_at),
    createdAt: item.created_at,
    reference: item.id,
    detail:
      item.status === "Ditemukan"
        ? "Ada barang temuan yang berpotensi cocok. Tunggu keputusan admin atau instruksi pengambilan."
        : item.status === "Selesai"
          ? "Barang telah dikembalikan dan laporan ditutup."
          : item.status === "Ditolak"
            ? "Laporan tidak dapat diproses. Periksa kembali detail laporan atau hubungi admin."
            : "Laporan aktif dan sedang menunggu pencocokan dengan barang temuan.",
    steps: ["Dikirim", "Sedang Dicocokkan", "Potensi Cocok", "Keputusan Admin", "Selesai"],
    currentStep: lostStep(item.status),
    statusColor: getStatusColor(item.status),
  }));

  const foundItems: StatusItem[] = ((foundResponse.data || []) as FoundItemRow[]).map((item) => ({
    title: `Laporan Temuan - ${item.item_name}`,
    type: "Temuan",
    state: item.status,
    date: formatDate(item.created_at),
    createdAt: item.created_at,
    reference: item.id,
    detail:
      item.status === "Tayang"
        ? "Barang sudah tampil di daftar barang temuan resmi."
        : item.status === "Telah Diklaim"
          ? "Barang sedang/ telah masuk proses klaim kepemilikan."
          : item.status === "Ditolak"
            ? "Laporan temuan tidak dapat dipublikasikan oleh admin."
            : "Laporan temuan menunggu pemeriksaan dan penerimaan fisik oleh admin.",
    steps: ["Dikirim", "Barang Diterima Admin", "Tayang di Daftar", "Diklaim"],
    currentStep: foundStep(item.status),
    statusColor: getStatusColor(item.status),
  }));

  const claims: StatusItem[] = ((claimsResponse.data || []) as ClaimRow[]).map((item) => ({
    title: `Ajukan Kepemilikan - ${item.found_items?.item_name || item.item_id}`,
    type: "Kepemilikan",
    state: item.status,
    date: formatDate(item.created_at),
    createdAt: item.created_at,
    reference: item.id,
    detail:
      item.admin_notes ||
      (item.status === "Siap Diambil"
        ? "Pengajuan disetujui. Silakan ikuti instruksi admin untuk pengambilan barang."
        : item.status === "Selesai"
          ? "Barang telah diambil dan proses klaim selesai."
          : item.status === "Ditolak"
            ? "Pengajuan kepemilikan ditolak oleh admin."
            : "Pengajuan kepemilikan sedang menunggu pemeriksaan admin."),
    steps: ["Dikirim", "Diperiksa Admin", "Keputusan Admin", "Siap Diambil", "Selesai"],
    currentStep: claimStep(item.status),
    statusColor: getStatusColor(item.status),
  }));

  const statuses = [...lostItems, ...foundItems, ...claims].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <UserShell
      title="Lacak Status"
      description="Pantau laporan dan pengajuan yang sudah dikirim."
    >
      <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/92 shadow-[var(--shadow-card)]">
        <div className="hidden grid-cols-[150px_1fr_140px_150px_180px] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 lg:grid">
          <span>Kode</span>
          <span>Pengajuan</span>
          <span>Jenis</span>
          <span>Tanggal</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100">
          {statuses.length > 0 ? (
            statuses.map((item) => (
              <details key={item.reference} className="group">
                <summary className="grid cursor-pointer list-none gap-4 px-6 py-5 lg:grid-cols-[150px_1fr_140px_150px_180px] lg:items-center">
                  <p className="text-sm font-semibold text-teal-900">
                    {item.reference}
                  </p>
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 lg:hidden">
                      {item.date} - {item.type}
                    </p>
                  </div>
                  <p className="hidden text-sm text-slate-600 lg:block">
                    {item.type}
                  </p>
                  <p className="hidden text-sm text-slate-600 lg:block">
                    {item.date}
                  </p>
                  <span className={`w-fit whitespace-nowrap rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${item.statusColor}`}>
                    {item.state}
                  </span>
                </summary>

                <div className="border-t border-slate-100 bg-[var(--color-paper)] px-6 py-5">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-900/60">
                      Catatan Admin / Sistem
                    </span>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{item.detail}</p>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-5">
                    {item.steps.map((step, index) => {
                      const isErrorState = item.state === "Ditolak" && index + 1 === item.currentStep;

                      return (
                        <div
                          key={step}
                          className={`relative rounded-2xl border ${isErrorState ? "border-red-200 bg-red-50" : "border-slate-100 bg-white"} p-4`}
                        >
                          <span
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                              isErrorState
                                ? "bg-red-600 text-white"
                                : index + 1 <= item.currentStep
                                  ? "bg-teal-950 text-white"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isErrorState ? "!" : index + 1}
                          </span>
                          <p className={`mt-3 text-sm font-semibold ${isErrorState ? "text-red-900" : "text-slate-800"}`}>
                            {step}
                          </p>
                          <p className={`mt-1 text-xs ${isErrorState ? "text-red-700" : "text-slate-500"}`}>
                            {index + 1 < item.currentStep
                              ? "Selesai"
                              : index + 1 === item.currentStep
                                ? isErrorState
                                  ? "Ditolak"
                                  : "Berjalan"
                                : "Menunggu"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </details>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                Belum ada laporan atau pengajuan dari akun ini.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Setelah mengirim laporan kehilangan, temuan, atau klaim kepemilikan, progresnya akan muncul di sini.
              </p>
            </div>
          )}
        </div>
      </section>
    </UserShell>
  );
}
