const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /\$\{panel\('DTR History \(v3\)',.*?\+ c\.dtrTable\(list,u\(\)\)\)\}/;
if (!content.match(regex)) {
    console.log("Could not find the broken line.");
    process.exit(1);
}

const fixedCall = "${panel('DTR History (v4)', filter([['All','All'],['Approved','Approved'],['Pending','Pending'],['Flagged','Flagged'],['Rejected','Rejected']]) + `<div style=\"margin-top: 48px; display: block; height: 10px; background: transparent;\"></div>` + c.dtrTable(list,u()))}";

content = content.replace(regex, fixedCall);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Fixed syntax error!');
