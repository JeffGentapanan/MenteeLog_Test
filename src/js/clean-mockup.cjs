const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(path, 'utf8');

const newJobsFunc = `function jobs(){const {sub,id}=r();const isStudent=u().role==='Student';
    if(sub==='edit'||sub==='restore'){job(id);return back('jobs')+ \`<div class="ref-form-narrow">\${legacyForm(()=>c.legacy.editJob(id))}</div>\`;}
    if(sub==='detail'){
      const j=job(id),applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===id&&a.status!=='Rejected');
      return back('jobs',isStudent?'Back to OJT Placement':'Back to Slots')+ \`
      <div class="dashboard-grid-modern mt24">
        <div class="dash-main">
          <section class="card premium-card">
             <div class="row between align-start mb24">
               <div class="row align-start gap-16">
                 <div class="avatar" style="width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--burgundy);color:#fff;font-size:24px;font-weight:700;">\${e(j.company.slice(0,2))}</div>
                 <div>
                   <h1 style="margin:0 0 4px;">\${e(j.company)}</h1>
                   <p class="muted" style="margin:0;">\${icon('pin')} \${e(j.location)}</p>
                 </div>
               </div>
               <div class="row gap-8">
                 \${badge('CHED Accredited')}
                 \${badge('Active MOA')}
               </div>
             </div>
             
             <h2 style="margin-bottom:12px;">\${e(j.title)}</h2>
             <div class="row gap-16 mb24 muted">
               <span>\${icon('briefcase')} \${e(j.department||'Technology')}</span>
               <span>\${icon('users')} \${j.slots} slots left</span>
               <span>\${icon('star')} 4.9</span>
             </div>
             
             <p class="small mb8" style="text-transform:uppercase; font-weight:700;">Required Skills & Tech Stack</p>
             <div class="row wrap gap-8">
               \${j.skills.split(',').map(s=>\`<span class="badge neutral">\${e(s.trim())}</span>\`).join('')}
             </div>
          </section>

          <section class="card premium-card mt24">
             <h2 style="margin-bottom:16px;">Position Description</h2>
             <p style="margin-bottom:24px;">\${e(j.description)}</p>
             
             <h2 style="margin-bottom:16px;">Requirements</h2>
             <ul style="padding-left:20px; line-height:1.6;">
               \${j.specs.split('\\n').map(l=> l.trim() ? \`<li>\${e(l.replace(/^[\\-•*]\\s*/,''))}</li>\` : '').join('')}
             </ul>
          </section>
        </div>
        
        <div class="dash-side">
          <section class="card premium-card">
             <h3 style="margin-bottom:16px;">Interested in this position?</h3>
             \${isStudent?(applied?nav('View Application','applications','','','btn primary full'):b('Apply to this Position','ref-apply',id,'primary full', '', 'style="height:48px; font-size:15px; border-radius:8px;"')):nav('Edit Details','jobs','edit',id,'secondary full')+b(j.status==='Closed'?'Restore Position':'Deactivate Slot','ref-job-status',id,'full')}
             <p class="small muted mt16 text-center">Applying automatically forwards your verified MenteeLog profile and academic endorsement.</p>
          </section>
          
          <section class="card premium-card mt24">
             <h3 style="margin-bottom:16px;">Company Information</h3>
             <hr class="hr mb16">
             <div class="mb16">
               <span class="small muted block">OJT SUPERVISOR</span>
               <strong>\${e(c.student(j.supervisorId)?.name||'Pending Assignment')}</strong>
             </div>
             <div class="mb16">
               <span class="small muted block">DEPARTMENT</span>
               <strong>\${e(j.department||'Technology - AI Delivery')}</strong>
             </div>
             <div class="mb16">
               <span class="small muted block">MAIN ADDRESS</span>
               <strong>\${e(j.location)}</strong>
             </div>
             <div>
               <span class="small muted block">CONTACT EMAIL</span>
               <strong>\${e(c.student(j.supervisorId)?.email||'careers@example.com')}</strong>
             </div>
          </section>

          <section class="card premium-card mt24">
             <h3 style="margin-bottom:16px;">MOA & Accreditation</h3>
             <hr class="hr mb16">
             <div class="mb16">
               <span class="small muted block">ACCREDITATION STATUS</span>
               <strong>CHED Accredited Host Training Establishment</strong>
             </div>
             <div class="mb16">
               <span class="small muted block">MOA VALIDITY</span>
               <strong>Active through Sept 12, 2028</strong>
             </div>
             <div>
               <span class="small muted block">OJT COORDINATOR / ADVISER</span>
               <strong>Dr. Evelyn Ramos</strong>
             </div>
          </section>
        </div>
      </div>\`;
    }
    const list=db().jobs.filter(j=>(isStudent?j.status==='Active':u().role==='Supervisor'?j.supervisorId===u().id:true)&&match(j.title,j.company,j.location,j.skills)&&(isStudent?(c.view.course==='All'||j.courses.includes(c.view.course))&&(c.view.mode==='All'||j.location.toLowerCase().includes(c.view.mode.toLowerCase())):sub==='archived'?j.status==='Closed':j.status!=='Closed'));
    return (isStudent?'':back('dashboard'))+heading(isStudent?'OJT Placement Directory':'Slot Management',isStudent?'Browse and apply to accredited host training establishments':e(u().company||'Partner companies')+' · Internship positions',isStudent?'':b('Post New Work','job-edit','','','plus'))+(isStudent?
    \`<div class="row wrap gap-8 mb24 filter-pills">
        \${['BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu','+ More Filters'].map(s=>\`<button class="btn \${s.includes('+')?'secondary':'outline'} small">\${s}</button>\`).join('')}
      </div>\` : tabs([['','Active Slots'],['archived','Archived Slots']]))+(list.length?(isStudent?list.map(j=>{const applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===j.id&&a.status!=='Rejected');return \`
      <article class="card premium-card mb24" style="padding:0; overflow:hidden;">
        <div style="padding:24px;">
          <div class="row between align-start">
            <div class="row align-center gap-16">
              <div class="avatar" style="width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--burgundy);color:#fff;font-weight:700;font-size:20px;">\${e(j.company.slice(0,2))}</div>
              <div>
                <h2 style="margin:0 0 4px">\${e(j.title)}</h2>
                <p class="muted" style="margin:0">\${e(j.company)}</p>
              </div>
            </div>
            \${badge('CHED Accredited')}
          </div>
          <div class="row gap-16 mt16 mb16 muted small">
            <span>\${icon('pin')} \${e(j.location)}</span>
            <span>🎓 \${e(j.courses.join(' / '))}</span>
            <span>👥 \${j.slots} slots left</span>
            <span>⭐ \${(Math.random()*1+4).toFixed(1)}</span>
          </div>
          <div class="row wrap gap-8">
            \${j.skills.split(',').map(s=>\`<span class="badge neutral">\${e(s.trim())}</span>\`).join('')}
          </div>
          <div class="row between mt24 pt16" style="border-top:1px solid rgba(0,0,0,0.05);">
             <small class="muted">Posted 2 days ago</small>
             \${!applied?nav('View Details','jobs','detail',j.id,'btn secondary small'):''}
          </div>
        </div>
        \${applied? \`<div class="badge primary text-center" style="display:block; padding:16px; border-radius:0;">Application Submitted</div>\` : 
        b('Apply to this Position','ref-apply',j.id,'primary full', '', 'style="border-radius:0; height:56px; font-size:16px;"')}
      </article>\`;}).join(''):panel('',table(['Position Title','Department','Posted Date','Applicants','Status','Actions'],list.map(j=>\`<tr><td><strong>\${e(j.title)}</strong></td><td>\${e(j.department||'IT Department')}</td><td>\${date(j.createdAt||'2026-09-01')}</td><td>\${db().applications.filter(a=>a.jobId===j.id).length} applied</td><td>\${badge(j.status)}</td><td>\${nav('View','jobs','detail',j.id,'secondary small')} \${nav(sub==='archived'?'Restore':'Edit','jobs',sub==='archived'?'restore':'edit',j.id,'secondary small')}</td></tr>\`)))):panel('',empty('No positions match this view','Try another filter or search.')));
  }`;

