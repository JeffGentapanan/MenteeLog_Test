const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/index.html';
let content = fs.readFileSync(path, 'utf8');

const oldCsp = "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'\">";
const newCsp = "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' blob: data: https://*.tile.openstreetmap.org https://unpkg.com; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'\">";

content = content.replace(oldCsp, newCsp);

const newTags = `  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script type="module" src="./js/app.js?v=4"></script>`;
  
content = content.replace('<script type="module" src="./js/app.js?v=3"></script>', newTags);

fs.writeFileSync(path, content, 'utf8');
console.log('index.html patched with Leaflet!');
