// ======================== KONFIGURASI ========================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoddbppvHjQXnMypZXzJQBVGUDbRuClZvWtGlelwGn_hgHRTweVzsnfMIcIKezN90j/exec';

/**
 * Pengecekan ketersediaan sessionStorage (untuk peringatan dini)
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Peringatan global jika storage diblokir (hanya sekali)
if (!isStorageAvailable()) {
  alert(
    'Browser Anda memblokir penyimpanan sesi (sessionStorage).\n' +
    'Fitur login tidak akan berfungsi. Silakan nonaktifkan "Prevent cross-site tracking" atau gunakan mode browsing normal.'
  );
}

// ======================== FUNGSI API UTAMA (FETCH POST) ========================
async function apiCall(path, data = {}) {
  const url = `${APPS_SCRIPT_URL}?path=${encodeURIComponent(path)}`;
  // Sertakan token secara otomatis jika ada
  if (!data.token && sessionStorage.getItem('token')) {
    data.token = sessionStorage.getItem('token');
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' }, // Tidak memicu preflight CORS
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API call error [${path}]:`, error);
    throw new Error(`Gagal terhubung ke server (${path}). Periksa koneksi Anda.`);
  }
}

// Alias untuk kompatibilitas (misalnya dipanggil dengan nama apiCallPost)
const apiCallPost = apiCall;

// ======================== FUNGSI KHUSUS UNTUK UPLOAD GAMBAR ========================
async function uploadImage(token, base64Image, fileName = 'image.png') {
  return apiCall('uploadImage', { token, image: base64Image, name: fileName, mimeType: 'image/png' });
}

// ======================== AUTHENTIKASI ========================
async function loginUser(email, password) {
  return apiCall('login', { email, password });
}
async function registerUser(nama, email, password) {
  return apiCall('register', { nama, email, password });
}
async function logoutUser(token) {
  return apiCall('logout', { token });
}

// ======================== CRUD USAHA ========================
async function getDataUsaha(token) {
  return apiCall('getDataUsaha', { token });
}
async function getDataUsahaById(token, id) {
  return apiCall('getDataUsahaById', { token, id });
}
async function addDataUsaha(token, usahaData) {
  return apiCall('addDataUsaha', { token, ...usahaData });
}
async function addDataUsahaGuest(usahaData) {
  return apiCall('addDataUsahaGuest', usahaData);
}
async function updateDataUsaha(token, usahaData) {
  return apiCall('updateDataUsaha', { token, ...usahaData });
}
async function deleteDataUsaha(token, id) {
  return apiCall('deleteDataUsaha', { token, id });
}
async function getAllDataUsahaPublik() {
  return apiCall('getAllDataUsahaPublik', {});
}

// ======================== MANAJEMEN PENGGUNA (ADMIN) ========================
async function getUsers(token) {
  return apiCall('getUsers', { token });
}
async function updateUserRole(token, userId, newRole) {
  return apiCall('updateUserRole', { token, userId, newRole });
}
async function deleteUser(token, userId) {
  return apiCall('deleteUser', { token, userId });
}

// ======================== ARTIKEL ========================
async function getAllArtikelPublik() {
  return apiCall('getAllArtikelPublik', {});
}
async function getAllArtikelAdmin(token) {
  return apiCall('getAllArtikel', { token });
}
async function getArtikelById(id) {
  return apiCall('getArtikelById', { id });
}
async function addArtikel(token, title, content, imageUrl = '') {
  return apiCall('addArtikel', { token, title, content, imageUrl });
}
async function updateArtikel(token, id, title, content, imageUrl = '') {
  return apiCall('updateArtikel', { token, id, title, content, imageUrl });
}
async function deleteArtikel(token, id) {
  return apiCall('deleteArtikel', { token, id });
}

// ======================== KONTAK ========================
async function simpanPesan(nama, email, pesan) {
  return apiCall('simpanPesan', { nama, email, pesan });
}

// ======================== PENGATURAN & UTILITY ========================
async function changePassword(token, oldPassword, newPassword) {
  return apiCall('changePassword', { token, oldPassword, newPassword });
}
async function backupData(token) {
  return apiCall('backupData', { token });
}
async function resetData(token) {
  return apiCall('resetData', { token });
}
async function getSettings(token) {
  return apiCall('getSettings', { token });
}
async function updateSettings(token, settings) {
  return apiCall('updateSettings', { token, settings });
}

// ======================== EKSPOR KE GLOBAL ========================
window.apiCall = apiCall;
window.apiCallPost = apiCallPost; // Tambahkan alias
window.uploadImage = uploadImage;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.getDataUsaha = getDataUsaha;
window.getDataUsahaById = getDataUsahaById;
window.addDataUsaha = addDataUsaha;
window.addDataUsahaGuest = addDataUsahaGuest;
window.updateDataUsaha = updateDataUsaha;
window.deleteDataUsaha = deleteDataUsaha;
window.getAllDataUsahaPublik = getAllDataUsahaPublik;
window.getUsers = getUsers;
window.updateUserRole = updateUserRole;
window.deleteUser = deleteUser;
window.getAllArtikelPublik = getAllArtikelPublik;
window.getAllArtikelAdmin = getAllArtikelAdmin;
window.getArtikelById = getArtikelById;
window.addArtikel = addArtikel;
window.updateArtikel = updateArtikel;
window.deleteArtikel = deleteArtikel;
window.simpanPesan = simpanPesan;
window.changePassword = changePassword;
window.backupData = backupData;
window.resetData = resetData;
window.getSettings = getSettings;
window.updateSettings = updateSettings;