# BUMA Web - Badan Usaha Milik Ansor Kabupaten Bantul

Sistem pendataan usaha anggota Ansor se-Kabupaten Bantul. Dibangun dengan Bootstrap 5 dan Google Apps Script sebagai backend.

## Fitur
- Halaman depan dengan popup FAQ
- Login multi-level (admin & member)
- Dashboard admin: data anggota, peta sebaran (Leaflet), manajemen pengguna, pengaturan
- Dashboard member: lihat data usaha sendiri, tambah usaha baru
- Form pendataan usaha (memerlukan login)
- Responsif dan modern

## Cara Penggunaan

### 1. Persiapan Backend (Google Apps Script)
1. Buat Google Sheets baru dengan sheet: `Users`, `DataUsaha`, `Settings`.
2. Buka Apps Script (Ekstensi > Apps Script), paste kode dari file `Code.gs` (lihat di bawah).
3. Sesuaikan sheet name jika perlu.
4. Deploy sebagai Web App (Execute as: Me, Access: Anyone).
5. Salin URL Web App.

### 2. Konfigurasi Frontend
1. Buka file `js/api.js`.
2. Ganti `APPS_SCRIPT_URL` dengan URL Web App Anda.

### 3. Hosting di GitHub Pages
1. Upload semua file ke repository GitHub.
2. Aktifkan GitHub Pages di repository.
3. Akses website via `https://username.github.io/buma-web/`.

### Akun Default (Contoh)
Isi manual di sheet `Users`:
| id | email | nama | password | role | token |
|----|-------|------|----------|------|-------|
| 1 | admin@buma.id | Admin | admin123 | admin | |
| 2 | member@buma.id | Member | member123 | member | |

**Catatan:** Password sebaiknya di-hash untuk production.

## Teknologi
- Bootstrap 5
- Leaflet.js (peta)
- Google Apps Script (backend)
- JSONP untuk komunikasi (mengatasi CORS)

## Lisensi
MIT