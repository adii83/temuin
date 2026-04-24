# TEMUIN — Sistem Lost & Found Kampus

> **Mata Kuliah:** Rekayasa Kebutuhan  
> **Nama:** Slamet Hariyadi  
> **NIM:** 202310370311221  
> **Kelas:** Rekayasa Kebutuhan B  
> **Daily Project:** 7 — Pengujian Aplikasi

---

## 🙏🏻 Catatan Awal

Laporan ini merupakan dokumentasi pengujian aplikasi yang disusun sebagai bagian dari tugas Daily Project 7 mata kuliah Rekayasa Kebutuhan.

Saya ingin menyampaikan permohonan maaf yang sebesar-besarnya karena saya terlambat dalam mengerjakan **Remidi Daily Project 6** yang sebelumnya kurang UC Deskription dan belum sempat melakukan pengumpulan melalui Google Classroom, karena batas waktu pengumpulan telah terlewati 🙏🏻🙏🏻. Oleh karena itu, sebagai bentuk tanggung jawab, saya menyertakan dokumen hasil remidi tersebut secara langsung di dalam repository ini dengan nama file `Remidi-Daily-Project-6_SlametHariyadi-202310370311221-RekayasaKebutuhan_B.pdf`.

Dokumen remidi tersebut kemudian saya gunakan sebagai acuan utama dalam menyusun aspek kualitas dan skenario pengujian aplikasi pada Daily Project 7 ini.

---

## 📋 Deskripsi Proyek

**TEMUIN** adalah sistem informasi berbasis web yang dirancang khusus untuk mengelola proses pelaporan, verifikasi, dan serah terima barang hilang dan barang temuan di lingkungan kampus. Sistem ini mempertemukan tiga aktor utama dalam satu alur yang terstruktur, formal, dan mudah dioperasikan.

### Aktor Sistem

| Aktor       | Peran            | Deskripsi                                                                                                                  |
| ----------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Pelapor** | Pengguna         | Mahasiswa yang melaporkan kehilangan barang dan dapat mengajukan klaim atas barang temuan yang diduga miliknya.            |
| **Penemu**  | Pengguna         | Mahasiswa yang melaporkan barang yang ditemukan dan menyerahkan barang sesuai prosedur sistem.                             |
| **Admin**   | Pengelola Sistem | Pihak kampus yang memverifikasi laporan, memverifikasi klaim, memperbarui status, dan mengatur proses serah terima barang. |

---

## 🛠️ Teknologi yang Digunakan

| Komponen        | Teknologi                               |
| --------------- | --------------------------------------- |
| **Framework**   | Next.js 16.2.4 (App Router)             |
| **Bahasa**      | TypeScript                              |
| **UI Styling**  | Tailwind CSS v4                         |
| **Database**    | Supabase (PostgreSQL)                   |
| **Storage**     | Supabase Storage (`item-images` bucket) |
| **Autentikasi** | Supabase Auth + Cookie-based Session    |
| **Runtime**     | React 19                                |

---

## 🗂️ Struktur Fitur Aplikasi

```
src/app/
├── page.tsx                    # Landing page (publik)
├── login/                      # Halaman login pengguna
├── register/                   # Halaman pendaftaran akun
├── barang-temuan/              # Katalog barang temuan (UC-04, UC-05)
├── lapor-kehilangan/           # Form lapor barang hilang (UC-02)
├── lapor-temuan/               # Form lapor barang temuan (UC-03)
├── verifikasi-kepemilikan/     # Form klaim kepemilikan (UC-06)
├── status/                     # Lacak status laporan
├── profil/                     # Profil pengguna
└── admin/
    ├── dashboard/              # Dashboard admin
    ├── laporan-temuan/         # Kelola laporan temuan (UC-08, UC-10)
    ├── laporan-kehilangan/     # Kelola laporan kehilangan (UC-10)
    ├── verifikasi-kepemilikan/ # Verifikasi klaim (UC-09)
    ├── antrian/                # Antrian serah terima (UC-07)
    ├── pengguna/               # Manajemen pengguna
    └── login/                  # Login admin (terpisah)
```

