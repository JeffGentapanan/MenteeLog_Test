const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const regex = /if\(name==='log-detail'&&u\(\)\.role==='Student'\)\{const l=visibleLogs.*?return true;\}\}/;

if (!content.match(regex)) {
    console.log("Could not find the log-detail line.");
    process.exit(1);
}

// Replacement logic
const newLogic = `if((name==='log-detail'||name==='ref-justify-modal')&&u().role==='Student'){const l=visibleLogs(db(),u()).find(l=>l.id===id);if(!l)throw new Error('DTR unavailable.');if(['Flagged','Rejected'].includes(l.status)){c.showModal('Write Justification',\`<p class="muted small mb16" style="text-transform: uppercase; font-weight: 600;">\${date(l.date)} - \${l.status}</p><h3>Flag Reason</h3><p class="ref-alert mb16">\${e(l.remarks||'GPS Mismatch - logged in 2.3 km outside registered geofence.')}</p><p class="muted small mb16">Your justification will be forwarded to your supervisor for review. Be clear and factual.</p>\${ta('Your Explanation','justification',l.justification||'','required minlength="10" placeholder="Explain the reason for the attendance anomaly (e.g. internet outage, venue change, device issue)..."')}\${f('Attach Evidence','evidence','file','','accept="application/pdf,image/png,image/jpeg"')}<p class="small muted mt8">PNG, JPG or PDF (max. 10MB)</p>\`,async(v,form)=>{const file=form.elements.evidence.files[0];if(file){validateUpload(file);const doc={id:crypto.randomUUID(),studentId:u().id,category:'DTR Justification',name:file.name,type:file.type,size:file.size,date:today()};await c.putFile(doc.id,file);db().documents.push(doc);l.evidenceId=doc.id;}l.justification=v.justification;l.status='Pending';c.notify(l.supervisorId,'DTR_Event','Attendance justification submitted',u().name+' resubmitted '+date(l.date)+' for review.');finish('Justification submitted for supervisor review.','dtr');},'Submit');return true;}}`;

content = content.replace(regex, newLogic);
fs.writeFileSync(jsPath, content, 'utf8');
console.log('Injected updated justify modal!');
