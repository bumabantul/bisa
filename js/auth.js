// auth.js - Fungsi autentikasi untuk website BUMA

/**
 * Mengecek apakah user sudah login dan memiliki role yang sesuai.
 * Jika tidak, redirect ke halaman login atau dashboard yang sesuai.
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
 * Fungsi ini harus dipanggil di setiap halaman yang memiliki elemen:
 * - #userDropdown (li dengan class dropdown)
 * - #userName (span di dalam dropdown toggle)
 * - #dashboardLink (a di dalam dropdown menu)
 * - #loginLink (li untuk link login)
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
    if (userDropdown) {
      userDropdown.style.display = 'list-item';
    }
    if (userNameSpan) {
      userNameSpan.innerText = nama || 'User';
    }
    if (dashboardLink) {
      if (role === 'admin') {
        dashboardLink.href = 'dashboard-admin.html';
      } else if (role === 'member') {
        dashboardLink.href = 'dashboard-member.html';
      }
    }
    if (loginLink) {
      loginLink.style.display = 'none';
    }
  } else {
    // User belum login
    if (userDropdown) {
      userDropdown.style.display = 'none';
    }
    if (loginLink) {
      loginLink.style.display = 'list-item';
    }
  }
}

/**
 * Melakukan logout: panggil API logout, hapus session, redirect ke beranda.
 */
async function logout() {
  const token = sessionStorage.getItem('token');
  if (token) {
    try {
      // Panggil API logout (opsional)
      await apiCall('logout', { token });
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
  sessionStorage.clear();
  window.location.href = 'index.html';
}