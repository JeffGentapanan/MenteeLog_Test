const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = `<div class="row between"><h2>Flagged Entries</h2>\${b('Run Auto Verification','ref-scan','','secondary small')}</div>`;
const replaceStr = `<div class="row between" style="margin-bottom: 20px;"><h2>Flagged Entries</h2>\${b('Run Auto Verification','ref-scan','','secondary small')}</div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully adjusted Auto Verification button spacing!');
} else {
    console.error("Could not find the target string.");
}
