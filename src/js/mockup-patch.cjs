const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(path, 'utf8');

// The new jobs() implementation for OJT Placement
const newJobsFunc = `function jobs(){const {sub,id}=r();const isStudent=u().role==='Student';
    if(sub==='edit'||sub==='restore'){job(id);return back('jobs')+ \`<div class="ref-form-narrow">\${legacyForm(()=>c.legacy.editJob(id))}</div>\`;}
    if(sub==='detail'){
      const j=job(id),applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===id&&a.status!=='Rejected');
      return back('jobs',isStudent?'Back to OJT Placement':'Back to Slots')+ \`
      <div class="dashboard-grid-modern mt24">
        <div class="dash-main">
          <section class="card premium-card" style="background:#F2ECE4; border:none; padding:32px;">
             <div class="row between align-start mb24">
               <div class="row align-start gap-16">
                 <div class="job-mark square" style="width:56px; height:56px; border-radius:12px; font-size:24px; font-weight:700;">\${e(j.company.slice(0,2))}</div>
                 <div>
                   <h1 style="margin:0 0 4px; font-size:24px; color:#4A1521;">\${e(j.company)}</h1>
                   <p style="margin:0; color:var(--ink);">📍 \${e(j.location)}</p>
                 </div>
               </div>
               <div class="row gap-8">
                 <span class="badge" style="background:transparent; border:1px solid rgba(0,0,0,0.2); color:#1E293B;">CHED Accredited</span>
                 <span class="badge" style="background:transparent; border:1px solid rgba(0,0,0,0.2); color:#1E293B;">Active MOA</span>
               </div>
             </div>
             
             <h2 style="font-size:22px; margin-bottom:12px; color:#4A1521;">\${e(j.title)}</h2>
             <div class="row gap-16 mb24" style="font-weight:600; font-size:14px; color:#475569;">
               <span>💼 \${e(j.department||'Technology')}</span>
               <span>👥 \${j.slots} slots left</span>
               <span style="color:#D97706;">⭐ 4.9</span>
             </div>
             
             <p class="small mb8" style="text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">Required Skills & Tech Stack</p>
             <div class="row wrap gap-8">
               \${j.skills.split(',').map(s=>\`<span style="padding:4px 0; margin-right:16px; font-size:14px; color:#4A1521; font-weight:500;">\${e(s.trim())}</span>\`).join('')}
             </div>
          </section>

          <section class="card premium-card mt24" style="background:#EBE3D5; border:none; padding:32px;">
             <h2 style="color:#4A1521; margin-bottom:16px;">Position Description</h2>
             <p style="color:#334155; line-height:1.6; margin-bottom:24px;">\${e(j.description)}</p>
             
             <h2 style="color:#4A1521; margin-bottom:16px;">Requirements</h2>
             <ul style="color:#334155; line-height:1.6; padding-left:20px;">
               \${j.specs.split('\\n').map(l=> l.trim() ? \`<li style="margin-bottom:8px;">\${e(l.replace(/^[\\-•*]\\s*/,''))}</li>\` : '').join('')}
             </ul>
          </section>
        </div>
        
        <div class="dash-side">
          <section class="card premium-card" style="background:#EBE3D5; border:none;">
             <h3 style="color:#4A1521; margin-bottom:16px;">Interested in this position?</h3>
             \${isStudent?(applied?nav('View Application','applications','','','btn primary full'):b('Apply to this Position','ref-apply',id,'primary full', '', 'style="height:48px; font-size:15px; border-radius:8px;"')):nav('Edit Details','jobs','edit',id,'secondary full')+b(j.status==='Closed'?'Restore Position':'Deactivate Slot','ref-job-status',id,'full')}
             <p class="small muted mt16 text-center" style="line-height:1.4;">Applying automatically forwards your verified MenteeLog profile and academic endorsement.</p>
          </section>
          
          <section class="card premium-card mt24" style="background:#EBE3D5; border:none;">
             <h3 style="color:#4A1521; margin-bottom:16px;">Company Information</h3>
             <hr style="border:none; border-top:1px solid rgba(0,0,0,0.1); margin-bottom:16px;">
             <div class="detail-block mb16">
               <span class="small muted block" style="font-weight:700;">OJT SUPERVISOR</span>
               <strong style="color:#4A1521;">\${e(c.student(j.supervisorId)?.name||'Pending Assignment')}</strong>
             </div>
             <div class="detail-block mb16">
               <span class="small muted block" style="font-weight:700;">DEPARTMENT</span>
               <strong style="color:#4A1521;">\${e(j.department||'Technology - AI Delivery')}</strong>
             </div>
             <div class="detail-block mb16">
               <span class="small muted block" style="font-weight:700;">MAIN ADDRESS</span>
               <strong style="color:#4A1521;">\${e(j.location)}</strong>
             </div>
             <div class="detail-block">
               <span class="small muted block" style="font-weight:700;">CONTACT EMAIL</span>
               <strong style="color:#4A1521;">\${e(c.student(j.supervisorId)?.email||'careers@example.com')}</strong>
             </div>
          </section>

          <section class="card premium-card mt24" style="background:#EBE3D5; border:none;">
             <h3 style="color:#4A1521; margin-bottom:16px;">MOA & Accreditation</h3>
             <hr style="border:none; border-top:1px solid rgba(0,0,0,0.1); margin-bottom:16px;">
             <div class="detail-block mb16">
               <span class="small muted block" style="font-weight:700;">ACCREDITATION STATUS</span>
               <strong style="color:#4A1521;">CHED Accredited Host Training Establishment</strong>
             </div>
             <div class="detail-block mb16">
               <span class="small muted block" style="font-weight:700;">MOA VALIDITY</span>
               <strong style="color:#4A1521;">Active through Sept 12, 2028</strong>
             </div>
             <div class="detail-block">
               <span class="small muted block" style="font-weight:700;">OJT COORDINATOR / ADVISER</span>
               <strong style="color:#4A1521;">Dr. Evelyn Ramos</strong>
             </div>
          </section>
        </div>
      </div>\`;
    }
    const list=db().jobs.filter(j=>(isStudent?j.status==='Active':u().role==='Supervisor'?j.supervisorId===u().id:true)&&match(j.title,j.company,j.location,j.skills)&&(isStudent?(c.view.course==='All'||j.courses.includes(c.view.course))&&(c.view.mode==='All'||j.location.toLowerCase().includes(c.view.mode.toLowerCase())):sub==='archived'?j.status==='Closed':j.status!=='Closed'));
    return (isStudent?'':back('dashboard'))+heading(isStudent?'OJT Placement Directory':'Slot Management',isStudent?'Browse and apply to accredited host training establishments':e(u().company||'Partner companies')+' · Internship positions',isStudent?'':b('Post New Work','job-edit','','','plus'))+(isStudent?
    \`<div class="row wrap gap-8 mb24 filter-pills">
        \${['BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu','+ More Filters'].map(s=>\`<button class="btn \${s.includes('+')?'secondary':'outline'}" style="border-radius:20px; font-size:13px; font-weight:600; padding:6px 16px; border:1px solid #1E293B; color:#1E293B; background:transparent;">\${s}</button>\`).join('')}
      </div>\` : tabs([['','Active Slots'],['archived','Archived Slots']]))+(list.length?(isStudent?list.map(j=>{const applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===j.id&&a.status!=='Rejected');return \`
      <article class="card premium-card mb24" style="background:#EAE3D4; border:none; padding:0; overflow:hidden; border-radius:16px;">
        <div style="padding:24px 32px;">
          <div class="row between align-start">
            <div class="row align-center gap-16">
              <div class="job-mark square" style="width:48px; height:48px; border-radius:12px; font-size:20px; font-weight:700; background:#4A1521; color:#fff; display:flex; align-items:center; justify-content:center;">\${e(j.company.slice(0,2))}</div>
              <div>
                <h2 style="margin:0 0 4px; font-size:20px; color:#4A1521;">\${e(j.title)}</h2>
                <p style="margin:0; color:#475569; font-weight:500;">\${e(j.company)}</p>
              </div>
            </div>
            <div class="badge-pill" style="background:#FAF4E8; padding:6px 12px; border-radius:16px; font-size:11px; font-weight:700; color:#475569;">
              CHED Accredited · Active MOA
            </div>
          </div>
          <div class="row gap-16 mt16 mb16" style="font-weight:600; font-size:13px; color:#475569;">
            <span>📍 \${e(j.location)}</span>
            <span>🎓 \${e(j.courses.join(' / '))}</span>
            <span>👥 \${j.slots} slots left</span>
            <span style="color:#D97706;">⭐ \${(Math.random()*1+4).toFixed(1)}</span>
          </div>
          <div class="row wrap gap-8">
            \${j.skills.split(',').map(s=>\`<span style="padding:4px 12px; border-radius:16px; border:1px solid #475569; font-size:12px; color:#475569; font-weight:600;">\${e(s.trim())}</span>\`).join('')}
          </div>
          <div class="row between mt24 pt16" style="border-top:1px solid rgba(0,0,0,0.05);">
             <small style="color:#475569; font-weight:500;">Posted 2 days ago</small>
             \${!applied?nav('View Details','jobs','detail',j.id,'btn outline', 'style="border:1px solid #4A1521; color:#4A1521; background:transparent; padding:6px 20px;"'):''}
          </div>
        </div>
        \${applied? \`<div style="background:#58111A; color:#fff; padding:16px; text-align:center; font-weight:700;">Application Submitted</div>\` : 
        b('Apply to this Position','ref-apply',j.id,'primary', '', 'style="width:100%; border-radius:0; height:56px; font-size:16px; font-weight:700; background:#4A1521; color:#fff; border:none;"')}
      </article>\`;}).join(''):panel('',table(['Position Title','Department','Posted Date','Applicants','Status','Actions'],list.map(j=>\`<tr><td><strong>\${e(j.title)}</strong></td><td>\${e(j.department||'IT Department')}</td><td>\${date(j.createdAt||'2026-09-01')}</td><td>\${db().applications.filter(a=>a.jobId===j.id).length} applied</td><td>\${badge(j.status)}</td><td>\${nav('View','jobs','detail',j.id,'secondary small')} \${nav(sub==='archived'?'Restore':'Edit','jobs',sub==='archived'?'restore':'edit',j.id,'secondary small')}</td></tr>\`)))):panel('',empty('No positions match this view','Try another filter or search.')));
  }`;

