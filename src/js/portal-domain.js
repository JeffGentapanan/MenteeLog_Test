import {approvedHours,reviewLog,csvText,parseCSV} from './domain.js';

export function candidateImport(db,text){
  const rows=parseCSV(text),header=rows.shift()?.map(v=>v.toLowerCase().replace(/[ _-]/g,''));
  const aliases={identifier:['identifier','srcode'],name:['name','fullname'],email:['email','emailaddress'],course:['course','program']};
  const positions=Object.fromEntries(Object.entries(aliases).map(([key,aliases])=>[key,header?.findIndex(h=>aliases.includes(h))??-1]));
  if(Object.values(positions).some(n=>n<0))throw new Error('Required CSV headers: identifier, name, email, course.');
  if(rows.length<1||rows.length>5000)throw new Error('Import between 1 and 5,000 candidates.');
  const ids=new Set(db.users.map(u=>u.identifier.toLowerCase())),emails=new Set(db.users.map(u=>u.email.toLowerCase()));
  return rows.map((row,i)=>{const value=Object.fromEntries(Object.entries(positions).map(([key,index])=>[key,row[index]||'']));if(Object.values(value).some(s=>!s||s.length>150)||!/^\S+@\S+\.\S+$/.test(value.email))throw new Error('Missing or invalid value on CSV row '+(i+2)+'.');if(ids.has(value.identifier.toLowerCase())||emails.has(value.email.toLowerCase()))throw new Error('Duplicate identifier or email on CSV row '+(i+2)+'.');ids.add(value.identifier.toLowerCase());emails.add(value.email.toLowerCase());return {...value,id:crypto.randomUUID(),role:'Student',status:'Pending_Activation',badge:'Pre_Seeded',baseHours:0,requiredHours:db.program.requiredHours,company:'',supervisorId:null};});
}

export function reviewBatch(db,user,ids,status,remarks,signature){
  const unique=[...new Set(ids)];
  if(!unique.length)throw new Error('Select at least one attendance record.');
  // Validate on copies first so a stale or out-of-scope record cannot partially approve a batch.
  const scratch={...db,logs:db.logs.map(l=>({...l}))};
  unique.forEach(id=>reviewLog(scratch,user,id,status,remarks,signature));
  unique.forEach(id=>Object.assign(db.logs.find(l=>l.id===id),scratch.logs.find(l=>l.id===id)));
  return unique.map(id=>db.logs.find(l=>l.id===id));
}

export function assignPlacement(db,user,ids,jobId,requiredHours){
  if(user.role!=='Coordinator')throw new Error('Coordinator access required.');
  const j=db.jobs.find(j=>j.id===jobId&&j.status==='Active');
  const supervisor=j&&db.users.find(u=>u.id===j.supervisorId&&u.role==='Supervisor'&&u.status==='Active'&&u.company===j.company);
  const students=[...new Set(ids)].map(id=>db.users.find(u=>u.id===id&&u.role==='Student'));
  if(!j||!supervisor)throw new Error('Choose an active position with an assigned company supervisor.');
  if(!students.length||students.some(s=>!s||s.company||db.applications.some(a=>a.studentId===s.id&&a.status==='Accepted')))throw new Error('Select unassigned students only.');
  if(students.length>j.slots)throw new Error('There are not enough available slots for this batch.');
  const hours=Number(requiredHours);if(!Number.isInteger(hours)||hours<1||hours>2000)throw new Error('Required hours must be between 1 and 2,000.');
  students.forEach(s=>{Object.assign(s,{company:j.company,supervisorId:supervisor.id,requiredHours:hours,badge:'Enrolled'});const a=db.applications.find(a=>a.studentId===s.id&&a.jobId===j.id);if(a) a.status='Accepted';});
  j.slots-=students.length;return students;
}

export function reportRows(db,type,filters={}){
  const students=db.users.filter(u=>u.role==='Student'&&(!filters.course||filters.course==='All'||u.course===filters.course));
  if(type==='hte')return [['Company','Industry','Status','MOA expiry','Interns'],...db.htes.map(h=>[h.name,h.industry,h.status,h.expiry,students.filter(s=>s.company===h.name).length])];
  if(type==='compliance')return [['Student','Date','Hours','Status','Remarks'],...db.logs.filter(l=>students.some(s=>s.id===l.studentId)&&(!filters.from||l.date>=filters.from)&&(!filters.to||l.date<=filters.to)).map(l=>[students.find(s=>s.id===l.studentId).name,l.date,l.hours,l.status,l.remarks||''])];
  if(type==='completion')return [['Student','SR code','Approved hours','Required hours','Completion'],...students.map(s=>[s.name,s.identifier,approvedHours(db,s.id),s.requiredHours,Math.round(approvedHours(db,s.id)/s.requiredHours*100)+'%'])];
  return [['Student','SR code','Program','HTE','Status'],...students.map(s=>[s.name,s.identifier,s.course,s.company||'Unassigned',s.badge])];
}

// Small text PDF writer for locally generated reports. All content is escaped and paginated.
export function reportPDF(title,rows){
  const plain=s=>String(s??'').normalize('NFKD').replace(/[^\x20-\x7E]/g,' ').replace(/[\\()]/g,'\\$&');
  const lines=[title,'MenteeLog - frontend demonstration report','Generated '+new Date().toISOString().slice(0,10),'',...rows.flatMap(row=>{const s=row.map(v=>String(v??'')).join(' | ');return s.match(/.{1,110}/g)||[''];})];
  const pages=[];for(let i=0;i<lines.length;i+=44)pages.push(lines.slice(i,i+44));
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  const kids=[];
  for(const lines of pages){const pageId=objects.length+1,streamId=pageId+1;kids.push(pageId+' 0 R');const stream='BT /F1 9 Tf 40 790 Td 16 TL '+lines.map((l,i)=>(i?'T* ':'')+'('+plain(l)+') Tj').join('\n')+' ET';objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${streamId} 0 R >>`,`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);}
  objects[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
  let output='%PDF-1.4\n';const offsets=[0];objects.forEach((obj,i)=>{offsets.push(output.length);output+=`${i+1} 0 obj\n${obj}\nendobj\n`;});const start=output.length;output+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;return output;
}
export function reportFile(report,format='PDF'){return format==='PDF'?{name:report.title+'.pdf',content:reportPDF(report.title,report.rows),type:'application/pdf'}:{name:report.title+'.csv',content:csvText(report.rows),type:'text/csv;charset=utf-8'};}

