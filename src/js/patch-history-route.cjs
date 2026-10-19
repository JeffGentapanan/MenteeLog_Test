const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const routeInjection = "if(sub==='history') return back('dtr') + heading('DTR History', 'Complete attendance and task records.') + filter([['All','All'],['Approved','Approved'],['Pending','Pending'],['Flagged','Flagged'],['Rejected','Rejected']]) + panel('', c.dtrTable(logs.filter(l=>c.view.filter==='All'||l.status===c.view.filter), u()));\n    const shift=";

if (!content.includes("if(sub==='history')")) {
    content = content.replace("const shift=", routeInjection);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Route injected successfully!');
} else {
    console.log('Route already exists!');
}
