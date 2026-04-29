// auth.js - Fungsi autentikasi untuk website BUMA
// Kini menggunakan apiCall (fetch POST) untuk semua operasi, termasuk logout.

/**
 * Mengecek apakah user sudah login dan memiliki role yang sesuai.
 * @param {string} requiredRole - Role yang dibutuhkan ('admin' atau 'member')
 * @returns {boolean} - true jika authorized
 */
function checkAuth(requiredRole) {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!token) {
    window.location.href = 'login.html';
    return false;
  }

  if (requiredRole && role !== requiredRole) {
    // Jika role salah, arahkan ke dashboard yang sesuai
    if (role === 'admin') {
      window.location.href = 'dashboard-admin.html';
    } else if (role === 'member') {
      window.location.href = 'dashboard-member.html';
    } else {
      window.location.href = 'login.html';
    }
    return false;
  }

  return true;
}

/**
 * Memperbarui tampilan navbar berdasarkan status login.
 */
function updateNavbar() {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const nama = sessionStorage.getItem('nama');

  const userDropdown = document.getElementById('userDropdown');
  const userNameSpan = document.getElementById('userName');
  const dashboardLink = document.getElementById('dashboardLink');
  const loginLink = document.getElementById('loginLink');

  if (token) {
    // User sudah login
    if (userDropdown) userDropdown.style.display = 'list-item';
    if (userNameSpan) userNameSpan.innerText = nama || 'User';
    if (dashboardLink) {
      dashboardLink.href = (role === 'admin') ? 'dashboard-admin.html' : 'dashboard-member.html';
    }
    if (loginLink) loginLink.style.display = 'none';
  } else {
    // User belum login
    if (userDropdown) userDropdown.style.display = 'none';
    if (loginLink) loginLink.style.display = 'list-item';
  }
}

/**
 * Melakukan logout: panggil API logout (POST), hapus session, redirect ke beranda.
 */
async function logout() {
  const token = sessionStorage.getItem('token');
  if (token) {
    try {
      // apiCall sekarang adalah fetch POST yang andal
      await apiCall('logout', { token });
    } catch (err) {
      console.error('Logout error:', err);
      // Tetap lanjutkan hapus session
    }
  }
  sessionStorage.clear();
  window.location.href = 'index.html';
}