---

## 🧪 Hasil Pengujian Aplikasi

Pengujian dilakukan berdasarkan **10 Use Case Utama** dan **3 Use Case Pendukung** yang telah didefinisikan dalam dokumen Remidi Daily Project 6.

### Use Case Utama

#### UC-01 — Registrasi / Login

| ID Uji   | Skenario Pengujian                           | Input                                                  | Expected Output                                | Hasil                                    | Status  |
| -------- | -------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------- | ------- |
| TC-01-01 | Registrasi akun baru dengan data lengkap     | Nama: "Slamet H", Email: valid, Password: ≥ 6 karakter | Akun tersimpan, diarahkan ke halaman utama     | Akun berhasil dibuat dan sesi aktif      | ✅ PASS |
| TC-01-02 | Registrasi dengan email yang sudah terdaftar | Email yang sudah digunakan                             | Sistem menampilkan pesan error duplikasi email | Muncul pesan "Email sudah terdaftar"     | ✅ PASS |
| TC-01-03 | Registrasi dengan data tidak lengkap         | Nama kosong / email kosong                             | Sistem meminta melengkapi form                 | Validasi form aktif, tidak bisa submit   | ✅ PASS |
| TC-01-04 | Login dengan email & password benar          | Email dan password valid                               | Masuk ke halaman utama pengguna                | Berhasil login, navbar menampilkan nama  | ✅ PASS |
| TC-01-05 | Login dengan password salah                  | Email benar, password salah                            | Sistem menolak login dengan pesan error        | Muncul pesan "Email atau password salah" | ✅ PASS |
| TC-01-06 | Login sebagai Admin (portal terpisah)        | Email & password admin                                 | Diarahkan ke dashboard admin                   | Dashboard admin berhasil ditampilkan     | ✅ PASS |

---

#### UC-02 — Lapor Barang Hilang

| ID Uji   | Skenario Pengujian                                               | Input                                                     | Expected Output                                   | Hasil                                    | Status  |
| -------- | ---------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------- | ------- |
| TC-02-01 | Mengisi dan mengirim form laporan kehilangan dengan data lengkap | Nama barang, kategori, tanggal, lokasi, ciri-ciri, kontak | Laporan tersimpan dengan status "Mencari"         | Data laporan berhasil masuk ke database  | ✅ PASS |
| TC-02-02 | Mengirim form tanpa mengisi kolom wajib                          | Field nama barang dikosongkan                             | Sistem menolak submit, minta melengkapi           | Validasi HTML `required` aktif           | ✅ PASS |
| TC-02-03 | Upload foto bukti pendukung (opsional)                           | 1–3 file gambar dari laptop                               | Foto terupload ke Supabase Storage                | URL foto tersimpan di kolom `image_urls` | ✅ PASS |
| TC-02-04 | Verifikasi laporan tersimpan di sisi Admin                       | —                                                         | Laporan muncul di menu Admin > Laporan Kehilangan | Data langsung muncul tanpa reload manual | ✅ PASS |

---

#### UC-03 — Lapor Barang Temuan

| ID Uji   | Skenario Pengujian                                           | Input                                                                    | Expected Output                                   | Hasil                                            | Status  |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------ | ------- |
| TC-03-01 | Mengisi dan mengirim form laporan temuan dengan data lengkap | Nama barang, kategori, tanggal temuan, lokasi, ciri-ciri, minimal 3 foto | Laporan tersimpan dengan status "Menunggu"        | Data berhasil masuk ke database dengan foto      | ✅ PASS |
| TC-03-02 | Mengirim laporan dengan foto kurang dari 3                   | Hanya 1 atau 2 foto dipilih                                              | Sistem menolak submit dan tampilkan pesan error   | Muncul pesan "Mohon unggah minimal 3 bukti foto" | ✅ PASS |
| TC-03-03 | Popup instruksi muncul setelah laporan berhasil dikirim      | Form terisi lengkap, submit berhasil                                     | Muncul popup: "Segera serahkan ke GKB 1 Lantai 3" | Popup muncul dengan informasi lokasi penyerahan  | ✅ PASS |
| TC-03-04 | Foto benar-benar terupload ke storage (bukan dummy URL)      | File gambar dari laptop                                                  | URL publik Supabase Storage tersimpan             | URL berupa `supabase.co/storage` terkonfirmasi   | ✅ PASS |

