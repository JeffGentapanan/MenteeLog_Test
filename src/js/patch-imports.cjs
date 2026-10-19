const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let content = fs.readFileSync(jsPath, 'utf8');

content = content.replace("'./portal-views.js';", "'./portal-views.js?v=4';");
content = content.replace("'./public.js';", "'./public.js?v=4';");
content = content.replace("'./data.js';", "'./data.js?v=4';");
content = content.replace("'./creator.js';", "'./creator.js?v=4';");

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully cache-busted imports in app.js.');
