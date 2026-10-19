const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = "if(hours<=0)throw new Error('The shift is too short to record. Wait at least 20 seconds before submitting.');";
content = content.replace(targetStr, "/* removed 20s limit */");

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully removed the 20s limit in app.js.');
