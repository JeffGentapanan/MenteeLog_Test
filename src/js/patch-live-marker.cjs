const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

content = content.replace("panel('DTR History',", "panel('DTR History (Live)',");

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Added Live marker to DTR History.');