---

#### UC-04 — Cari Laporan

| ID Uji   | Skenario Pengujian                                 | Input                        | Expected Output                                   | Hasil                                       | Status  |
| -------- | -------------------------------------------------- | ---------------------------- | ------------------------------------------------- | ------------------------------------------- | ------- |
| TC-04-01 | Mencari barang berdasarkan kata kunci nama barang  | Keyword: "Laptop"            | Daftar barang yang mengandung kata "Laptop"       | Hasil pencarian muncul dan relevan          | ✅ PASS |
| TC-04-02 | Filter barang berdasarkan kategori                 | Pilih kategori: "Elektronik" | Hanya barang kategori Elektronik yang ditampilkan | Filter berjalan dengan benar                | ✅ PASS |
| TC-04-03 | Pencarian dengan kata kunci yang tidak ada datanya | Keyword: "xyznomatch123"     | Pesan "Tidak ada barang ditemukan"                | Tampil state kosong dengan pesan informatif | ✅ PASS |

---

#### UC-05 — Lihat Detail Laporan

| ID Uji   | Skenario Pengujian                            | Input                              | Expected Output                                                                    | Hasil                                         | Status  |
| -------- | --------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| TC-05-01 | Klik salah satu card barang temuan di katalog | Klik card "Laptop Asus"            | Modal detail terbuka dengan info lengkap (nama, kategori, lokasi, foto, ciri-ciri) | Modal berhasil tampil dengan data yang sesuai | ✅ PASS |
| TC-05-02 | Navigasi antar foto di dalam modal detail     | Klik tombol next/prev foto         | Foto berpindah sesuai urutan                                                       | Carousel foto berjalan dengan benar           | ✅ PASS |
| TC-05-03 | Menutup modal detail                          | Klik tombol ✕ atau area luar modal | Modal tertutup dan kembali ke halaman katalog                                      | Modal tertutup tanpa error                    | ✅ PASS |

---

#### UC-06 — Ajukan Klaim

| ID Uji   | Skenario Pengujian                                                     | Input                                                            | Expected Output                                  | Hasil                                                              | Status  |
| -------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------ | ------- |
| TC-06-01 | Mengisi dan mengirim form klaim kepemilikan dengan data lengkap        | Nama, deskripsi kepemilikan, foto bukti                          | Klaim tersimpan di database, status "Menunggu"   | Data klaim berhasil masuk                                          | ✅ PASS |
| TC-06-02 | Mengajukan klaim tanpa melampirkan foto bukti                          | Form diisi tapi tanpa foto                                       | Sistem menolak submit                            | Validasi `required` file aktif                                     | ✅ PASS |
| TC-06-03 | Mencoba mengajukan klaim duplikat (klaim kedua untuk barang yang sama) | Submit klaim untuk barang yang sudah diklaim oleh user yang sama | Sistem mencegah duplikasi                        | Muncul pesan "Anda sudah pernah mengajukan klaim untuk barang ini" | ✅ PASS |
| TC-06-04 | Foto bukti kepemilikan berhasil terupload                              | File gambar dari laptop                                          | URL publik tersimpan di kolom `proof_image_urls` | URL Supabase Storage terkonfirmasi di database                     | ✅ PASS |

---

#### UC-07 — Serahkan Barang

| ID Uji   | Skenario Pengujian                            | Input                                  | Expected Output                               | Hasil                                       | Status  |
| -------- | --------------------------------------------- | -------------------------------------- | --------------------------------------------- | ------------------------------------------- | ------- |
| TC-07-01 | Admin membuka halaman antrian penyerahan      | Login sebagai Admin, buka menu Antrian | Daftar klaim yang siap diserahkan ditampilkan | Halaman antrian memuat data dengan benar    | ✅ PASS |
| TC-07-02 | Admin mengubah status klaim menjadi "Selesai" | Pilih klaim, ubah status ke "Selesai"  | Status klaim diperbarui di database           | Perubahan status tersimpan dan tampil di UI | ✅ PASS |

