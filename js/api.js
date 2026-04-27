// GANTI DENGAN URL APPS SCRIPT ANDA
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEmNN0wWYnW3kUksPcg2mqA7daO3kZsL6oHUEVYYoDRV8E5gDWdipnya09eVfgaUVFCQ/exec';

/**
 * Memanggil API Apps Script menggunakan JSONP
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