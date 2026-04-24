import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      role="user"
      eyebrow="Login Pengguna"
      title="Masuk ke akun TEMUIN."
      subtitle="Akses layanan lost and found resmi kampus."
      submitLabel="Masuk sebagai Pengguna"
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-teal-900">
            Daftar di sini
          </Link>
          .
        </>
      }
    />
  );
}
