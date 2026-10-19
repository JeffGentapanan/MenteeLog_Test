const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const oldStr = `<div class="row between section-space"><h2>Available CHED Reports</h2><div class="row">\${nav('Report History','reports','history')}\${nav('Custom Report Builder','reports','configure','custom')}</div></div>`;
const newStr = `<div class="row between section-space" style="margin-bottom: 24px;"><h2>Available CHED Reports</h2><div class="row" style="gap: 12px;">\${nav('Report History','reports','history')}\${nav('Custom Report Builder','reports','configure','custom')}</div></div>`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully adjusted report buttons layout!');
} else {
    console.error("Could not find the target string.");
}
