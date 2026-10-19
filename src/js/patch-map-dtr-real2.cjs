const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const startMarker = '<!-- Visual Map Frame -->';
const endMarker = '</div>\n        </div>';

const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
  // Find the end marker
  const endIndex = content.indexOf(endMarker, startIndex);
  if (endIndex !== -1) {
    const newStr = `<!-- Visual Map Frame -->
          <div id="real-map-container" style="width: 100%; height: 220px; border-radius: 8px; border: 1px solid var(--line); position: relative; overflow: hidden; z-index: 1; margin-bottom: 12px;"></div>
          <script>
            (function(){
              setTimeout(() => {
                const mapEl = document.getElementById('real-map-container');
                if (mapEl && !mapEl._leaflet_id && window.L) {
                   const lat = \${shift.gps.lat};
                   const lng = \${shift.gps.lng};
                   const map = L.map('real-map-container', {zoomControl: false, attributionControl: false}).setView([lat, lng], 16);
                   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                   const iconHtml = \`<div style="width: 16px; height: 16px; background: #059669; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 12px rgba(5,150,105,0.8);"></div>\`;
                   const customIcon = L.divIcon({ html: iconHtml, className: '', iconSize: [16,16], iconAnchor: [8,8] });
                   L.marker([lat, lng], {icon: customIcon}).addTo(map);
                }
              }, 150);
            })();
          </script>
        `;
    
    content = content.substring(0, startIndex) + newStr + content.substring(endIndex + 6);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Real interactive map successfully embedded using indexOf!');
  } else {
    console.log('End marker not found.');
  }
} else {
  console.log('Start marker not found.');
}
