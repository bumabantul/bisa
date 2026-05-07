// ======================== KONFIGURASI ========================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQ59kh_EPZSgIk_zB6EmtvMth8qLL3PKwZGXehDIxh2xV7Mw6rbqus9e8l-OoDPwtQtw/exec';

// ======================== STORAGE UNIVERSAL ========================
const appStorage = {
  _prefix: 'buma_',
  _expiryMs: 24 * 60 * 60 * 1000, // 24 jam

  _getRaw(key) {
    try { return localStorage.getItem(this._prefix + key); } catch (e) { return null; }
  },
  _setRaw(key, value) {
    try { localStorage.setItem(this._prefix + key, value); } catch (e) {}
  },
  _removeRaw(key) {
    try { localStorage.removeItem(this._prefix + key); } catch (e) {}
  },

  set(key, value) {
    const now = Date.now();
    const data = JSON.stringify({ v: value, e: now + this._expiryMs });
    this._setRaw(key, data);
    document.cookie = `${this._prefix}${key}=${encodeURIComponent(value)};path=/;max-age=${this._expiryMs / 1000};SameSite=Lax`;
  },

  get(key) {
    const raw = this._getRaw(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.e && parsed.e > Date.now()) {
          return parsed.v;
        } else {
          this._removeRaw(key);
        }
      } catch (e) {}
    }
    const match = document.cookie.match(new RegExp('(?:^|; )' + this._prefix + key + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  },

  remove(key) {
    this._removeRaw(key);
    document.cookie = `${this._prefix}${key}=;path=/;max-age=0`;
  },

  clear() {
    ['token', 'role', 'nama', 'userId', 'sidebarMini'].forEach(k => this.remove(k));
  }
};

// ======================== API RESPONSE CACHE 30 DETIK ========================
const responseCache = {};
const CACHE_TTL = 30000; // 30 detik

async function apiCall(path, data = {}, retries = 2) {
  const cacheKey = path + JSON.stringify(data);
  const cached = responseCache[cacheKey];
  if (cached && (Date.now() - cached.time) < CACHE_TTL) {
    return cached.data;
  }

  const url = `${APPS_SCRIPT_URL}?path=${encodeURIComponent(path)}`;
  if (!data.token) {
    const storedToken = appStorage.get('token');
    if (storedToken) data.token = storedToken;
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      responseCache[cacheKey] = { data: result, time: Date.now() };
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      if (error.name === 'AbortError') {
        if (attempt === retries) throw new Error('Koneksi lambat, coba lagi nanti.');
      } else {
        if (attempt === retries) throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
}

// ======================== HELPER GET CACHED DATA (LAPISAN) ========================
function getCachedData(sessionKey, appKey, fallbackProp) {
  try {
    const sess = sessionStorage.getItem(sessionKey);
    if (sess) return JSON.parse(sess);
  } catch (e) {}
  if (typeof appStorage !== 'undefined') {
    try {
      const raw = appStorage.get(appKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.data ? parsed.data : parsed;
      }
    } catch (e) {}
  }
  if (window.top && window.top._fallbackCache && window.top._fallbackCache[fallbackProp]) {
    return window.top._fallbackCache[fallbackProp];
  }
  return null;
}

// ======================== FUNGSI-FUNGSI API ========================
function loginUser(email, password) {
  return apiCall('login', { email, password });
}
function registerUser(nama, email, password, phone) {
  return apiCall('register', { nama, email, password, phone });
}
function logoutUser(token) {
  return apiCall('logout', { token });
}

// SelfRecover (tanpa email)
function getSecurityQuestion(email) {
  return apiCall('getSecurityQuestion', { email });
}
function verifySecurityAnswer(email, answer) {
  return apiCall('verifySecurityAnswer', { email, answer });
}
function resetPasswordWithToken(resetToken, newPassword) {
  return apiCall('resetPasswordWithToken', { resetToken, newPassword });
}

function getDataUsaha(token) {
  return apiCall('getDataUsaha', { token });
}
function getDataUsahaById(token, id) {
  return apiCall('getDataUsahaById', { token, id });
}
function addDataUsaha(token, usahaData) {
  return apiCall('addDataUsaha', { token, ...usahaData });
}
function addDataUsahaGuest(usahaData) {
  return apiCall('addDataUsahaGuest', usahaData);
}
function updateDataUsaha(token, usahaData) {
  return apiCall('updateDataUsaha', { token, ...usahaData });
}
function deleteDataUsaha(token, id) {
  return apiCall('deleteDataUsaha', { token, id });
}
function getAllDataUsahaPublik() {
  return apiCall('getAllDataUsahaPublik', {});
}

function getUsers(token) {
  return apiCall('getUsers', { token });
}
function updateUserRole(token, userId, newRole) {
  return apiCall('updateUserRole', { token, userId, newRole });
}
function deleteUser(token, userId) {
  return apiCall('deleteUser', { token, userId });
}
function approveUser(token, userId) {
  return apiCall('approveUser', { token, userId });
}
function rejectUser(token, userId) {
  return apiCall('rejectUser', { token, userId });
}
function getMemberCount() {
  return apiCall('getMemberCount', {});
}

function getAllArtikelPublik() {
  return apiCall('getAllArtikelPublik', {});
}
function getAllArtikelAdmin(token) {
  return apiCall('getAllArtikel', { token });
}
function getArtikelById(id) {
  return apiCall('getArtikelById', { id });
}
function addArtikel(token, title, content, imageUrl = '') {
  return apiCall('addArtikel', { token, title, content, imageUrl });
}
function updateArtikel(token, id, title, content, imageUrl = '') {
  return apiCall('updateArtikel', { token, id, title, content, imageUrl });
}
function deleteArtikel(token, id) {
  return apiCall('deleteArtikel', { token, id });
}

function simpanPesan(nama, email, pesan) {
  return apiCall('simpanPesan', { nama, email, pesan });
}

function changePassword(token, oldPassword, newPassword) {
  return apiCall('changePassword', { token, oldPassword, newPassword });
}
function backupData(token) {
  return apiCall('backupData', { token });
}
function resetData(token) {
  return apiCall('resetData', { token });
}
function getSettings(token) {
  return apiCall('getSettings', { token });
}
function updateSettings(token, settings) {
  return apiCall('updateSettings', { token, settings });
}
function uploadImage(token, base64Image, fileName = 'image.png') {
  return apiCall('uploadImage', { token, image: base64Image, name: fileName, mimeType: 'image/png' });
}

// ======================== EKSPOR GLOBAL ========================
window.apiCall = apiCall;
window.appStorage = appStorage;
window.getCachedData = getCachedData;

window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.getSecurityQuestion = getSecurityQuestion;
window.verifySecurityAnswer = verifySecurityAnswer;
window.resetPasswordWithToken = resetPasswordWithToken;

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
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.getMemberCount = getMemberCount;

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
window.uploadImage = uploadImage;