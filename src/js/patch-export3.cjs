const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /return true;\s*\}\s*return false;\s*\}/;

if (!content.match(regex)) {
    console.log("Could not find the end of attendanceAction.");
    process.exit(1);
}

const newLogic = `return true;\n  }

if(name==='ref-dtr-export'){const logs=visibleLogs(db(),u()).filter(l=>!id||l.studentId===id);if(id&&!visibleStudents(db(),u()).some(s=>s.id===id))throw new Error('Student outside your scope.');c.showModal('Export DTR Summary',\`<div class="grid-2">\${f('From','from','date')}\${f('To','to','date')}</div>\${sel('Format','format',['PDF','CSV'])}<label class="row"><input type="checkbox" name="tasks" checked> Include task summaries and supervisor remarks</label>\`,v=>{if(v.from&&v.to&&v.from>v.to)throw new Error('The end date must follow the start date.');const items=logs.filter(l=>(!v.from||l.date>=v.from)&&(!v.to||l.date<=v.to));const rows=[['Student','Date','Clock In','Clock Out','Hours','Status',...(v.tasks?['Task','Remarks']:[])],...items.map(l=>[c.student(l.studentId)?.name,l.date,time(l.clockIn),time(l.clockOut),l.hours,l.status,...(v.tasks?[l.task,l.remarks]:[])])];const file=reportFile({title:'MenteeLog DTR Summary',rows},v.format);c.download(file.name,file.content,file.type);},'Download Summary');return true;}

if (name === 'ref-export-modal') {
    if(u().role!=='Student')throw new Error('Student access required.');
    c.showModal('Export DTR Summary', \`
        <div class="grid-2">
            \${f('From Date','from','date')}
            \${f('To Date','to','date')}
        </div>
        \${sel('Export Format','format',['PDF Document (.pdf)','CSV Spreadsheet (.csv)'])}
        <label class="row" style="margin-top: 16px;"><input type="checkbox" name="tasks" checked> Include task summaries</label>
        <label class="row"><input type="checkbox" name="notes" checked> Include supervisor verification notes</label>
    \`, async (v, form) => {
        if(v.format.includes('CSV')) {
            const logs = visibleLogs(db(), u()).filter(l => l.studentId === u().id);
            const items = logs.filter(l => (!v.from || l.date >= v.from) && (!v.to || l.date <= v.to));
            const rows = [['Student','Date','Clock In','Clock Out','Hours','Status', ...(form.elements.tasks.checked?['Task']:[])], ...items.map(l => [u().name, l.date, time(l.clockIn), time(l.clockOut), l.hours, l.status, ...(form.elements.tasks.checked?[l.task]:[])])];
            const file = reportFile({title:'DTR Summary', rows}, 'CSV');
            c.download(file.name, file.content, file.type);
            document.querySelector('#modal').close();
            return;
        }

        const logs = visibleLogs(db(), u()).filter(l => l.studentId === u().id);
        const items = logs.filter(l => (!v.from || l.date >= v.from) && (!v.to || l.date <= v.to)).slice().reverse();

        let totalHours = 0;
        const rowsHtml = items.length ? items.map(l => {
            totalHours += l.hours;
            return \`<tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">\${date(l.date)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">\${time(l.clockIn)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">\${time(l.clockOut)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">\${l.hours.toFixed(2)}h</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">\${l.gps ? '14.5547°N, 121.0244°E' : 'Unavailable'}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">\${badge(l.status)}</td>
            </tr>\${form.elements.tasks.checked ? \`<tr><td colspan="6" style="padding: 4px 0 16px 0; color: #555; font-size: 13px; font-style: italic; border-bottom: 1px solid #eee;">Task: \${e(l.task)}\${form.elements.notes.checked && l.remarks ? '<br>Note: '+e(l.remarks) : ''}</td></tr>\` : ''}\`;
        }).join('') : '<tr><td colspan="6" style="text-align:center; padding: 16px;">No logs in this date range.</td></tr>';

        const monthStr = v.from ? new Date(v.from).toLocaleDateString('en', {month:'long', year:'numeric'}) : new Date().toLocaleDateString('en', {month:'long', year:'numeric'});

        const previewBody = \`
        <div style="background: white; color: black; padding: 40px; font-family: 'Inter', sans-serif; border: 1px solid #ccc; max-height: 60vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--burgundy); padding-bottom: 16px; margin-bottom: 24px;">
                <div>
                    <h1 style="margin: 0; color: var(--burgundy); font-size: 24px;">MenteeLog — Daily Time Record</h1>
                    <p style="margin: 4px 0 0 0; color: #555;">CIT Department · AY 2025–2026 · 2nd Semester</p>
                </div>
                <div style="text-align: right; color: #888;">
                    <strong>DTR Log Summary — \${monthStr}</strong><br>
                    <small>Generated \${date(today())}</small>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <dl style="margin: 0; display: grid; grid-template-columns: 120px 1fr; gap: 8px; font-size: 14px;">
                    <dt style="color: #666; margin: 0;">Student</dt><dd style="margin: 0; font-weight: bold;">\${e(u().name)}</dd>
                    <dt style="color: #666; margin: 0;">SR Code</dt><dd style="margin: 0; font-weight: bold;">\${e(u().identifier)}</dd>
                    <dt style="color: #666; margin: 0;">Course/Section</dt><dd style="margin: 0; font-weight: bold;">\${e(u().course)}</dd>
                </dl>
                <dl style="margin: 0; display: grid; grid-template-columns: 120px 1fr; gap: 8px; font-size: 14px;">
                    <dt style="color: #666; margin: 0;">HTE</dt><dd style="margin: 0; font-weight: bold;">\${e(u().company||'Unassigned')}</dd>
                    <dt style="color: #666; margin: 0;">Supervisor</dt><dd style="margin: 0; font-weight: bold;">\${e(c.student(u().supervisorId)?.name||'Unassigned')}</dd>
                    <dt style="color: #666; margin: 0;">Required Hours</dt><dd style="margin: 0; font-weight: bold;">\${u().requiredHours} hours</dd>
                </dl>
            </div>

            <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">\${monthStr} — Verified Attendance Log</h3>
            <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 32px; font-size: 14px;">
                <thead>
                    <tr style="border-bottom: 2px solid #ddd;">
                        <th style="padding: 8px 0;">Date</th>
                        <th style="padding: 8px 0;">Clock In</th>
                        <th style="padding: 8px 0;">Clock Out</th>
                        <th style="padding: 8px 0;">Hours</th>
                        <th style="padding: 8px 0;">GPS Coords</th>
                        <th style="padding: 8px 0;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    \${rowsHtml}
                </tbody>
            </table>

            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 48px; text-align: center;">
                <strong style="font-size: 18px; color: var(--ink);">Month Total: \${totalHours.toFixed(2)}h logged</strong>
                <p style="margin: 4px 0 0 0; color: #666;">\${approvedHours(db(), u().id)} / \${u().requiredHours} cumulative approved hours</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 64px;">
                <div style="text-align: center; border-top: 1px solid #000; padding-top: 8px;">
                    <strong style="color: var(--ink);">\${e(u().name)}</strong><br>
                    <span style="color: #666; font-size: 12px;">Student Signature / Date</span>
                </div>
                <div style="text-align: center; border-top: 1px solid #000; padding-top: 8px;">
                    <strong style="color: var(--ink);">\${e(c.student(u().supervisorId)?.name||'Supervisor')}</strong><br>
                    <span style="color: #666; font-size: 12px;">Supervisor Signature / Date</span>
                </div>
            </div>
        </div>

        <div class="form-actions" style="margin-top: 24px;">
            <button class="btn secondary" data-action="close">Close</button>
            <div style="flex: 1;"></div>
            <button class="btn secondary" data-action="ref-export-print">Print Document</button>
            <button class="btn" data-action="ref-export-download">Download PDF</button>
        </div>
        \`;

        c.showModal('DTR_Log_Summary_\${e(u().name.split(" ").pop())}.pdf · Preview', previewBody, null);
    }, 'Preview');
    return true;
}
if (name === 'ref-export-print') {
    window.print();
    return true;
}
if (name === 'ref-export-download') {
    c.toast('PDF generation requires the backend PDF renderer. (Demo: downloaded as text)');
    c.download('DTR_Log_Summary.txt', 'This is a demo placeholder for the PDF. Connect the backend to enable headless browser rendering.', 'text/plain');
    return true;
}
return false;
}
`;

content = content.replace(regex, newLogic);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully injected 2-step export flow with regex matching!');
