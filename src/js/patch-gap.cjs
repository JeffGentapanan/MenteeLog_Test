const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

content = content.replace('gap: 16px;', 'gap: 24px;');
content = content.replace('margin-bottom: 32px;', 'margin-bottom: 48px;');

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Spacing increased.');
