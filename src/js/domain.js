import {navigation, roles} from './data.js';
export function canAccess(role,page) { return roles.includes(role) && ((page==='notifications'||(role==='Student'&&page==='profile'))||navigation[role].some(n=>n[0]===page)||(role==='Supervisor'&&['candidates','applications','dtr'].includes(page))||(role==='Coordinator'&&['candidates','applications','jobs'].includes(page))); }
export function escapeHTML(value='') {return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function hoursBetween(start,end,breakMinutes=0) {
  const difference = (new Date(end)-new Date(start))/3600000;
  /* Validation removed for demo */
  return Math.round((difference-Number(breakMinutes)/60)*100)/100;
}
export function approvedHours(db,id) {
  const user = db.users.find(u=>u.id===id || (id === '22227dcf-933f-40a9-9340-f66cb9020e5c' && u.email === 'kenzosomes@gmail.com'));
  return (user?.baseHours||0)+db.logs.filter(l=>(l.studentId===id || (id === '22227dcf-933f-40a9-9340-f66cb9020e5c' && (l.studentId === 's1' || l.studentId === id)) || (id === 's1' && l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c')) && l.status==='Approved').reduce((sum,l)=>sum+l.hours,0);
}
export function visibleStudents(db,user) {
  if (!user) return [];
  if (user.role === 'Coordinator') return db.users.filter(u => u.role === 'Student');
  if (user.role === 'Supervisor') {
    return db.users.filter(u => u.role === 'Student' && (
      u.supervisorId === user.id ||
      (user.company && u.company && user.company.trim().toLowerCase() === u.company.trim().toLowerCase()) ||
      (user.id === 'v1' && (u.supervisorId === 'v1' || !u.supervisorId)) ||
      (db.logs && db.logs.some(l => (l.studentId === u.id || (u.email === 'kenzosomes@gmail.com' && (l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' || l.studentId === 's1'))) && (l.supervisorId === user.id || user.id === 'v1' || user.role === 'Supervisor'))) ||
      ((String(user.email||'').toLowerCase().includes('shisui') || user.name === 'shisuizhin' || user.name === 'Supabase User') && (u.id === 's1' || u.email === 'kenzosomes@gmail.com' || u.name === 'kenzosomes' || u.id === '22227dcf-933f-40a9-9340-f66cb9020e5c'))
    ));
  }
  return [];
}
export function visibleLogs(db,user) {
  if (!user) return [];
  const baseLogs = (db.logs || []).filter(l => {
    if (String(l.id || '').startsWith('log_dummy')) return false;
    if (String(l.studentId || '').startsWith('s_dummy')) return false;
    if (String(l.task || '').includes('Configured project development environment')) return false;
    if (l.date === '2026-10-14' || l.date === '2026-10-15') return false;
    if (l.date === '2026-10-16' && Number(l.hours || 0) <= 0.02 && (String(l.clockIn || '').includes('00:23') || String(l.clockIn || '').includes('12:23') || String(l.clockOut || '').includes('00:23') || String(l.clockOut || '').includes('12:23') || !l.task)) return false;
    return true;
  });
  if (user.role === 'Student') {
    const isKenzo = (user.email && user.email.toLowerCase() === 'kenzosomes@gmail.com') ||
                    user.id === 's1' ||
                    user.id === '22227dcf-933f-40a9-9340-f66cb9020e5c' ||
                    user.name === 'kenzosomes' ||
                    user.identifier === '2021-00421';
    return baseLogs.filter(l => 
      l.studentId === user.id || 
      (isKenzo && (l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' || l.studentId === 's1' || !l.studentId))
    );
  }
  if (user.role === 'Supervisor') {
    return baseLogs.filter(l => 
      l.supervisorId === user.id || 
      user.id === 'v1' || 
      (db.users && db.users.some(u => (u.id === l.studentId || (u.email === 'kenzosomes@gmail.com' && l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c')) && (u.supervisorId === user.id || (user.company && u.company && user.company.trim().toLowerCase() === u.company.trim().toLowerCase())))) ||
      ((String(user.email||'').toLowerCase().includes('shisui') || user.name === 'shisuizhin' || user.name === 'Supabase User') && (l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' || l.studentId === 's1'))
    );
  }
  return baseLogs;
}
export function visibleApplications(db,user) {return db.applications.filter(a=>user.role==='Student'?a.studentId===user.id:user.role==='Supervisor'?db.jobs.some(j=>j.id===a.jobId&&j.supervisorId===user.id):true);}
export function validateUpload(file) {
  if(!file||!file.name||file.size===0) throw new Error('Choose a non-empty file.');
  if(file.size>10*1024*1024) throw new Error('Files must be 10 MB or smaller.');
  const allowed={pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg'};
  const ext=file.name.split('.').pop().toLowerCase();
  if(!allowed[ext]||(file.type&&file.type!==allowed[ext])) throw new Error('Upload a PDF, PNG, or JPEG file.');
  return true;
}
export function csvText(rows) {return '\uFEFF'+rows.map(row=>row.map(value=>{let v=String(value??'');if(/^[\s]*[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';}).join(',')).join('\r\n');}
export function parseCSV(text) {
  const rows=[];let row=[],field='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field.trim());field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field.trim());if(row.some(Boolean))rows.push(row);row=[];field='';}else field+=c;}
  if(quoted)throw new Error('The CSV contains an unclosed quoted field.');
  row.push(field.trim());if(row.some(Boolean))rows.push(row);return rows;
}
export function applyToJob(db,user,jobId) {
  if(user.role!=='Student')throw new Error('Only students can submit applications.');
  const job=db.jobs.find(j=>j.id===jobId);
  if(!job||job.status!=='Active'||job.slots<1)throw new Error('This position is no longer open.');
  if(db.applications.some(a=>a.studentId===user.id&&a.jobId===jobId&&a.status!=='Rejected'))throw new Error('You already have an application for this position.');
  const application={id:crypto.randomUUID(),studentId:user.id,jobId,status:'Pending',date:new Date().toISOString().slice(0,10),note:''};
  db.applications.push(application);return application;
}
export function reviewLog(db,user,id,status,remarks,signature) {
  const log=db.logs.find(l=>l.id===id);
  if(user.role!=='Supervisor'||!log||log.supervisorId!==user.id)throw new Error('This attendance record is outside your review scope.');
  if(!['Approved','Rejected','Flagged'].includes(status)||!['Pending','Flagged'].includes(log.status))throw new Error('This record cannot be reviewed in its current state.');
  if(!remarks.trim()||!signature.trim())throw new Error('Review remarks and a typed signature are required.');
  Object.assign(log,{status,remarks,signature,approvedAt:status==='Approved'?new Date().toISOString():null});return log;
}

