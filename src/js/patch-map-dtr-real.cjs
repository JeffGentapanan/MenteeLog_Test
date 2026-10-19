const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = `<!-- Visual Map Frame -->
          <div style="width: 100%; height: 120px; background-image: radial-gradient(#CBD5E1 1px, transparent 1px); background-size: 12px 12px; background-color: #F2ECE4; border-radius: 8px; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
             <div style="width: 16px; height: 16px; background: #059669; border-radius: 50%; box-shadow: 0 0 0 6px rgba(5,150,105,0.2);"></div>
          </div>`;

const newStr = `<!-- Visual Map Frame -->
          <div id="real-map-container" style="width: 100%; height: 220px; border-radius: 8px; border: 1px solid var(--line); position: relative; overflow: hidden; z-index: 1;"></div>
          <script>
            (function(){
              setTimeout(() => {
                const mapEl = document.getElementById('real-map-container');
                if (mapEl && !mapEl._leaflet_id && window.L) {
                   const lat = \${shift.gps.lat};
                   const lng = \${shift.gps.lng};
                   const map = L.map('real-map-container', {zoomControl: false, attributionControl: false}).setView([lat, lng], 17);
                   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                   const iconHtml = \`<div style="width: 16px; height: 16px; background: #059669; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 12px rgba(5,150,105,0.8);"></div>\`;
                   const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [16,16], iconAnchor: [8,8] });
                   L.marker([lat, lng], {icon: customIcon}).addTo(map);
                }
              }, 150);
            })();
          </script>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('Real interactive map successfully embedded.');
} else {
  console.log('Target string not found! Check indentation.');
}
