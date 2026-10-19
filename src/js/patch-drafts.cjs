const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. Inject the drafts sub-route
const routeInjection = "if(sub==='drafts') return back('dtr') + heading('Saved Drafts History', 'Review all your previously saved task summary drafts.') + panel('', drafts.length?table(['Date','Task Summary','Action'],drafts.map(d=>`<tr><td>${date(d.date)}</td><td><span class=\"task-excerpt\">${e(d.task)}</span></td><td>${b('View Draft','ref-draft-view',d.id,'secondary small')}</td></tr>`)):empty('No saved drafts','Save a task summary to continue it later.'));\n    return heading('Daily Time Record Hub'";

if (!content.includes("if(sub==='drafts')")) {
    content = content.replace("return heading('Daily Time Record Hub'", routeInjection);
}

// 2. Modify the Saved Drafts panel on the main dashboard
const regex = /\$\{panel\('Saved Drafts',.*?\)\}\<\/div\>\<\/div\>\`\;/;
if (!content.match(regex)) {
    console.log("Could not find the Saved Drafts panel.");
    process.exit(1);
}

const recentDraftsPanel = `\${panel('Recent Saved Drafts', (drafts.length ? table(['Date','Task Summary','Action'], drafts.slice(0,3).map(d=>\`<tr><td>\${date(d.date)}</td><td><span class="task-excerpt">\${e(d.task)}</span></td><td>\${b('View Draft','ref-draft-view',d.id,'secondary small')}</td></tr>\`)) : empty('No saved drafts','Save a task summary to continue it later.')) + '<div style="margin-top: 24px; text-align: center;">' + nav('See All Saved Drafts History', 'dtr', 'drafts', '', 'secondary full') + '</div>')}</div></div>\`;`;

content = content.replace(regex, recentDraftsPanel);

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected Recent Drafts and Drafts history page!');
