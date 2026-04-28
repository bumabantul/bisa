// GANTI DENGAN URL APPS SCRIPT ANDA
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6wkIDjoQd7LLHYBR3MjSz_mF2Yb1mxh9L7AI61-TRkM3DbLgtmfmUSRLjFi05NAEN0Q/exec';

/**
 * Memanggil API Apps Script menggunakan JSONP (untuk data kecil, backward compatibility)
 * @param {string} path - Nama action (login, register, dll)
 * @param {object} data - Data yang dikirim
 * @returns {Promise} - Promise dengan response
 */
function apiCall(path, data) {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_cb_' + Math.round(100000 * Math.random());
    window[callbackName] = function(response) {
      try {
        delete window[callbackName];
        document.body.removeChild(script);
        resolve(response);
      } catch (e) {
        reject(e);
      }
    };

    const params = new URLSearchParams();
    params.set('path', path);
    params.set('data', JSON.stringify(data));
    params.set('callback', callbackName);

    const script = document.createElement('script');
    script.src = APPS_SCRIPT_URL + '?' + params.toString();
    script.onerror = function() {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(new Error('JSONP request failed'));
    };
    document.body.appendChild(script);
  });
}

/**
 * Mengirim data dengan POST request ke Apps Script (untuk data besar seperti base64 gambar)
 * TIDAK menyertakan header Content-Type agar tidak memicu preflight CORS.
 * @param {string} path - Nama action
 * @param {object} data - Data yang dikirim
 * @returns {Promise} - Promise dengan response JSON
 */
function apiCallPost(path, data) {
  return fetch(APPS_SCRIPT_URL + '?path=' + encodeURIComponent(path), {
    method: 'POST',
    mode: 'cors',
    // Tidak ada header Content-Type -> browser mengirim text/plain (simple request)
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .catch(err => {
    console.error('POST request failed', err);
    throw err;
  });
}