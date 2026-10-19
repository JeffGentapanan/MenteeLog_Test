const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

// Fix 1: Jobs / Slot Management root page
const jobTarget = "return (isStudent?'':back('dashboard'))+heading(isStudent?'OJT Placement Directory':'Slot Management'";
const jobReplace = "return (isStudent?'': '')+heading(isStudent?'OJT Placement Directory':'Slot Management'";
if (content.includes(jobTarget)) {
    content = content.replace(jobTarget, jobReplace);
}

// Fix 2: Performance Appraisals root page
const appraisalTarget = "const list=visibleStudents(db(),u()).filter(s=>match(s.name,s.course));return back('dashboard')+heading('Performance Appraisal'";
const appraisalReplace = "const list=visibleStudents(db(),u()).filter(s=>match(s.name,s.course));return heading('Performance Appraisal'";
if (content.includes(appraisalTarget)) {
    content = content.replace(appraisalTarget, appraisalReplace);
}

// Fix 3: Attendance & DTR for Supervisor
const dtrTarget = "return (u().role==='Supervisor'?back('dashboard'):'')+heading('DTR & Attendance Management'";
const dtrReplace = "return (u().role==='Supervisor'?'':'')+heading('DTR & Attendance Management'";
if (content.includes(dtrTarget)) {
    content = content.replace(dtrTarget, dtrReplace);
}

// Check other modules just in case
const candidateTarget = "return back('dashboard')+heading('Candidate Management'";
const candidateReplace = "return heading('Candidate Management'";
if (content.includes(candidateTarget)) {
    content = content.replace(candidateTarget, candidateReplace);
}

const reportTarget = "return back('dashboard')+heading('Incident Reports'";
const reportReplace = "return heading('Incident Reports'";
if (content.includes(reportTarget)) {
    content = content.replace(reportTarget, reportReplace);
}


fs.writeFileSync(jsPath, content, 'utf8');
console.log('Successfully removed redundant Back to Dashboard buttons!');
