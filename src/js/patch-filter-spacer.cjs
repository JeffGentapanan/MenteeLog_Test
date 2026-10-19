const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = `</button>\`; }).join('')}</div>\`;`;
const replacement = `</button>\`; }).join('')}</div><div style="height: 32px; width: 100%; display: block; clear: both;"></div>\`;`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('Spacer div successfully added to filter generator.');
} else {
  console.log('Target string not found.');
}