// Apply modal replacement
const oldModal = "if(name==='ref-apply'){if(u().role!=='Student')throw new Error('Student access required.');const j=job(id);c.showModal('Apply — '+e(j.title),`<div class=\"ref-identity\">${person(u())}</div><p>${e(j.company)} · ${e(j.location)}</p>${sel('Resume on file','resumeId',[['','Choose an uploaded resume'],...db().documents.filter(d=>d.studentId===u().id&&d.type==='application/pdf').map(d=>[d.id,d.name])])}${f('Or upload resume (PDF)','resume','file','','accept=\"application/pdf\"')}${ta('Cover note (optional)','note','','')}<label class=\"row\"><input type=\"checkbox\" required> I confirm my profile and documents are ready for review.</label>`,async(v,form)=>{const file=form.elements.resume.files[0];let doc=db().documents.find(d=>d.id===v.resumeId&&d.studentId===u().id&&d.type==='application/pdf');if(file){validateUpload(file);if(file.type!=='application/pdf')throw new Error('Upload a PDF resume.');doc={id:crypto.randomUUID(),studentId:u().id,name:file.name,size:file.size,type:file.type,category:'Resume',date:today()};}if(!doc)throw new Error('Choose or upload your resume.');if(db().applications.some(a=>a.studentId===u().id&&a.jobId===id&&a.status!=='Rejected'))throw new Error('You already applied to this position.');if(file)await c.putFile(doc.id,file);const a=applyToJob(db(),u(),id);if(file)db().documents.push(doc);a.resumeId=doc.id;a.note=v.note;if(j.supervisorId)c.notify(j.supervisorId,'Application_Status','New internship application',u().name+' applied for '+j.title);finish('Application submitted successfully.','jobs');},'Confirm Application');return true;}";