---

#### UC-08 — Verifikasi Laporan

| ID Uji   | Skenario Pengujian                                    | Input                                  | Expected Output                                  | Hasil                                               | Status  |
| -------- | ----------------------------------------------------- | -------------------------------------- | ------------------------------------------------ | --------------------------------------------------- | ------- |
| TC-08-01 | Admin melihat daftar laporan temuan yang masuk        | Login Admin, buka Laporan Temuan       | Semua laporan dari user ditampilkan beserta foto | Laporan tampil dengan foto dari Supabase Storage    | ✅ PASS |
| TC-08-02 | Admin mengubah status laporan temuan menjadi "Tayang" | Pilih laporan, ubah status ke "Tayang" | Barang muncul di katalog publik                  | Barang langsung tampil di halaman Barang Temuan     | ✅ PASS |
| TC-08-03 | Admin menolak laporan temuan (status "Ditolak")       | Ubah status ke "Ditolak"               | Status laporan berubah, tidak tayang di katalog  | Perubahan tersimpan, barang tidak tampil di katalog | ✅ PASS |
| TC-08-04 | Admin melihat detail laporan kehilangan dan foto      | Buka detail laporan kehilangan         | Modal detail memuat info & foto pelapor          | Foto bukti kehilangan tampil di modal admin         | ✅ PASS |

---

#### UC-09 — Verifikasi Klaim

| ID Uji   | Skenario Pengujian                                     | Input                                         | Expected Output                            | Hasil                                         | Status  |
| -------- | ------------------------------------------------------ | --------------------------------------------- | ------------------------------------------ | --------------------------------------------- | ------- |
| TC-09-01 | Admin melihat daftar pengajuan klaim yang masuk        | Login Admin, buka menu Verifikasi Kepemilikan | Semua klaim beserta foto bukti ditampilkan | Data klaim dan foto bukti muncul dengan benar | ✅ PASS |
| TC-09-02 | Admin menyetujui klaim (ubah status ke "Siap Diambil") | Pilih klaim, ubah status                      | Status klaim berubah ke "Siap Diambil"     | Perubahan status tersimpan di database        | ✅ PASS |
| TC-09-03 | Admin menolak klaim (ubah status ke "Ditolak")         | Pilih klaim, ubah status ke "Ditolak"         | Status klaim berubah ke "Ditolak"          | Perubahan tersimpan, status terupdate di UI   | ✅ PASS |

---

#### UC-10 — Ubah Status Laporan

| ID Uji   | Skenario Pengujian                                     | Input                                        | Expected Output                       | Hasil                                             | Status  |
| -------- | ------------------------------------------------------ | -------------------------------------------- | ------------------------------------- | ------------------------------------------------- | ------- |
| TC-10-01 | Admin mengubah status laporan kehilangan               | Pilih status baru dari dropdown              | Status laporan berubah dan tersimpan  | Perubahan berhasil, status tampil di tabel        | ✅ PASS |
| TC-10-02 | Admin mengubah status laporan temuan                   | Pilih status baru (misal: "Barang Diterima") | Status laporan diperbarui di database | Perubahan berhasil, data sinkron di UI            | ✅ PASS |
| TC-10-03 | Status laporan terefleksi di halaman lacak status user | User buka halaman Status dengan ID laporan   | Status terbaru laporan ditampilkan    | Halaman status menampilkan data real-time dari DB | ✅ PASS |

---

### Use Case Pendukung (Include)

#### UC-I1 — Isi Detail Barang

| ID Uji   | Skenario Pengujian                                                             | Expected Output                                   | Status  |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ------- |
| TCI-1-01 | Form laporan memiliki field: nama barang, kategori, ciri-ciri, lokasi, tanggal | Semua field tersedia dan bisa diisi               | ✅ PASS |
| TCI-1-02 | Validasi field wajib berjalan saat form disubmit kosong                        | Sistem menolak submit dan menampilkan pesan error | ✅ PASS |

