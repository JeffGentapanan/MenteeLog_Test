const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

content = content.replace('c.dtrTable(list,u())', '`<div style="margin-top: 48px; display: block; height: 10px; background: transparent;"></div>` + c.dtrTable(list,u())');

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Diagnostic spacing added before dtrTable.');
