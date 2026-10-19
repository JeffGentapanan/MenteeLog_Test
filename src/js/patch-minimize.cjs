const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /\$\{panel\('DTR History \(v5\)',.*?\+ c\.dtrTable\(list,u\(\)\)\)\}/;
if (!content.match(regex)) {
    console.log("Could not find v5.");
    process.exit(1);
}

// We wrap the dtrTable in a <details> block
const fixedCall = `\${panel('DTR History (v6)', '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); width: 100%; gap: 24px; margin-bottom: 48px; padding-bottom: 16px;">' + [['All','All'],['Approved','Approved'],['Pending','Pending'],['Flagged','Flagged'],['Rejected','Rejected']].map(([value,label])=>{ const active = c.view.filter===value; return '<button data-action="filter" data-id="'+e(value)+'" style="background: '+(active ? 'var(--burgundy)' : 'var(--surface)')+'; color: '+(active ? 'var(--cream)' : 'var(--ink)')+'; border: 1px solid '+(active ? 'transparent' : 'var(--line)')+'; border-radius: 12px; padding: 16px; font-weight: 600; font-size: 14px; text-align: center; cursor: pointer; transition: all 0.2s; box-shadow: '+(active ? '0 4px 12px rgba(88,17,26,0.15)' : 'none')+';"><span style="display:block;">'+e(label)+'</span></button>'; }).join('') + '</div>' + '<style>.dtr-summary::-webkit-details-marker { display: none; } .dtr-summary { list-style: none; }</style><details open><summary class="btn secondary small dtr-summary" style="cursor: pointer; margin-bottom: 16px; display: inline-flex; align-items: center; gap: 8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg> Minimize / Expand Table</summary><div style="margin-top: 8px;">' + c.dtrTable(list,u()) + '</div></details>')}`;

content = content.replace(regex, fixedCall);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected minimize button (v6)');
