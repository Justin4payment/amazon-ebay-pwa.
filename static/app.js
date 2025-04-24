// Simulierte Funktionen
function getAmazonData(asin) {
  return { title: `Produkt für ASIN ${asin}`, price: 19.99 };
}
function listOnEbay(product, markup) {
  const price = (product.price * (1 + markup / 100)).toFixed(2);
  return { title: product.title, price, status: 'Erfolgreich gelistet' };
}

// Log in LocalStorage
function logAction(text) {
  let logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({ text, time: new Date().toISOString() });
  localStorage.setItem('logs', JSON.stringify(logs));
}

// Download log as file
function downloadLog() {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  const content = logs.map(l => `[${l.time}] ${l.text}`).join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'listing_log.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// Main
window.addEventListener('load', () => {
  const asinsEl = document.getElementById('asins');
  const markupEl = document.getElementById('markup');
  const resultsEl = document.getElementById('results');
  document.getElementById('start').onclick = () => {
    resultsEl.innerHTML = '';
    const asins = asinsEl.value.split('\n').map(a => a.trim()).filter(a => a);
    const markup = parseFloat(markupEl.value) || 0;
    asins.forEach(asin => {
      const product = getAmazonData(asin);
      const res = listOnEbay(product, markup);
      const li = document.createElement('li');
      li.textContent = `${res.title} | Preis: €${res.price} | ${res.status}`;
      resultsEl.appendChild(li);
      logAction(li.textContent);
    });
  };
  document.getElementById('download-log').onclick = downloadLog;
  
  // Service Worker registrieren
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(console.error);
  }
});