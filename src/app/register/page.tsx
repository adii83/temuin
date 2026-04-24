import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      role="user"
      eyebrow="Pendaftaran Pengguna"
      title="Buat akun TEMUIN."
      subtitle="Daftarkan akun kampus untuk mulai menggunakan layanan."
      submitLabel="Daftar dan Masuk"
      showFullName
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-teal-900">
            Kembali ke login
          </Link>
          .
        </>
      }
    />
  );
}
