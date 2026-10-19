const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// The massive regex to replace the entire ref-export-modal block:
const startIndex = content.indexOf("if (name === 'ref-export-modal') {");
let endIndex = content.indexOf("if (name === 'ref-export-print') {");

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find the bounds.");
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

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
            return \`
            <div style="display: flex; border-bottom: 1px solid #eee; padding: 8px 0; font-size: 14px;">
                <div style="flex: 1;">\${date(l.date)}</div>
                <div style="flex: 1;">\${time(l.clockIn)}</div>
                <div style="flex: 1;">\${time(l.clockOut)}</div>
                <div style="flex: 0.8;">\${l.hours.toFixed(2)}h</div>
                <div style="flex: 1.5;">\${l.gps ? '14.5547&deg;N, 121.0244&deg;E' : 'Unavailable'}</div>
                <div style="flex: 1;">\${badge(l.status)}</div>
            </div>
            \${includeTasks ? \`<div style="padding: 4px 0 16px 0; color: #555; font-size: 13px; font-style: italic; border-bottom: 1px solid #eee;">Task: \${e(l.task)}\${includeNotes && l.remarks ? '<br>Note: '+e(l.remarks) : ''}</div>\` : ''}\`;
        }).join('') : '<div style="text-align:center; padding: 16px;">No logs in this date range.</div>';

        const monthStr = v.from ? new Date(v.from).toLocaleDateString('en', {month:'long', year:'numeric'}) : new Date().toLocaleDateString('en', {month:'long', year:'numeric'});

        const previewBody = \`
        <div class="pdf-content-wrapper" style="background: white !important; color: black !important; padding: 40px !important; font-family: 'Inter', sans-serif !important; border: 1px solid #ccc !important; max-height: 60vh; overflow-y: auto;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--burgundy); padding-bottom: 16px; margin-bottom: 24px;">
                <div>
                    <h1 style="margin: 0; color: var(--burgundy); font-size: 24px;">MenteeLog &mdash; Daily Time Record</h1>
                    <p style="margin: 4px 0 0 0; color: #555;">CIT Department &middot; AY 2025&ndash;2026 &middot; 2nd Semester</p>
                </div>
                <div style="text-align: right; color: #888;">
                    <strong>DTR Log Summary &mdash; \${monthStr}</strong><br>
                    <small>Generated \${date(today())}</small>
                </div>
            </div>

            <div style="display: flex; gap: 24px; margin-bottom: 32px; font-size: 14px;">
                <div style="flex: 1;">
                    <div style="display: flex; margin-bottom: 8px;"><div style="width: 120px; color: #666;">Student</div><div style="font-weight: bold;">\${e(u().name)}</div></div>
                    <div style="display: flex; margin-bottom: 8px;"><div style="width: 120px; color: #666;">SR Code</div><div style="font-weight: bold;">\${e(u().identifier)}</div></div>
                    <div style="display: flex;"><div style="width: 120px; color: #666;">Course/Section</div><div style="font-weight: bold;">\${e(u().course)}</div></div>
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; margin-bottom: 8px;"><div style="width: 120px; color: #666;">HTE</div><div style="font-weight: bold;">\${e(u().company||'Unassigned')}</div></div>
                    <div style="display: flex; margin-bottom: 8px;"><div style="width: 120px; color: #666;">Supervisor</div><div style="font-weight: bold;">\${e(c.student(u().supervisorId)?.name||'Unassigned')}</div></div>
                    <div style="display: flex;"><div style="width: 120px; color: #666;">Required Hours</div><div style="font-weight: bold;">\${u().requiredHours} hours</div></div>
                </div>
            </div>

            <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">\${monthStr} &mdash; Verified Attendance Log</h3>
            
            <div style="display: flex; border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-bottom: 8px; font-weight: bold; text-transform: uppercase; font-size: 12px; color: black;">
                <div style="flex: 1;">Date</div>
                <div style="flex: 1;">Clock In</div>
                <div style="flex: 1;">Clock Out</div>
                <div style="flex: 0.8;">Hours</div>
                <div style="flex: 1.5;">GPS Coords</div>
                <div style="flex: 1;">Status</div>
            </div>
            
            \${rowsHtml}

            <div style="background: #f9f9f9 !important; padding: 16px !important; border-radius: 8px !important; margin-top: 32px !important; margin-bottom: 48px !important; text-align: center !important;">
                <strong style="font-size: 18px; color: black !important;">Month Total: \${totalHours.toFixed(2)}h logged</strong>
                <p style="margin: 4px 0 0 0; color: #666 !important;">\${approvedHours(db(), u().id)} / \${u().requiredHours} cumulative approved hours</p>
            </div>

            <div style="display: flex; gap: 48px; margin-top: 64px;">
                <div style="flex: 1; text-align: center; border-top: 1px solid #000; padding-top: 8px;">
                    <strong style="color: black !important;">\${e(u().name)}</strong><br>
                    <span style="color: #666 !important; font-size: 12px;">Student Signature / Date</span>
                </div>
                <div style="flex: 1; text-align: center; border-top: 1px solid #000; padding-top: 8px;">
                    <strong style="color: black !important;">\${e(c.student(u().supervisorId)?.name||'Supervisor')}</strong><br>
                    <span style="color: #666 !important; font-size: 12px;">Supervisor Signature / Date</span>
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
            const safeName = e(u().name.split(' ').pop());
            c.showModal('DTR_Log_Summary_' + safeName + '.pdf - Preview', previewBody, null);
        }, 50);
    }, 'Preview');
    return true;
}
`;

fs.writeFileSync(jsPath, before + newLogic + after, 'utf8');
console.log('Successfully injected ultimate CSS override patch!');
