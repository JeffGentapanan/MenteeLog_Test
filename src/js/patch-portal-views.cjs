const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(path, 'utf8');

// Remove the supervisorDashboard override in portal-views.js so it falls back to app.js
content = content.replace("if(page==='dashboard'&&user.role==='Supervisor')content=supervisorDashboard();\n      else ", "");

fs.writeFileSync(path, content, 'utf8');
console.log('Removed supervisorDashboard override from portal-views.js');
