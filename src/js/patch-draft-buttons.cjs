const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /if\(name==='ref-draft-view'\)\{[\s\S]*?return true;\}/;

if (!content.match(regex)) {
    console.log("Could not find the ref-draft-view block.");
    process.exit(1);
}

const newLogic = `if(name==='ref-draft-edit'){
    const d=db().taskDrafts?.find(d=>d.id===id&&d.studentId===u().id);
    if(!d)throw new Error('Draft unavailable.');
    db().draft = d.task;
    c.save();
    c.toast('Draft loaded into today’s task summary.');
    document.querySelector('#modal').close();
    if(r().sub==='drafts') location.hash = '#/student/dtr';
    else c.render();
    return true;
}
if(name==='ref-draft-view'){
    const d=db().taskDrafts?.find(d=>d.id===id&&d.studentId===u().id);
    if(!d)throw new Error('Draft unavailable.');
    const ds = new Date(d.date).toLocaleDateString('en',{month:'long', day:'numeric'});
    const title = 'Task Summary Draft - ' + date(d.date);
    const body = \`
    <p class="muted small mb16">View your latest daily log for \${ds}</p>
    <div class="row wrap mb16" style="gap: 8px;">
        \${badge('Draft Log Viewer')} \${badge('Draft Auto-saved · AY 2025-2026 · 2nd Semester')}
    </div>
    <div class="grid-2" style="background: var(--surface); border: 1px solid var(--line); padding: 16px; border-radius: 12px; margin-bottom: 24px;">
        <dl class="ref-facts" style="margin: 0;">
            <dt>Student</dt><dd>\${e(u().name)}</dd>
            <dt>SR Code</dt><dd>\${e(u().identifier)}</dd>
            <dt>Course/Section</dt><dd>\${e(u().course)}</dd>
        </dl>
        <dl class="ref-facts" style="margin: 0;">
            <dt>HTE</dt><dd>\${e(u().company||'Unassigned')}</dd>
            <dt>Supervisor</dt><dd>\${e(c.student(u().supervisorId)?.name||'Unassigned')}</dd>
            <dt>Status</dt><dd>\${badge('Draft Auto-saved')}</dd>
        </dl>
    </div>
    <h3 class="mt16 mb8" style="font-size: 15px;">\${date(d.date)} - Full Log Details</h3>
    <div style="background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; margin: 0; color: var(--ink);">\${e(d.task)}</p>
    </div>
    <div class="form-actions">
        <button class="btn secondary" data-action="close">Close</button>
        <button class="btn secondary" data-action="ref-draft-edit" data-id="\${id}">Edit Draft</button>
        <button class="btn" data-action="ref-draft-edit" data-id="\${id}">Okay, Continue Drafting</button>
    </div>
    \`;
    c.showModal(title, body, null);
    return true;
}`;

content = content.replace(regex, newLogic);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected custom 3-button draft view modal!');
