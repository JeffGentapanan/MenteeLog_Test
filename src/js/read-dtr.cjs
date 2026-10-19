const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const start = content.indexOf('<div class="reference-dtr ref-student-dtr"><div>${panel(\'\'');
const end = content.indexOf('${panel(\'Today’s Task Summary\'');
console.log(content.substring(start, end));