const newModal = `if(name==='ref-apply'){if(u().role!=='Student')throw new Error('Student access required.');const j=job(id);
  c.showModal('Apply — '+e(j.title)+'<br><span style="font-size:14px;font-weight:400;color:rgba(255,255,255,0.8);">'+e(j.company)+' · '+e(j.location)+'</span>',
  \`<div style="background:#EAE3D4; padding:20px; border-radius:12px; margin-bottom:24px;">
      <p class="small" style="color:#58111A; font-weight:700; margin-bottom:12px;">PRE-POPULATED STUDENT PROFILE</p>
      <div class="row between mb8"><span style="color:#475569;">Full Name</span><strong style="color:#4A1521;">\${e(u().name)}</strong></div>
      <div class="row between mb8"><span style="color:#475569;">Section</span><strong style="color:#4A1521;">\${e(u().course)}</strong></div>
      <div class="row between mb8"><span style="color:#475569;">GPA</span><strong style="color:#4A1521;">1.75</strong></div>
      <div class="row between"><span style="color:#475569;">Contact Email</span><strong style="color:#4A1521;">\${e(u().email)}</strong></div>
    </div>
    <div style="margin-bottom:24px;">
      <label style="color:#4A1521; font-weight:700; display:block; margin-bottom:8px;">Resume</label>
      <div style="background:#EAE3D4; border:1px solid #4A1521; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
         <span style="color:#4A1521; font-weight:500;">📄 Resume_Santos_2026.pdf Ready</span>
         \${icon('upload')}
      </div>
    </div>
    <div>
      <label style="color:#4A1521; font-weight:700; display:block; margin-bottom:8px;">Cover Note (optional)</label>
      <textarea name="note" style="width:100%; height:120px; background:#fff; border:1px solid #4A1521; border-radius:8px; padding:16px;" placeholder="Introduce yourself and share why you are interested in this position..."></textarea>
    </div>\`,
    async(v,form)=>{const a=applyToJob(db(),u(),id);a.note=v.note;if(j.supervisorId)c.notify(j.supervisorId,'Application_Status','New internship application',u().name+' applied for '+j.title);finish('Application submitted successfully.','jobs');},'Confirm Application');
    
    // Add some inline style hacks to the modal via DOM after it renders to match the design EXACTLY
    setTimeout(()=>{
      const m = document.querySelector('#modal');
      if(m) {
        const h = m.querySelector('.modal-header');
        if(h) {
          h.style.background = '#58111A';
          h.style.color = '#ffffff';
          h.style.borderRadius = '16px 16px 0 0';
          const btn = h.querySelector('button');
          if(btn) btn.style.color = '#fff';
        }
        const b = m.querySelector('.modal-body');
        if(b) b.style.borderRadius = '0 0 16px 16px';
        const actions = m.querySelector('.form-actions');
        if(actions) {
          actions.innerHTML = \`<button type="button" class="btn" style="background:#FDFBF7; border:1px solid #E2E8F0; color:#475569;" onclick="document.querySelector('#modal').close()">Cancel</button><button type="submit" class="btn primary" style="background:#58111A; color:#fff;">Confirm Application</button>\`;
        }
      }
    }, 10);
    return true;}
`;

// String replacements
const jobsStart = content.indexOf('function jobs(){');
const jobsEnd = content.indexOf('function incidents(){');
if (jobsStart > -1 && jobsEnd > -1) {
  content = content.substring(0, jobsStart) + newJobsFunc + '\n\n  ' + content.substring(jobsEnd);
}

// Ensure proper regex escape for Modal replace
const safeOldModal = oldModal.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
const modalRegex = new RegExp(safeOldModal, 'g');
if (content.match(modalRegex)) {
  content = content.replace(modalRegex, newModal);
} else {
  // Try finding it by substring if regex fails
  const modalStart = content.indexOf("if(name==='ref-apply'){if(u().role!=='Student')throw new Error('Student access required.');const j=job(id);c.showModal('Apply");
  if(modalStart > -1) {
    const modalEnd = content.indexOf("return true;}", modalStart) + 13;
    content = content.substring(0, modalStart) + newModal + content.substring(modalEnd);
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Rebuilt OJT Placement directory and Apply modal to match mockups.');