const newModal = `if(name==='ref-apply'){if(u().role!=='Student')throw new Error('Student access required.');const j=job(id);
      c.showModal('Apply — '+e(j.title),
      \`<div class="card bg-sand mb24">
          <p class="small muted mb12">PRE-POPULATED STUDENT PROFILE</p>
          <div class="row between mb8"><span class="muted">Full Name</span><strong>\${e(u().name)}</strong></div>
          <div class="row between mb8"><span class="muted">Section</span><strong>\${e(u().course)}</strong></div>
          <div class="row between mb8"><span class="muted">GPA</span><strong>1.75</strong></div>
          <div class="row between"><span class="muted">Contact Email</span><strong>\${e(u().email)}</strong></div>
        </div>
        <div class="field mb16">
          <label>Resume</label>
          \${sel('Resume on file','resumeId',[['','Choose an uploaded resume'],...db().documents.filter(d=>d.studentId===u().id&&d.type==='application/pdf').map(d=>[d.id,d.name])])}
        </div>
        <div class="field">
          <label>Cover Note (optional)</label>
          <textarea name="note" style="height:120px;" placeholder="Introduce yourself and share why you are interested in this position..."></textarea>
        </div>\`,
        async(v,form)=>{const a=applyToJob(db(),u(),id);a.note=v.note;if(j.supervisorId)c.notify(j.supervisorId,'Application_Status','New internship application',u().name+' applied for '+j.title);finish('Application submitted successfully.','jobs');},'Confirm Application');
        return true;}
`;

// Extract and replace jobs()
const jobsStart = content.indexOf('function jobs(){');
const jobsEnd = content.indexOf('function incidents(){');
if (jobsStart > -1 && jobsEnd > -1) {
  content = content.substring(0, jobsStart) + newJobsFunc + '\\n\\n  ' + content.substring(jobsEnd);
}

// Extract and replace the modal
const modalStart = content.indexOf("if(name==='ref-apply'){");
if(modalStart > -1) {
  const modalEnd = content.indexOf("return true;}", modalStart) + 13;
  content = content.substring(0, modalStart) + newModal + content.substring(modalEnd);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Cleaned up inline styles, kept layout flow');
