# BUMA Web - Badan Usaha Milik Ansor Kabupaten Bantul

Sistem pendataan usaha anggota Ansor se-Kabupaten Bantul. Dibangun dengan **Bootstrap 5**, **Leaflet.js**, dan **Google Apps Script** sebagai backend, di-*hosting* di GitHub Pages.

![Status](https://img.shields.io/badge/version-2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Fitur Utama

- **Halaman depan** informatif dengan statistik, artikel terbaru, formulir kontak, dan bantuan pop‑up.
- **Login multi‑level** (admin & member) dengan verifikasi sederhana saat pendaftaran.
- **Dashboard Admin**:
  - Ringkasan statistik (total usaha, kategori, anggota, artikel) dan grafik donat.
  - Manajemen data usaha (CRUD, pencarian, ekspor CSV, hapus massal).
  - Peta sebaran usaha interaktif dengan *marker cluster* dan pencarian.
  - Manajemen pengguna (ubah role, hapus).
  - Manajemen artikel.
  - Pengaturan sistem (ubah password admin, backup JSON, reset data).
- **Dashboard Member**:
  - Data usaha sendiri dalam tabel.
  - Tambah/edit usaha dengan integrasi peta **OpenStreetMap** (klik atau geser *marker*).
  - Tombol **Dapatkan Lokasi Saya** untuk mengisi koordinat secara otomatis.
- **Form pendataan usaha publik** (tanpa login):
  - Pengisian data usaha lengkap + **upload foto** (base64) yang dikirim via POST.
  - Peta interaktif untuk penentuan lokasi.
- **Halaman artikel** dan **kontak** yang responsif.
- Tema modern dengan **glassmorphism**, warna ungu/biru, dan font `Plus Jakarta Sans`.

## Teknologi

| Teknologi            | Kegunaan                                  |
|----------------------|-------------------------------------------|
| Bootstrap 5           | Framework CSS, komponen UI                |
| Bootstrap Icons       | Ikon                                     |
| Leaflet.js            | Peta interaktif (OpenStreetMap)           |
| Leaflet.markercluster | Clustering marker di peta admin           |
| Chart.js              | Grafik donat di dashboard admin           |
| Google Apps Script    | Backend API & penyimpanan di Google Sheets |
| GitHub Pages          | Hosting statis                            |

## Persiapan Backend (Google Apps Script)

1. Buat **Google Sheets** baru dengan sheet berikut (nama *case‑sensitive*):
   - `Users` – kolom: `id`, `email`, `nama`, `password`, `role`, `token`
   - `DataUsaha` – kolom: `id`, `userId`, `namaUsaha`, `pemilik`, `jenisUsaha`, `alamat`, `lat`, `lng`, `telepon`, `deskripsi`, `foto`, `email`, `createdAt`
   - `Pesan` – kolom: `id`, `nama`, `email`, `pesan`, `createdAt`, `ip`
   - `Artikel` – kolom: `id`, `title`, `content`, `authorId`, `authorName`, `imageUrl`, `createdAt`
   - `Settings` – kolom: `key`, `value`

2. Buka **Extensions > Apps Script**, lalu salin seluruh kode dari file `code.gs` yang telah disediakan.

3. Di editor Apps Script, klik **Deploy > New deployment** (atau kelola yang sudah ada). Pilih **Web App**.
   - *Execute as*: `Me`
   - *Who has access*: `Anyone` (atau sesuai kebutuhan, tetapi harus bisa diakses publik agar frontend berfungsi).
   - Klik **Deploy** dan salin URL Web App yang dihasilkan.

4. (Opsional) Spreadsheet akan otomatis diisi data contoh (admin, member, beberapa usaha) saat pertama kali diakses. Jika tidak, Anda bisa memanggil path `seedExampleData` melalui API admin.

## Konfigurasi Frontend

1. Buka file **`js/api.js`**.
2. Ubah nilai `APPS_SCRIPT_URL` dengan URL Web App yang sudah Anda dapatkan.
3. Jika diperlukan, sesuaikan juga URL di `apiCallPost` (fungsi POST untuk upload gambar) yang dipakai di `pendataan.html`.

## Cara Menjalankan

### Secara lokal
Cukup buka `index.html` di browser. Semua resource (CSS, JS) akan dimuat dari CDN. Pastikan koneksi internet aktif.

### Hosting di GitHub Pages
1. Upload semua file proyek ke repository GitHub.
2. Aktifkan GitHub Pages di pengaturan repository (pilih branch `main` atau `master`, folder root).
3. Akses website melalui `https://<username>.github.io/<repo>/`.

**Penting:** Karena Apps Script diakses secara publik, tidak diperlukan otentikasi server khusus selain yang sudah diimplementasikan di spreadsheet.

## Akun Default (Contoh)

Data di sheet `Users` otomatis dibuat oleh `ensureDataExists()`. Anda bisa langsung login dengan akun ini:

| Role   | Email            | Password     |
|--------|------------------|--------------|
| Admin  | admin@buma.id    | admin123     |
| Member | member1@buma.id  | member123    |
| Member | member2@buma.id  | member123    |
| Member | member3@buma.id  | member123    |

**Untuk keamanan, segera ubah password setelah instalasi.**

## Catatan Penting

- **Upload gambar di form publik (`pendataan.html`)** menggunakan fungsi `apiCallPost` yang mengirim data via **POST body** (tidak lagi JSONP). Hal ini diperlukan karena base64 gambar bisa sangat panjang dan tidak muat di URL GET.
- **Registrasi member** dilengkapi verifikasi sederhana (soal penjumlahan) untuk mencegah spam.
- **Backend** (`code.gs`) kini bisa membaca data dari POST body (`e.postData`) secara otomatis. Semua fungsi lama yang menggunakan GET tetap berjalan normal.
- **Cache** digunakan pada beberapa halaman (index, dashboard) untuk mempercepat loading. Data disimpan di `sessionStorage`.
- Pastikan browser mengizinkan akses **geolokasi** agar tombol "Dapatkan Lokasi Saya" berfungsi.
- Jika terjadi error *CORS* pada saat development lokal, gunakan ekstensi browser atau jalankan melalui server lokal (misal Live Server di VS Code).

## Lisensi

MIT © 2026 BUMA Bantul