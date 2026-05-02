# BUMA Web - Badan Usaha Milik Ansor Kabupaten Bantul

Sistem pendataan dan manajemen usaha anggota Ansor se‑Kabupaten Bantul.  
Dibangun dengan **Bootstrap 5**, **Leaflet.js**, **Quill Editor**, dan **Google Apps Script** sebagai backend, di‑hosting di GitHub Pages.

![Status](https://img.shields.io/badge/version-3.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Fitur Utama

### Halaman Depan (index.html)
- **Hero section** dengan dua tombol akses cepat:
  - **Isi Data Usaha** → `pendataan.html` (publik)
  - **Dashboard** → otomatis mengarahkan ke dashboard sesuai role jika sudah login (tanpa loading).
- **Statistik real‑time** (total usaha, kategori, anggota aktif, artikel) – diperbarui setiap 60 detik.
- **Pratinjau 3 artikel terbaru**:
  - Hanya menampilkan **thumbnail, tanggal, dan judul** – tanpa cuplikan teks.
  - Klik **Baca** membuka modal dengan konten artikel lengkap (teks dan gambar dari editor Quill tampil alami).
- **Form kontak** dengan verifikasi penjumlahan sederhana.
- **Pusat bantuan pop‑up** – pengunjung dapat langsung kirim pertanyaan ke admin via WhatsApp.
- **Prefetch data dashboard** di latar belakang saat admin login, sehingga dashboard langsung siap tanpa loading.

### Autentikasi
- **Login multi‑level** (admin & member) dengan sesi token 24 jam (`localStorage` + fallback `cookie`).
- **Registrasi member** baru → status *pending*, perlu persetujuan admin.
- Verifikasi penjumlahan sederhana saat registrasi (mencegah spam).
- **Logout global** – membersihkan semua cache dan selalu kembali ke `../index.html`.

### Dashboard Admin
- **Ringkasan Dashboard** (iframe `dashboard-admin-content.html`):
  - Kartu statistik (total usaha, kategori, anggota aktif, artikel).
  - Grafik donat distribusi kategori (Chart.js).
  - 5 usaha terbaru & 5 member pending.
  - Tombol cepat: **Tambah Usaha**, **Ekspor PDF**, **Refresh**.
- **Data Usaha Anggota** (`data-anggota.html`):
  - Tabel responsif dengan pencarian, pagination, checkbox hapus massal.
  - CRUD via modal + peta Leaflet untuk lokasi.
  - Ekspor ke CSV.
- **Peta Sebaran** (`peta-sebaran.html`):
  - Cluster marker (Leaflet.markercluster).
  - Pencarian lokasi.
- **Manajemen Pengguna** (`pengguna.html`):
  - Lihat semua user, ubah role, hapus.
  - Terima/tolak member pending.
- **Manajemen Artikel** (`artikel-admin.html`):
  - Editor **Quill.js** lengkap.
  - **Resize gambar interaktif** – admin bisa menarik sudut gambar untuk atur ukuran (modul `quill-image-resize-module`).
  - Gambar pertama otomatis jadi thumbnail (`imageUrl`).
  - Tabel artikel dengan edit/hapus.
- **Pengaturan** (`pengaturan.html`):
  - Ubah password.
  - Backup data JSON.
  - Reset semua data.
  - Ekspor ringkasan ke **PDF** (library jsPDF + autotable dimuat hanya saat tombol ditekan – on‑demand).
- **Profil Admin** (`profile-admin.html`): info akun & ubah password.

### Dashboard Member
- **Dashboard** pribadi (`dashboard-member.html`): statistik jumlah usaha & tabel data.
- **Tambah / Edit Usaha** (`data-usaha-member.html`):
  - Form lengkap + peta Leaflet + upload foto.
  - Mode edit via parameter `?edit=id`.
  - Opsi jenis usaha kustom ("Lainnya").

### Halaman Publik (Tanpa Login)
- **Pendataan Usaha** (`pendataan.html`): form + peta + upload foto.
- **Artikel** (`artikel.html`): daftar semua artikel dengan cache & modal baca.
- **Kontak** (`kontak.html`): informasi kontak & form kirim pesan.

### Optimasi Kecepatan
- **Cache berlapis** di seluruh dashboard admin:
  `sessionStorage` → `localStorage` (via `appStorage`) → `window.top._fallbackCache`.  
  Data muncul instan saat pindah menu, tanpa fetch ulang.
- **Background refresh** setiap **60 detik** (tidak lagi 30 detik).
- **Preload halaman admin** (`admin/preload.html`) – mengisi cache sebelum masuk dashboard.
- **jsPDF on‑demand** – tidak memblokir rendering awal dashboard.

---

## 🛠️ Teknologi

| Teknologi                     | Kegunaan                                     |
|-------------------------------|----------------------------------------------|
| Bootstrap 5                   | Framework CSS, komponen UI                   |
| Bootstrap Icons               | Ikon                                         |
| Leaflet.js + MarkerCluster    | Peta interaktif dan clustering marker        |
| Chart.js                      | Grafik donat di dashboard                    |
| Quill.js                      | Rich text editor untuk artikel               |
| quill-image-resize-module     | Resize gambar di editor (drag)               |
| jsPDF + autotable             | Ekspor PDF (dimuat on‑demand)                |
| Google Apps Script            | Backend API & penyimpanan di Google Sheets   |
| GitHub Pages                  | Hosting statis                               |

---

## ⚙️ Persiapan Backend (Google Apps Script)

1. Buat **Google Sheets** baru dengan sheet‑sheet berikut (nama **case‑sensitive**):
   - `Users` – kolom: `id`, `email`, `nama`, `password`, `role`, `token`, `phone`, `status`
   - `DataUsaha` – kolom: `id`, `userId`, `namaUsaha`, `pemilik`, `asalPac`, `jenisUsaha`, `alamat`, `lat`, `lng`, `telepon`, `deskripsi`, `foto`, `email`, `createdAt`
   - `Pesan` – kolom: `id`, `nama`, `email`, `pesan`, `createdAt`, `ip`
   - `Artikel` – kolom: `id`, `title`, `content`, `authorId`, `authorName`, `imageUrl`, `createdAt`
   - `Settings` – kolom: `key`, `value`

2. Buka **Extensions > Apps Script**, salin seluruh isi file **`code.gs`** yang disediakan.

3. Di editor Apps Script, buka **Project Settings** > centang **"Show 'appsscript.json' manifest file in editor"**.  
   Ganti isi `appsscript.json` dengan:

   ```json
   {
     "timeZone": "Asia/Jakarta",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "oauthScopes": [
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/drive",
       "https://www.googleapis.com/auth/script.external_request"
     ],
     "runtimeVersion": "V8"
   }