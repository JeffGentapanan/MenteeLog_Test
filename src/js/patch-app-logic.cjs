const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. Add the initialization logic for Leaflet inside the render() function
const renderIndex = content.indexOf('function render(){');
if (renderIndex !== -1) {
  // Find where it sets app.innerHTML
  const innerHtmlEnd = content.indexOf(';', content.indexOf('app.innerHTML='));
  
  const leafletInitCode = `
  setTimeout(() => {
    const mapEl = document.getElementById('real-map-container');
    if (mapEl && !mapEl._leaflet_id && window.L && db.shift && db.shift.gps) {
       const lat = db.shift.gps.lat;
       const lng = db.shift.gps.lng;
       const map = L.map('real-map-container', {zoomControl: false, attributionControl: false}).setView([lat, lng], 17);
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
       const iconHtml = \`<div style="width: 16px; height: 16px; background: #059669; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 12px rgba(5,150,105,0.8);"></div>\`;
       const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [16,16], iconAnchor: [8,8] });
       L.marker([lat, lng], {icon: customIcon}).addTo(map);
    }
  }, 100);
`;

  content = content.substring(0, innerHtmlEnd + 1) + leafletInitCode + content.substring(innerHtmlEnd + 1);
}

// 2. Add the guaranteed shift reset logic at the top of app.js (after db is loaded)
const dbInitIndex = content.indexOf('let db=ensureCreatorAccounts(load())');
if (dbInitIndex !== -1) {
  const dbInitEnd = content.indexOf(';', dbInitIndex);
  const resetCode = `
try {
  if (!sessionStorage.getItem('dtr_reset_guaranteed')) {
    sessionStorage.setItem('dtr_reset_guaranteed', '1');
    if (db && db.shift) { delete db.shift; save(); }
  }
} catch(e) {}
`;
  content = content.substring(0, dbInitEnd + 1) + resetCode + content.substring(dbInitEnd + 1);
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('App.js patched with true execution logic!');
