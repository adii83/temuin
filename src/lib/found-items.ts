export type FoundItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  dateValue: string;
  image: string;
  images: string[];
  characteristics: string;
};

export const foundItems: FoundItem[] = [
  ["LT-240426-001", "Laptop Asus Vivobook", "Elektronik", "Gedung B, Lantai 2", "24 Apr 2026", "2026-04-24", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"],
  ["LT-240426-002", "Dompet Kulit Hitam", "Aksesoris", "Area Parkir Timur", "24 Apr 2026", "2026-04-24", "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80"],
  ["LT-230426-003", "Tumbler Stainless Navy", "Perlengkapan", "Perpustakaan Pusat", "23 Apr 2026", "2026-04-23", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"],
  ["LT-230426-004", "Flashdisk 64GB", "Elektronik", "Lab Komputer", "23 Apr 2026", "2026-04-23", "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80"],
  ["LT-220426-005", "Kartu Mahasiswa", "Identitas", "Kantin Fakultas", "22 Apr 2026", "2026-04-22", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=900&q=80"],
  ["LT-220426-006", "Headset Bluetooth", "Elektronik", "Ruang Seminar", "22 Apr 2026", "2026-04-22", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
  ["LT-210426-007", "Buku Catatan Kuliah", "Dokumen", "Gedung C, Lantai 1", "21 Apr 2026", "2026-04-21", "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80"],
  ["LT-210426-008", "Payung Lipat Abu-Abu", "Perlengkapan", "Lobby Rektorat", "21 Apr 2026", "2026-04-21", "https://images.unsplash.com/photo-1514632595-4944383f2737?auto=format&fit=crop&w=900&q=80"],
  ["LT-200426-009", "Jam Tangan Digital", "Aksesoris", "Lapangan Basket", "20 Apr 2026", "2026-04-20", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
  ["LT-200426-010", "Kunci Motor Honda", "Kunci", "Pos Satpam Utama", "20 Apr 2026", "2026-04-20", "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80"],
  ["LT-190426-011", "Powerbank Putih", "Elektronik", "Ruang Baca", "19 Apr 2026", "2026-04-19", "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80"],
  ["LT-190426-012", "Tas Selempang Cokelat", "Tas", "Gedung D, Lantai 3", "19 Apr 2026", "2026-04-19", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80"],
  ["LT-180426-013", "Kacamata Minus", "Aksesoris", "Masjid Kampus", "18 Apr 2026", "2026-04-18", "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80"],
  ["LT-180426-014", "Kalkulator Scientific", "Akademik", "Ruang Ujian 204", "18 Apr 2026", "2026-04-18", "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=80"],
  ["LT-170426-015", "Jaket Hoodie Hitam", "Pakaian", "Aula Serbaguna", "17 Apr 2026", "2026-04-17", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"],
  ["LT-170426-016", "Map Berisi Berkas", "Dokumen", "Loket Administrasi", "17 Apr 2026", "2026-04-17", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80"],
].map(([id, name, category, location, date, dateValue, image]) => ({
  id,
  name,
  category,
  location,
  date,
  dateValue,
  image,
  images: [image, image, image],
  characteristics: `Barang berupa ${name} dengan kategori ${category}. Warna dominan sesuai pada gambar. Terdapat beberapa tanda pemakaian wajar. Tidak ditemukan identitas khusus yang melekat pada barang.`,
}));

export const foundItemCategories = [
  "Semua",
  "Elektronik",
  "Aksesoris",
  "Dokumen",
  "Perlengkapan",
];
