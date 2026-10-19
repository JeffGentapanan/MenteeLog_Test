const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = `<div class="row between"><p>Import a CSV batch of pre-approved OJT candidates.</p>\${b('Download CSV Template','csv-template','','secondary small','download')}</div><button class="upload-drop"`;
const replaceStr = `<div class="row between" style="margin-bottom: 24px;"><p>Import a CSV batch of pre-approved OJT candidates.</p>\${b('Download CSV Template','csv-template','','secondary small','download')}</div><button class="upload-drop"`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully adjusted CSV template button spacing!');
} else {
    console.error("Could not find the target string.");
}
