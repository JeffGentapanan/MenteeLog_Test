const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// Replace the corrupted string
content = content.replace(/c\.showModal\(`DTR_Log_Summary_\$\{e\(u\(\)\.name\.split\(" "\)\.pop\(\)\)\}\.pdf[^`]*?Preview`, previewBody, null\);/g, 
"c.showModal(`DTR_Log_Summary_${e(u().name.split(' ').pop())}.pdf - Preview`, previewBody, null);");

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Fixed character encoding issue in modal title!');