#### UC-I2 — Unggah Foto

| ID Uji   | Skenario Pengujian                                               | Expected Output                                     | Status  |
| -------- | ---------------------------------------------------------------- | --------------------------------------------------- | ------- |
| TCI-2-01 | Pengguna dapat memilih file gambar dari laptop (bukan input URL) | File picker terbuka, file berhasil dipilih          | ✅ PASS |
| TCI-2-02 | Indikator jumlah foto terpilih muncul setelah memilih file       | Muncul teks "N foto dipilih — akan diupload..."     | ✅ PASS |
| TCI-2-03 | Foto terupload ke Supabase Storage dan URL tersimpan di database | URL publik Supabase tersimpan di kolom `image_urls` | ✅ PASS |

#### UC-I3 — Unggah Bukti Kepemilikan

| ID Uji   | Skenario Pengujian                                                  | Expected Output                             | Status  |
| -------- | ------------------------------------------------------------------- | ------------------------------------------- | ------- |
| TCI-3-01 | Form klaim memiliki field upload bukti kepemilikan                  | Input file tersedia di form klaim           | ✅ PASS |
| TCI-3-02 | Foto bukti terupload ke Storage dan URL tersimpan                   | URL tersimpan di kolom `proof_image_urls`   | ✅ PASS |
| TCI-3-03 | Admin dapat melihat foto bukti kepemilikan saat memverifikasi klaim | Foto bukti tampil di modal verifikasi admin | ✅ PASS |

---

## 📊 Ringkasan Hasil Pengujian

| Kategori                 | Total Test Case | PASS   | FAIL  | Persentase Keberhasilan |
| ------------------------ | --------------- | ------ | ----- | ----------------------- |
| UC-01 Registrasi/Login   | 6               | 6      | 0     | 100%                    |
| UC-02 Lapor Kehilangan   | 4               | 4      | 0     | 100%                    |
| UC-03 Lapor Temuan       | 4               | 4      | 0     | 100%                    |
| UC-04 Cari Laporan       | 3               | 3      | 0     | 100%                    |
| UC-05 Lihat Detail       | 3               | 3      | 0     | 100%                    |
| UC-06 Ajukan Klaim       | 4               | 4      | 0     | 100%                    |
| UC-07 Serahkan Barang    | 2               | 2      | 0     | 100%                    |
| UC-08 Verifikasi Laporan | 4               | 4      | 0     | 100%                    |
| UC-09 Verifikasi Klaim   | 3               | 3      | 0     | 100%                    |
| UC-10 Ubah Status        | 3               | 3      | 0     | 100%                    |
| UC-I1 Isi Detail         | 2               | 2      | 0     | 100%                    |
| UC-I2 Unggah Foto        | 3               | 3      | 0     | 100%                    |
| UC-I3 Unggah Bukti       | 3               | 3      | 0     | 100%                    |
| **TOTAL**                | **44**          | **44** | **0** | **100%**                |

---

## 🏗️ Cara Menjalankan Proyek

### Prasyarat

- Node.js ≥ 18
- Akun Supabase (untuk database dan storage)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/adii83/temuin.git
cd temuin

# 2. Install dependencies
npm install

# 3. Buat file environment
# Salin dan isi variabel berikut di file .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Akun Demo

| Role  | Email                              | Password |
| ----- | ---------------------------------- | -------- |
| Admin | Atur melalui Supabase Auth         | —        |
| User  | Daftar melalui halaman `/register` | —        |

---

## 🌐 Akses & Panduan Penggunaan

Aplikasi sudah di-hosting dan dapat diakses di: **[https://temuin-nu.vercel.app](https://temuin-nu.vercel.app)**

Untuk panduan lengkap cara login, daftar, dan penggunaan semua fitur, lihat file **[PANDUAN.md](./PANDUAN.md)**.

---

_© 2026 TEMUIN — Sistem Lost & Found Kampus | Rekayasa Kebutuhan B_
