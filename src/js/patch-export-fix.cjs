const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /c\.showModal\('DTR_Log_Summary_\$\{e\(u\(\)\.name\.split\(" "\)\.pop\(\)\)\}\.pdf · Preview', previewBody, null\);/g;

if (!content.match(regex)) {
    console.log("Could not find the showModal preview call.");
    process.exit(1);
}

const replacement = `setTimeout(() => {
            c.showModal('DTR_Log_Summary_\${e(u().name.split(" ").pop())}.pdf · Preview', previewBody, null);
        }, 50);`;

content = content.replace(regex, replacement);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Fixed Preview button by deferring the second modal!');
