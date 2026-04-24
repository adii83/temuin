import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// MOCK UUIDs for Relational Integrity
const adminId1 = "11111111-0000-4000-a000-000000000001";
const adminId2 = "11111111-0000-4000-a000-000000000002";
const userIds = [
  "22222222-0000-4000-a000-000000000001", "22222222-0000-4000-a000-000000000002",
  "22222222-0000-4000-a000-000000000003", "22222222-0000-4000-a000-000000000004",
  "22222222-0000-4000-a000-000000000005", "22222222-0000-4000-a000-000000000006",
  "22222222-0000-4000-a000-000000000007", "22222222-0000-4000-a000-000000000008",
];

const mockUsers = [
  { id: adminId1, full_name: "Bapak Supardi (Satpam)", email: "supardi@kampus.ac.id", role: "admin", status: "aktif" },
  { id: adminId2, full_name: "Ibu Rina (Admin Pusat)", email: "rina.admin@kampus.ac.id", role: "admin", status: "aktif" },
  { id: userIds[0], full_name: "Budi Santoso", email: "budi.santoso@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[1], full_name: "Nabila Ayu", email: "nabila.ayu@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[2], full_name: "Dimas Pratama", email: "dimas.pratama@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[3], full_name: "Siti Aminah", email: "siti.aminah@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[4], full_name: "Kevin Sanjaya", email: "kevin.sanjaya@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[5], full_name: "Putri Andini", email: "putri.andini@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[6], full_name: "Rizky Ramadhan", email: "rizky.ramadhan@kampus.ac.id", role: "mahasiswa", status: "aktif" },
  { id: userIds[7], full_name: "Dinda Ayunda", email: "dinda.ayunda@kampus.ac.id", role: "mahasiswa", status: "aktif" },
];

// Helper to get random user id
const getRandomReporter = () => userIds[Math.floor(Math.random() * userIds.length)];

