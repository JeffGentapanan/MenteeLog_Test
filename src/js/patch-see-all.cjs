const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. Add the history route
const routeInjection = "if(sub==='history') return back('dtr') + heading('DTR History', 'Complete attendance and task records.') + filter([['All','All'],['Approved','Approved'],['Pending','Pending'],['Flagged','Flagged'],['Rejected','Rejected']]) + panel('', c.dtrTable(logs.filter(l=>c.view.filter==='All'||l.status===c.view.filter), u()));\n      const shift=db().shift?.studentId===u().id?db().shift:null,";

if (!content.includes("if(sub==='history')")) {
    content = content.replace("const shift=db().shift?.studentId===u().id?db().shift:null,", routeInjection);
}

// 2. Replace the DTR History panel on the main dashboard with Recent Clock-ins
const regex = /\$\{panel\('DTR History \(v6\)',.*?\<\/details>'\)\}/;
if (!content.match(regex)) {
    console.log("Could not find v6.");
    process.exit(1);
}

const recentPanel = `\${panel('Recent Clock-ins', c.dtrTable(list.slice(0, 5), u()) + '<div style="margin-top: 24px; text-align: center;">' + nav('See All DTR History', 'dtr', 'history', '', 'secondary full') + '</div>')}`;

content = content.replace(regex, recentPanel);

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected Recent Clock-ins and History page!');
