// auth.js – fungsi autentikasi dan navigasi global untuk BUMA
// Bergantung pada api.js (appStorage & apiCall harus sudah tersedia)

/**
 * Mengembalikan true jika token valid dan role sesuai.
 * TIDAK melakukan redirect – biarkan pemanggil yang menentukan URL.
 * @param {string} requiredRole - 'admin' atau 'member', atau kosongkan jika hanya butuh login.
 * @returns {boolean}
 */
function checkAuth(requiredRole) {
  const token = (typeof appStorage !== 'undefined') ? appStorage.get('token') : null;
  const role = (typeof appStorage !== 'undefined') ? appStorage.get('role') : null;
  if (!token) return false;
  if (requiredRole && role !== requiredRole) return false;
  return true;
}

/**
 * Memperbarui tampilan navbar publik (index, artikel, kontak, pendataan).
 */
function updateNavbar() {
  const token = (typeof appStorage !== 'undefined') ? appStorage.get('token') : null;
  const role = (typeof appStorage !== 'undefined') ? appStorage.get('role') : null;
  const nama = (typeof appStorage !== 'undefined') ? appStorage.get('nama') : null;

  const userDropdown = document.getElementById('userDropdown');
  const userNameSpan = document.getElementById('userName');
  const dashboardLink = document.getElementById('dashboardLink');
  const loginLink = document.getElementById('loginLink');

  if (token) {
    if (userDropdown) userDropdown.style.display = 'list-item';
    if (userNameSpan) userNameSpan.textContent = nama || 'User';
    if (dashboardLink) {
      dashboardLink.href = (role === 'admin') ? 'admin/dashboard-admin.html' : 'member/dashboard-member.html';
    }
    if (loginLink) loginLink.style.display = 'none';
  } else {
    if (userDropdown) userDropdown.style.display = 'none';
    if (loginLink) loginLink.style.display = 'list-item';
  }
}

/**
 * Logout cepat – hapus data lokal, redirect langsung,
 * panggil API logout di latar belakang (fire‑and‑forget).
 */
async function logout() {
  const token = (typeof appStorage !== 'undefined') ? appStorage.get('token') : null;

  // 1. Bersihkan semua data sesi
  if (typeof appStorage !== 'undefined') appStorage.clear();

  // 2. Hapus fallback di window.top (jika ada)
  if (window._authToken) window._authToken = null;
  if (window._authRole) window._authRole = null;
  if (window._fallbackCache) window._fallbackCache = null;

  // 3. Panggil API logout tanpa menunggu (fire‑and‑forget)
  if (token) {
    apiCall('logout', { token }).catch(() => {});
  }

  // 4. Redirect segera
  window.location.href = '../index.html';
}

// Ekspor ke global scope
window.checkAuth = checkAuth;
window.updateNavbar = updateNavbar;
window.logout = logout;