// Generate 25 Found Items
const mockFoundItems = [
  { id: "LT-2404-001", reporter_id: null, item_name: "Dompet Kulit Coklat", category: "Aksesoris", found_date: "2024-04-10", location: "Perpustakaan Lt 2", characteristics: "Ada KTP atas nama Kevin", contact_info: "Pos Satpam Utama", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500"] },
  { id: "LT-2404-002", reporter_id: getRandomReporter(), item_name: "Kunci Motor Honda", category: "Kunci", found_date: "2024-04-11", location: "Parkiran FK", characteristics: "Gantungan kunci Doraemon", contact_info: "081234567890", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500"] },
  { id: "LT-2404-003", reporter_id: getRandomReporter(), item_name: "Botol Minum Tupperware", category: "Perlengkapan", found_date: "2024-04-12", location: "Kantin Bu Asih", characteristics: "Warna biru tutup hijau", contact_info: "Kantin Bu Asih", status: "Menunggu", image_urls: [] },
  { id: "LT-2404-004", reporter_id: null, item_name: "STNK Vario", category: "Dokumen", found_date: "2024-04-13", location: "Gerbang Depan", characteristics: "Atas nama Rizky R", contact_info: "Hubungi Pak Supardi", status: "Tayang", image_urls: [] },
  { id: "LT-2404-005", reporter_id: getRandomReporter(), item_name: "Earphone TWS Hitam", category: "Elektronik", found_date: "2024-04-14", location: "Lab Komputer Dasar", characteristics: "Merk Baseus, tanpa box", contact_info: "08987654321", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"] },
  { id: "LT-2404-006", reporter_id: null, item_name: "Tas Ransel Eiger", category: "Perlengkapan", found_date: "2024-04-15", location: "Masjid Kampus", characteristics: "Warna hitam abu, ada buku catatan", contact_info: "Pos Satpam Masjid", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"] },
  { id: "LT-2404-007", reporter_id: getRandomReporter(), item_name: "Kacamata Minus", category: "Aksesoris", found_date: "2024-04-16", location: "Ruang Kelas A301", characteristics: "Frame bulat warna gold", contact_info: "08112233445", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"] },
  { id: "LT-2404-008", reporter_id: null, item_name: "Buku Kalkulus Lanjut", category: "Buku", found_date: "2024-04-17", location: "Lobby Gedung Teknik", characteristics: "Ada coretan di halaman pertama", contact_info: "Pos Satpam Teknik", status: "Telah Diklaim", image_urls: [] },
  { id: "LT-2404-009", reporter_id: getRandomReporter(), item_name: "Flashdisk 64GB SanDisk", category: "Elektronik", found_date: "2024-04-18", location: "Lab Komputer 3", characteristics: "Warna merah hitam", contact_info: "082233445566", status: "Tayang", image_urls: [] },
  { id: "LT-2404-010", reporter_id: getRandomReporter(), item_name: "Helm Bogo Putih", category: "Perlengkapan", found_date: "2024-04-19", location: "Parkiran Rektorat", characteristics: "Kaca baret sedikit", contact_info: "083344556677", status: "Menunggu", image_urls: [] },
  { id: "LT-2404-011", reporter_id: null, item_name: "Mouse Wireless Logitech", category: "Elektronik", found_date: "2024-04-20", location: "Co-Working Space", characteristics: "Warna abu-abu, ada receiver-nya", contact_info: "Resepsionis", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"] },
  { id: "LT-2404-012", reporter_id: getRandomReporter(), item_name: "Jaket Parka Hijau", category: "Pakaian", found_date: "2024-04-21", location: "Aula Utama", characteristics: "Ukuran L, ada pin himpunan", contact_info: "084455667788", status: "Tayang", image_urls: [] },
  { id: "LT-2404-013", reporter_id: null, item_name: "Laptop Charger (Type C)", category: "Elektronik", found_date: "2024-04-22", location: "Perpustakaan Lt 1", characteristics: "Merk Baseus 65W", contact_info: "Satpam Perpus", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500"] },
  { id: "LT-2404-014", reporter_id: getRandomReporter(), item_name: "KTM a.n. Nabila Ayu", category: "Dokumen", found_date: "2024-04-23", location: "Taman Kampus", characteristics: "Fakultas Ekonomi", contact_info: "085566778899", status: "Tayang", image_urls: [] },
  { id: "LT-2404-015", reporter_id: getRandomReporter(), item_name: "Kunci Kos", category: "Kunci", found_date: "2024-04-24", location: "Kantin FEB", characteristics: "Ada gantungan macrame", contact_info: "086677889900", status: "Menunggu", image_urls: [] },
  { id: "LT-2404-016", reporter_id: null, item_name: "iPad Pro 11 inch", category: "Elektronik", found_date: "2024-04-25", location: "Lab Riset", characteristics: "Case warna pink, wallpaper gunung", contact_info: "Diserahkan ke Kepala Lab", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"] },
  { id: "LT-2404-017", reporter_id: getRandomReporter(), item_name: "Sepatu Olahraga Hitam", category: "Pakaian", found_date: "2024-04-25", location: "Stadion Kampus", characteristics: "Merk Nike ukuran 42", contact_info: "087788990011", status: "Tayang", image_urls: [] },
  { id: "LT-2404-018", reporter_id: getRandomReporter(), item_name: "Payung Lipat Biru", category: "Perlengkapan", found_date: "2024-04-26", location: "Halte Bus Kampus", characteristics: "Motif polkadot", contact_info: "088899001122", status: "Tayang", image_urls: [] },
  { id: "LT-2404-019", reporter_id: null, item_name: "Kotak Pensil Muji", category: "Perlengkapan", found_date: "2024-04-26", location: "Ruang Ujian B", characteristics: "Isi pulpen lengkap dan tip-x", contact_info: "Pak Satpam B", status: "Tayang", image_urls: [] },
  { id: "LT-2404-020", reporter_id: getRandomReporter(), item_name: "Jam Tangan Casio", category: "Aksesoris", found_date: "2024-04-27", location: "Toilet Lt 2 Teknik", characteristics: "Warna silver klasik", contact_info: "089900112233", status: "Tayang", image_urls: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500"] },
  { id: "LT-2404-021", reporter_id: getRandomReporter(), item_name: "Kalkulator Casio Scientific", category: "Elektronik", found_date: "2024-04-27", location: "Kelas FPMIPA", characteristics: "Seri fx-991EX, di belakang ada stiker bintang", contact_info: "081011121314", status: "Tayang", image_urls: [] },
  { id: "LT-2404-022", reporter_id: null, item_name: "Cincin Emas", category: "Aksesoris", found_date: "2024-04-28", location: "Wastafel Gedung C", characteristics: "Polos tanpa permata", contact_info: "Pos Keamanan Pusat (Diamankan ketat)", status: "Tayang", image_urls: [] },
  { id: "LT-2404-023", reporter_id: getRandomReporter(), item_name: "Powerbank Anker 10000mAh", category: "Elektronik", found_date: "2024-04-28", location: "Ruang BEM", characteristics: "Warna putih, kabel tertempel", contact_info: "082021222324", status: "Menunggu", image_urls: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500"] },
  { id: "LT-2404-024", reporter_id: null, item_name: "Buku Diary Pink", category: "Buku", found_date: "2024-04-29", location: "Taman Depan FISIP", characteristics: "Digembok kecil", contact_info: "Satpam FISIP", status: "Tayang", image_urls: [] },
  { id: "LT-2404-025", reporter_id: getRandomReporter(), item_name: "Kacamata Hitam Oakley", category: "Aksesoris", found_date: "2024-04-29", location: "Lapangan Basket", characteristics: "Lensa agak tergores", contact_info: "083031323334", status: "Tayang", image_urls: [] },
];

const mockLostItems = [
  { id: "LK-2404-001", reporter_id: userIds[0], item_name: "Dompet Hitam Kulit", category: "Aksesoris", lost_date: "2024-04-10", location: "Sekitar Kantin", characteristics: "KTP Budi Santoso", contact_info: "081234567890", status: "Mencari", image_urls: [] },
  { id: "LK-2404-002", reporter_id: userIds[1], item_name: "KTM Nabila Ayu", category: "Dokumen", lost_date: "2024-04-22", location: "Jalan menuju Taman", characteristics: "Ada pas foto latar merah", contact_info: "085566778899", status: "Ditemukan", image_urls: [] },
  { id: "LK-2404-003", reporter_id: userIds[2], item_name: "Laptop Asus ROG", category: "Elektronik", lost_date: "2024-04-25", location: "Ketinggalan di Kelas A", characteristics: "Stiker ROG besar", contact_info: "08987654321", status: "Mencari", image_urls: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500"] },
  { id: "LK-2404-004", reporter_id: userIds[3], item_name: "Buku Pemrograman Java", category: "Buku", lost_date: "2024-04-20", location: "Perpustakaan Lt 3", characteristics: "Buku tebal sampul biru", contact_info: "0811223344", status: "Mencari", image_urls: [] },
  { id: "LK-2404-005", reporter_id: userIds[4], item_name: "Kunci Mobil Yaris", category: "Kunci", lost_date: "2024-04-26", location: "Parkiran Rektorat", characteristics: "Gantungan tali hitam", contact_info: "0822334455", status: "Mencari", image_urls: [] },
  { id: "LK-2404-006", reporter_id: userIds[5], item_name: "Helm Cargloss Kuning", category: "Perlengkapan", lost_date: "2024-04-18", location: "Parkiran FK", characteristics: "Kaca flat warna gelap", contact_info: "0833445566", status: "Selesai", image_urls: [] },
  { id: "LK-2404-007", reporter_id: userIds[6], item_name: "STNK Vario", category: "Dokumen", lost_date: "2024-04-12", location: "Gerbang Depan", characteristics: "A.n Rizky Ramadhan", contact_info: "0844556677", status: "Ditemukan", image_urls: [] },
  { id: "LK-2404-008", reporter_id: userIds[7], item_name: "Catatan Kuliah Biru", category: "Buku", lost_date: "2024-04-22", location: "Kantin Pusat", characteristics: "Tertulis 'Milik Dinda A'", contact_info: "085611223344", status: "Ditemukan", image_urls: [] },
  { id: "LK-2404-009", reporter_id: userIds[0], item_name: "Airpods Pro", category: "Elektronik", lost_date: "2024-04-28", location: "Lab Bahasa", characteristics: "Case bening", contact_info: "081234567890", status: "Mencari", image_urls: ["https://images.unsplash.com/photo-1606220588913-b3aecb492061?w=500"] },
  { id: "LK-2404-010", reporter_id: userIds[1], item_name: "Tumbler Starbucks", category: "Perlengkapan", lost_date: "2024-04-29", location: "Aula Gedung F", characteristics: "Warna hitam edisi khusus", contact_info: "085566778899", status: "Mencari", image_urls: [] },
];

export async function GET() {
  const supabase = await createClient()

  try {
    // WIPE OUT existing data to prevent duplicates
    await supabase.from('claims').delete().neq('id', 'dummy');
    await supabase.from('found_items').delete().neq('id', 'dummy');
    await supabase.from('lost_items').delete().neq('id', 'dummy');
    await supabase.from('users').delete().in('id', [adminId1, adminId2, ...userIds]);

    // 1. Insert Fake Users
    const { error: usersError } = await supabase
      .from('users')
      .upsert(mockUsers)

    if (usersError) throw new Error(`Users Error: ${usersError.message}`)

    // 2. Insert Fake Found Items
    const { error: foundError } = await supabase
      .from('found_items')
      .upsert(mockFoundItems)

    if (foundError) throw new Error(`Found Items Error: ${foundError.message}`)

    // 3. Insert Fake Lost Items
    const { error: lostError } = await supabase
      .from('lost_items')
      .upsert(mockLostItems)

    if (lostError) throw new Error(`Lost Items Error: ${lostError.message}`)

    return NextResponse.json({
      success: true,
      data_count: {
        users: mockUsers.length,
        found_items: mockFoundItems.length,
        lost_items: mockLostItems.length
      },
      message: "SUPER SEEDING BERHASIL! 10 Akun Mahasiswa/Admin, 25 Barang Temuan, dan 10 Barang Hilang telah sukses dipompa ke database Anda."
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown seeding error"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
