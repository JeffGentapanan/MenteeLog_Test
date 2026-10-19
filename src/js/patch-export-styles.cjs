const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /if \(name === 'ref-export-modal'\) \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?\}, 50\);\n        \}, 'Preview'\);\n        return true;\n    \}/;

if (!content.match(regex)) {
    console.log("Could not find the ref-export-modal block.");
    process.exit(1);
}

const newLogic = `if (name === 'ref-export-modal') {
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
        // MUST grab boolean values synchronously before form is destroyed by modal.close()!
        const includeTasks = !!form.elements.tasks.checked;
        const includeNotes = !!form.elements.notes.checked;

        if(v.format.includes('CSV')) {
            const logs = visibleLogs(db(), u()).filter(l => l.studentId === u().id);
            const items = logs.filter(l => (!v.from || l.date >= v.from) && (!v.to || l.date <= v.to));
            const rows = [['Student','Date','Clock In','Clock Out','Hours','Status', ...(includeTasks?['Task']:[])], ...items.map(l => [u().name, l.date, time(l.clockIn), time(l.clockOut), l.hours, l.status, ...(includeTasks?[l.task]:[])])];
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
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; background: transparent;">\${date(l.date)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; background: transparent;">\${time(l.clockIn)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; background: transparent;">\${time(l.clockOut)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; background: transparent;">\${l.hours.toFixed(2)}h</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; background: transparent;">\${l.gps ? '14.5547°N, 121.0244°E' : 'Unavailable'}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; background: transparent;">\${badge(l.status)}</td>
            </tr>\${includeTasks ? \`<tr><td colspan="6" style="padding: 4px 0 16px 0; color: #555; font-size: 13px; font-style: italic; border-bottom: 1px solid #eee; background: transparent;">Task: \${e(l.task)}\${includeNotes && l.remarks ? '<br>Note: '+e(l.remarks) : ''}</td></tr>\` : ''}\`;
        }).join('') : '<tr><td colspan="6" style="text-align:center; padding: 16px; background: transparent;">No logs in this date range.</td></tr>';

        const monthStr = v.from ? new Date(v.from).toLocaleDateString('en', {month:'long', year:'numeric'}) : new Date().toLocaleDateString('en', {month:'long', year:'numeric'});

        const previewBody = \`
        <div class="pdf-content-wrapper" style="background: white; color: black; padding: 40px; font-family: 'Inter', sans-serif; border: 1px solid #ccc; max-height: 60vh; overflow-y: auto;">
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

            <table style="width: 100%; font-size: 14px; margin-bottom: 32px; border: none; background: transparent;">
                <tr>
                    <td style="width: 120px; color: #666; padding: 4px 0; background: transparent;">Student</td>
                    <td style="font-weight: bold; padding: 4px 0; background: transparent;">\${e(u().name)}</td>
                    <td style="width: 120px; color: #666; padding: 4px 0; background: transparent;">HTE</td>
                    <td style="font-weight: bold; padding: 4px 0; background: transparent;">\${e(u().company||'Unassigned')}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 4px 0; background: transparent;">SR Code</td>
                    <td style="font-weight: bold; padding: 4px 0; background: transparent;">\${e(u().identifier)}</td>
                    <td style="color: #666; padding: 4px 0; background: transparent;">Supervisor</td>
                    <td style="font-weight: bold; padding: 4px 0; background: transparent;">\${e(c.student(u().supervisorId)?.name||'Unassigned')}</td>
                </tr>
                <tr>
                    <td style="color: #666; padding: 4px 0; background: transparent;">Course/Section</td>
                    <td style="font-weight: bold; padding: 4px 0; background: transparent;">\${e(u().course)}</td>
                    <td style="color: #666; padding: 4px 0; background: transparent;">Required Hours</td>
                    <td style="font-weight: bold; padding: 4px 0; background: transparent;">\${u().requiredHours} hours</td>
                </tr>
            </table>

            <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">\${monthStr} — Verified Attendance Log</h3>
            <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 32px; font-size: 14px; background: transparent;">
                <thead>
                    <tr>
                        <th style="padding: 8px 0; border-bottom: 2px solid #ddd; background: transparent; color: black; font-weight: bold; text-transform: uppercase; font-size: 12px;">Date</th>
                        <th style="padding: 8px 0; border-bottom: 2px solid #ddd; background: transparent; color: black; font-weight: bold; text-transform: uppercase; font-size: 12px;">Clock In</th>
                        <th style="padding: 8px 0; border-bottom: 2px solid #ddd; background: transparent; color: black; font-weight: bold; text-transform: uppercase; font-size: 12px;">Clock Out</th>
                        <th style="padding: 8px 0; border-bottom: 2px solid #ddd; background: transparent; color: black; font-weight: bold; text-transform: uppercase; font-size: 12px;">Hours</th>
                        <th style="padding: 8px 0; border-bottom: 2px solid #ddd; background: transparent; color: black; font-weight: bold; text-transform: uppercase; font-size: 12px;">GPS Coords</th>
                        <th style="padding: 8px 0; border-bottom: 2px solid #ddd; background: transparent; color: black; font-weight: bold; text-transform: uppercase; font-size: 12px;">Status</th>
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

        setTimeout(() => {
            c.showModal(\`DTR_Log_Summary_\${e(u().name.split(" ").pop())}.pdf · Preview\`, previewBody, null);
        }, 50);
    }, 'Preview');
    return true;
}`;

content = content.replace(regex, newLogic);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully injected exact layout fixes and checkbox logic!');
