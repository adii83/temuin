# 📖 PANDUAN PENGGUNAAN — TEMUIN

> **Sistem Lost & Found Kampus**  
> 🌐 **Akses Langsung:** [https://temuin-nu.vercel.app](https://temuin-nu.vercel.app)

---

## Daftar Isi

1. [Halaman Utama (Landing Page)](#1-halaman-utama)
2. [Mendaftar Akun Baru](#2-mendaftar-akun-baru)
3. [Login sebagai Pengguna](#3-login-sebagai-pengguna)
4. [Fitur Pengguna](#4-fitur-pengguna)
   - [Katalog Barang Temuan](#41-katalog-barang-temuan)
   - [Lapor Barang Hilang](#42-lapor-barang-hilang)
   - [Lapor Barang Temuan](#43-lapor-barang-temuan)
   - [Ajukan Kepemilikan (Klaim)](#44-ajukan-kepemilikan-klaim)
   - [Lacak Status Laporan](#45-lacak-status-laporan)
   - [Profil Pengguna](#46-profil-pengguna)
5. [Login sebagai Admin](#5-login-sebagai-admin)
6. [Fitur Admin](#6-fitur-admin)
   - [Dashboard](#61-dashboard)
   - [Kelola Laporan Temuan](#62-kelola-laporan-temuan)
   - [Kelola Laporan Kehilangan](#63-kelola-laporan-kehilangan)
   - [Verifikasi Klaim Kepemilikan](#64-verifikasi-klaim-kepemilikan)
   - [Antrian Serah Terima](#65-antrian-serah-terima)
   - [Manajemen Pengguna](#66-manajemen-pengguna)

---

## 1. Halaman Utama

Buka **[https://temuin-nu.vercel.app](https://temuin-nu.vercel.app)** di browser Anda.

Halaman ini dapat diakses oleh siapa saja tanpa perlu login. Di sini Anda bisa:

- Melihat **4 barang temuan terbaru** yang sudah diverifikasi admin dan berstatus *Tayang*.
- Klik card barang untuk langsung diarahkan ke halaman **Login** dan melanjutkan proses klaim.
- Klik tombol **"Masuk ke TEMUIN"** atau **"Daftar"** di navbar untuk mengakses sistem.

---

## 2. Mendaftar Akun Baru

> URL: [https://temuin-nu.vercel.app/register](https://temuin-nu.vercel.app/register)

1. Klik tombol **"Daftar"** di navbar pojok kanan atas.
2. Isi formulir pendaftaran:
   - **Nama Lengkap**
   - **Email** (gunakan email aktif)
   - **Password** (minimal 6 karakter)
3. Klik **"Buat Akun"**.
4. Jika berhasil, Anda akan otomatis diarahkan ke halaman katalog barang temuan.

> ⚠️ **Catatan:** Setiap email hanya dapat digunakan untuk satu akun. Jika email sudah terdaftar, sistem akan menampilkan pesan error.

---

## 3. Login sebagai Pengguna

> URL: [https://temuin-nu.vercel.app/login](https://temuin-nu.vercel.app/login)

1. Klik tombol **"Login"** di navbar.
2. Masukkan **Email** dan **Password** yang sudah didaftarkan.
3. Klik **"Masuk"**.
4. Jika berhasil, Anda akan diarahkan ke halaman **Katalog Barang Temuan**.

---

## 4. Fitur Pengguna

Setelah login, Anda akan melihat navbar dengan beberapa menu navigasi.

---

### 4.1 Katalog Barang Temuan

> URL: [https://temuin-nu.vercel.app/barang-temuan](https://temuin-nu.vercel.app/barang-temuan)

Halaman ini menampilkan semua barang temuan yang sudah diverifikasi admin (status: *Tayang*).

**Cara penggunaan:**
- **Cari barang** → Ketik nama barang di kolom pencarian (misalnya: "laptop", "dompet").
- **Filter kategori** → Pilih kategori dari dropdown: Elektronik, Aksesoris, Dokumen, dll.
- **Lihat detail** → Klik card barang untuk membuka modal detail yang memuat foto, lokasi, ciri-ciri, dan tanggal temuan.
- **Ajukan klaim** → Di dalam modal detail, klik tombol **"Ajukan Kepemilikan"** jika barang tersebut milik Anda.

---

### 4.2 Lapor Barang Hilang

> URL: [https://temuin-nu.vercel.app/lapor-kehilangan](https://temuin-nu.vercel.app/lapor-kehilangan)

Gunakan menu ini jika Anda kehilangan barang di area kampus.

**Langkah-langkah:**
1. Isi **Nama Barang** (contoh: "Dompet Kulit Hitam").
2. Pilih **Kategori** dari dropdown.
3. Isi **Tanggal Kehilangan**.
4. Isi **Lokasi Terakhir** barang diketahui.
5. Isi **Ciri-ciri Barang** secara detail (warna, merek, isi, ciri khusus).
6. Isi **Nomor Kontak** yang bisa dihubungi.
7. *(Opsional)* Upload **foto referensi barang** jika ada — klik area upload dan pilih file dari laptop Anda. Bisa lebih dari 1 foto.
8. Klik **"Kirim Laporan"**.

Laporan akan masuk ke sistem admin dengan status **"Mencari (Diproses)"**.

---

### 4.3 Lapor Barang Temuan

> URL: [https://temuin-nu.vercel.app/lapor-temuan](https://temuin-nu.vercel.app/lapor-temuan)

Gunakan menu ini jika Anda menemukan barang milik orang lain di kampus.

**Langkah-langkah:**
1. Isi **Nama Barang** yang ditemukan.
2. Pilih **Kategori**.
3. Isi **Tanggal Ditemukan**.
4. Isi **Lokasi Penemuan**.
5. Isi **Ciri-ciri Barang** secara detail.
6. Isi **Nomor Kontak** Anda.
7. **Upload minimal 3 foto bukti** barang yang ditemukan → klik area upload dan pilih file dari laptop Anda.
8. Klik **"Kirim Laporan"**.

> ⚠️ **Penting:** Upload foto **minimal 3 foto** wajib. Tombol kirim tidak akan aktif jika foto kurang dari 3.

Setelah berhasil dikirim, akan muncul **popup notifikasi** yang memberitahu Anda untuk segera menyerahkan barang ke:

> 📍 **Gedung Pusat Penerimaan Barang Hilang — GKB 1, Lantai 3**

---

### 4.4 Ajukan Kepemilikan (Klaim)

> URL: [https://temuin-nu.vercel.app/verifikasi-kepemilikan](https://temuin-nu.vercel.app/verifikasi-kepemilikan)

Gunakan fitur ini untuk mengklaim barang temuan yang Anda yakini adalah milik Anda.

**Cara mengakses:**
- Dari halaman **Katalog Barang Temuan** → klik card barang → klik tombol **"Ajukan Kepemilikan"** di modal detail.
- Atau langsung akses URL di atas.

**Langkah-langkah:**
1. Pilih barang yang ingin diklaim dari daftar.
2. Isi **deskripsi bukti kepemilikan** (jelaskan mengapa barang itu milik Anda).
3. Upload **foto bukti kepemilikan** (foto struk, foto lama bersama barang, foto identitas, dll.).
4. Klik **"Kirim Pengajuan"**.

Klaim akan diverifikasi oleh admin. Anda akan mendapat notifikasi melalui update status.

> ⚠️ **Catatan:** Satu pengguna hanya bisa mengajukan satu klaim untuk satu barang yang sama. Jika sudah pernah mengajukan, sistem akan mencegah pengajuan ganda.

---

### 4.5 Lacak Status Laporan

> URL: [https://temuin-nu.vercel.app/status](https://temuin-nu.vercel.app/status)

Halaman ini menampilkan daftar semua laporan yang Anda buat beserta status terkininya.

**Status laporan kehilangan:**
| Status | Arti |
|---|---|
| Mencari (Diproses) | Laporan sedang diproses admin |
| Ditemukan (Siap Diambil) | Barang sudah ditemukan, hubungi admin |
| Selesai | Barang sudah dikembalikan |
| Ditolak | Laporan tidak valid |

**Status klaim kepemilikan:**
| Status | Arti |
|---|---|
| Menunggu | Klaim baru masuk, belum diproses |
| Diperiksa | Admin sedang memverifikasi bukti |
| Siap Diambil | Klaim disetujui, barang bisa diambil di GKB 1 Lt.3 |
| Selesai | Barang sudah diterima |
| Ditolak | Bukti kepemilikan tidak sesuai |

---

### 4.6 Profil Pengguna

> URL: [https://temuin-nu.vercel.app/profil](https://temuin-nu.vercel.app/profil)

Menampilkan informasi akun Anda (nama dan email). Tersedia juga tombol **Logout** untuk keluar dari sesi.

---

## 5. Login sebagai Admin

> ⚠️ **Portal admin terpisah dari portal pengguna biasa.**  
> URL khusus admin: **[https://temuin-nu.vercel.app/admin/login](https://temuin-nu.vercel.app/admin/login)**

**Cara login:**
1. Buka URL: `https://temuin-nu.vercel.app/admin/login`
2. Masukkan **Email** dan **Password** akun admin (diberikan oleh pengelola sistem).
3. Klik **"Masuk sebagai Admin"**.
4. Jika berhasil, Anda akan diarahkan ke **Dashboard Admin**.

> 🔒 Akun admin tidak bisa dibuat melalui halaman registrasi publik. Akun admin hanya dapat dibuat langsung melalui panel Supabase oleh pengelola sistem.

---

## 6. Fitur Admin

Setelah login sebagai admin, Anda akan melihat sidebar navigasi dengan berbagai menu pengelolaan.

---

### 6.1 Dashboard

> URL: [https://temuin-nu.vercel.app/admin/dashboard](https://temuin-nu.vercel.app/admin/dashboard)

Menampilkan ringkasan statistik sistem secara real-time:
- **Total Laporan Kehilangan** — Jumlah seluruh laporan kehilangan di database.
- **Barang Temuan Aktif** — Jumlah barang yang sedang dalam proses atau sudah tayang.
- **Klaim Selesai** — Jumlah barang yang sudah berhasil dikembalikan ke pemiliknya.

---

### 6.2 Kelola Laporan Temuan

> URL: [https://temuin-nu.vercel.app/admin/laporan-temuan](https://temuin-nu.vercel.app/admin/laporan-temuan)

**Fungsi:**
- Melihat semua laporan barang temuan yang masuk dari pengguna.
- Mencari laporan berdasarkan nama barang atau ID.
- Filter berdasarkan status laporan.
- Klik **"Detail"** pada baris laporan untuk membuka modal detail yang memuat foto dan informasi lengkap.
- Mengubah status laporan:

| Status | Arti |
|---|---|
| Menunggu | Laporan baru masuk |
| Barang Diterima | Admin sudah menerima barang fisik |
| **Tayang** | **Barang tampil di katalog publik** |
| Telah Diklaim | Ada klaim yang disetujui |
| Ditolak | Laporan tidak valid |

> ✅ **Status "Tayang"** adalah kunci agar barang muncul di halaman publik dan landing page.

---

### 6.3 Kelola Laporan Kehilangan

> URL: [https://temuin-nu.vercel.app/admin/laporan-kehilangan](https://temuin-nu.vercel.app/admin/laporan-kehilangan)

**Fungsi:**
- Melihat semua laporan kehilangan dari pengguna.
- Mencari dan filter laporan.
- Membuka detail laporan (nama pelapor, kontak, ciri barang, foto).
- Mengubah status laporan:

| Status | Arti |
|---|---|
| Mencari (Diproses) | Laporan sedang diproses |
| Ditemukan (Siap Diambil) | Barang berhasil ditemukan |
| Selesai | Barang sudah dikembalikan |
| Ditolak | Laporan tidak valid |

---

### 6.4 Verifikasi Klaim Kepemilikan

> URL: [https://temuin-nu.vercel.app/admin/verifikasi-kepemilikan](https://temuin-nu.vercel.app/admin/verifikasi-kepemilikan)

**Fungsi:**
- Melihat semua pengajuan klaim dari pengguna beserta foto bukti kepemilikan.
- Memeriksa kesesuaian bukti dengan data barang temuan.
- Mengubah status klaim:

| Status | Arti |
|---|---|
| Menunggu | Klaim baru, belum diproses |
| Diperiksa | Admin sedang memverifikasi |
| Siap Diambil | Klaim disetujui, pemilik bisa ambil barang |
| Selesai | Barang sudah diserahkan |
| Ditolak | Bukti tidak sesuai |

---

### 6.5 Antrian Serah Terima

> URL: [https://temuin-nu.vercel.app/admin/antrian](https://temuin-nu.vercel.app/admin/antrian)

Menampilkan daftar klaim yang sudah berstatus **"Siap Diambil"** — yaitu klaim yang sudah disetujui dan menunggu proses serah terima fisik di GKB 1 Lantai 3. Admin dapat memperbarui status menjadi **"Selesai"** setelah barang diserahkan kepada pemiliknya.

---

### 6.6 Manajemen Pengguna

> URL: [https://temuin-nu.vercel.app/admin/pengguna](https://temuin-nu.vercel.app/admin/pengguna)

**Fungsi:**
- Melihat daftar seluruh pengguna yang terdaftar.
- Mencari pengguna berdasarkan nama atau email.
- Mengubah status akun pengguna: **Aktif** atau **Diblokir**.

---

## 🔑 Ringkasan URL Penting

| Halaman | URL |
|---|---|
| Landing Page | https://temuin-nu.vercel.app |
| Daftar Akun | https://temuin-nu.vercel.app/register |
| Login Pengguna | https://temuin-nu.vercel.app/login |
| **Login Admin** | **https://temuin-nu.vercel.app/admin/login** |
| Katalog Barang Temuan | https://temuin-nu.vercel.app/barang-temuan |
| Lapor Kehilangan | https://temuin-nu.vercel.app/lapor-kehilangan |
| Lapor Temuan | https://temuin-nu.vercel.app/lapor-temuan |
| Ajukan Klaim | https://temuin-nu.vercel.app/verifikasi-kepemilikan |
| Lacak Status | https://temuin-nu.vercel.app/status |
| Dashboard Admin | https://temuin-nu.vercel.app/admin/dashboard |

---

*© 2026 TEMUIN — Sistem Lost & Found Kampus | Rekayasa Kebutuhan B*
