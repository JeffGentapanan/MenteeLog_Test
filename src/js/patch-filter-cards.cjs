const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const oldFilterStr = "const filter=(items)=>`<div class=\"tabs\">${items.map(([value,label])=>b(label,'filter',value,c.view.filter===value?'small':'secondary small')).join('')}</div>`;";

const newFilterStr = "const filter=(items)=>`<div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 16px; margin-bottom: 24px;\">${items.map(([value,label])=>{ const active = c.view.filter===value; return \`<button data-action=\"filter\" data-id=\"\${e(value)}\" style=\"background: \${active ? 'var(--primary)' : 'var(--surface)'}; color: \${active ? 'var(--cream)' : 'var(--ink)'}; border: 1px solid \${active ? 'transparent' : 'var(--line)'}; border-radius: 12px; padding: 16px; font-weight: 600; font-size: 14px; text-align: center; cursor: pointer; transition: all 0.2s; box-shadow: \${active ? '0 4px 12px rgba(88,17,26,0.15)' : 'none'};\"><span style=\"display:block;\">\${e(label)}</span></button>\`; }).join('')}</div>`;";

if (content.includes(oldFilterStr)) {
  content = content.replace(oldFilterStr, newFilterStr);
  fs.writeFileSync(jsPath, content, 'utf8');
  console.log('Filter function successfully updated to card grid.');
} else {
  console.log('Could not find the filter function string.');
}
