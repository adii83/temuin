import { UserShell } from "@/components/shells/user-shell";
import { OwnershipForm } from "@/components/user/ownership-form";

type VerifikasiPageProps = {
  searchParams?: Promise<{
    barang?: string;
  }>;
};

export default async function VerifikasiPage({
  searchParams,
}: VerifikasiPageProps) {
  const params = await searchParams;

  return (
    <UserShell
      title="Ajukan Kepemilikan"
      description="Kirim bukti kepemilikan untuk barang temuan yang tersedia."
    >
      <OwnershipForm initialItemId={params?.barang} />
    </UserShell>
  );
}
