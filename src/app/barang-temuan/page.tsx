import { UserShell } from "@/components/shells/user-shell";
import { FoundItemsCatalog } from "@/components/user/found-items-catalog";
import { createClient } from "@/utils/supabase/server";
import { FoundItem } from "@/lib/found-items";

export default async function BarangTemuanPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("found_items")
    .select("*")
    .eq("status", "Tayang")
    .order("found_date", { ascending: false });

  const items: FoundItem[] = (data || []).map((item) => {
    const date = new Date(item.found_date);
    const dateStr = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();

    const fallbackImage = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500";
    const images = item.image_urls && item.image_urls.length > 0 ? item.image_urls : [fallbackImage];

    return {
      id: item.id,
      name: item.item_name,
      category: item.category,
      location: item.location,
      date: dateStr,
      dateValue: item.found_date,
      image: images[0],
      images: images,
      characteristics: item.characteristics || "Tidak ada ciri khusus yang dicatat.",
    };
  });

  return (
    <UserShell
      title="Barang Temuan Resmi"
      description="Daftar barang temuan yang tersedia di layanan kampus."
    >
      <FoundItemsCatalog initialItems={items} />
    </UserShell>
  );
}
