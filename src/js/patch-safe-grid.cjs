const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /\$\{panel\('DTR History \(v4\)',.*?\+ c\.dtrTable\(list,u\(\)\)\)\}/;
if (!content.match(regex)) {
    console.log("Could not find v4.");
    process.exit(1);
}

// We will build the string carefully to avoid template literal issues.
const fixedCall = `\${panel('DTR History (v5)', '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); width: 100%; gap: 24px; margin-bottom: 48px; padding-bottom: 16px;">' + [['All','All'],['Approved','Approved'],['Pending','Pending'],['Flagged','Flagged'],['Rejected','Rejected']].map(([value,label])=>{ const active = c.view.filter===value; return '<button data-action="filter" data-id="'+e(value)+'" style="background: '+(active ? 'var(--primary)' : 'var(--surface)')+'; color: '+(active ? 'var(--cream)' : 'var(--ink)')+'; border: 1px solid '+(active ? 'transparent' : 'var(--line)')+'; border-radius: 12px; padding: 16px; font-weight: 600; font-size: 14px; text-align: center; cursor: pointer; transition: all 0.2s; box-shadow: '+(active ? '0 4px 12px rgba(88,17,26,0.15)' : 'none')+';"><span style="display:block;">'+e(label)+'</span></button>'; }).join('') + '</div><div style="margin-top: 48px; display: block; height: 10px; background: transparent;"></div>' + c.dtrTable(list,u()))}`;

content = content.replace(regex, fixedCall);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected safely hardcoded grid (v5)');
