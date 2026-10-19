const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let content = fs.readFileSync(path, 'utf8');

const marker = '/* =========================================\n   PUBLIC / AUTHENTICATION MODERN REDESIGN\n   ========================================= */';

if (content.includes(marker)) {
  const parts = content.split(marker);
  fs.writeFileSync(path, parts[0].trim(), 'utf8');
  console.log('Removed public/auth redesign CSS from styles.css');
} else {
  console.log('Marker not found in styles.css');
}
