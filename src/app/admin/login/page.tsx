import { AuthShell } from "@/components/auth/auth-shell";

export default function AdminLoginPage() {
  return (
    <AuthShell
      role="admin"
      eyebrow="Login Admin"
      title="Masuk ke area admin TEMUIN."
      subtitle="Akses verifikasi dan pengelolaan laporan kampus."
      submitLabel="Masuk sebagai Admin"
      footer={null}
    />
  );
}
