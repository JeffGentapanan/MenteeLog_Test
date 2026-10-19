const fs = require('fs');

// 1. Write the CSS classes to styles.css
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `
/* OJT PLACEMENT MOCKUP STYLES */
.ojt-placement-dir .filter-pills .btn {
  border-radius: 20px; font-size: 13px; font-weight: 600; padding: 6px 16px;
  border: 1px solid #1E293B; color: #1E293B; background: transparent;
}
.ojt-job-card {
  background: #EAE3D4; border: none; padding: 0; overflow: hidden; border-radius: 16px; margin-bottom: 24px; box-shadow: none;
}
.ojt-job-card-inner { padding: 24px 32px; }
.ojt-job-avatar {
  width: 48px; height: 48px; border-radius: 12px; font-size: 20px; font-weight: 700;
  background: #4A1521; color: #fff; display: flex; align-items: center; justify-content: center;
}
.ojt-job-title { margin: 0 0 4px; font-size: 20px; color: #4A1521; }
.ojt-job-company { margin: 0; color: #475569; font-weight: 500; }
.ojt-job-badge { background: #FAF4E8; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 700; color: #475569; }
.ojt-job-meta { font-weight: 600; font-size: 13px; color: #475569; gap: 16px; margin: 16px 0; }
.ojt-job-skill { padding: 4px 12px; border-radius: 16px; border: 1px solid #475569; font-size: 12px; color: #475569; font-weight: 600; }
.ojt-job-footer { border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; margin-top: 24px; }
.ojt-job-apply-btn { width: 100%; border-radius: 0; height: 56px; font-size: 16px; font-weight: 700; background: #4A1521; color: #fff; border: none; cursor: pointer; }
.ojt-job-applied { background: #58111A; color: #fff; padding: 16px; text-align: center; font-weight: 700; }

.ojt-detail-main { background: #F2ECE4; border: none; padding: 32px; box-shadow: none; }
.ojt-detail-avatar { width: 56px; height: 56px; border-radius: 12px; font-size: 24px; font-weight: 700; background: var(--burgundy); color: #fff; display: flex; align-items: center; justify-content: center; }
.ojt-detail-title { margin: 0 0 4px; font-size: 24px; color: #4A1521; }
.ojt-detail-desc { background: #EBE3D5; border: none; padding: 32px; box-shadow: none; }
.ojt-side-card { background: #EBE3D5; border: none; box-shadow: none; }

.ojt-modal-profile { background: #EAE3D4; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
.ojt-modal-resume { background: #EAE3D4; border: 1px solid #4A1521; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
`;
if(!cssContent.includes('.ojt-job-card')) {
  fs.writeFileSync(cssPath, cssContent + '\\n' + newCSS, 'utf8');
}

// 2. Rewrite portal-views.js using ONLY these classes (NO inline styles)
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

const cleanJobsFunc = `function jobs(){const {sub,id}=r();const isStudent=u().role==='Student';
    if(sub==='edit'||sub==='restore'){job(id);return back('jobs')+ \`<div class="ref-form-narrow">\${legacyForm(()=>c.legacy.editJob(id))}</div>\`;}
    if(sub==='detail'){
      const j=job(id),applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===id&&a.status!=='Rejected');
      return back('jobs',isStudent?'Back to OJT Placement':'Back to Slots')+ \`
      <div class="dashboard-grid-modern mt24">
        <div class="dash-main">
          <section class="card premium-card ojt-detail-main">
             <div class="row between align-start mb24">
               <div class="row align-start gap-16">
                 <div class="ojt-detail-avatar">\${e(j.company.slice(0,2))}</div>
                 <div>
                   <h1 class="ojt-detail-title">\${e(j.company)}</h1>
                   <p class="muted">\${icon('pin')} \${e(j.location)}</p>
                 </div>
               </div>
               <div class="row gap-8">
                 <span class="badge">CHED Accredited</span>
                 <span class="badge">Active MOA</span>
               </div>
             </div>
             
             <h2>\${e(j.title)}</h2>
             <div class="row gap-16 mb24 ojt-job-meta">
               <span>\${icon('briefcase')} \${e(j.department||'Technology')}</span>
               <span>\${icon('users')} \${j.slots} slots left</span>
               <span style="color:#D97706;">\${icon('star')} 4.9</span>
             </div>
             
             <p class="small mb8"><strong>REQUIRED SKILLS & TECH STACK</strong></p>
             <div class="row wrap gap-8">
               \${j.skills.split(',').map(s=>\`<span class="ojt-job-skill">\${e(s.trim())}</span>\`).join('')}
             </div>
          </section>

          <section class="card premium-card ojt-detail-desc mt24">
             <h2>Position Description</h2>
             <p class="mb24">\${e(j.description)}</p>
             
             <h2>Requirements</h2>
             <ul>
               \${j.specs.split('\\n').map(l=> l.trim() ? \`<li>\${e(l.replace(/^[\\-•*]\\s*/,''))}</li>\` : '').join('')}
             </ul>
          </section>
        </div>
        
        <div class="dash-side">
          <section class="card premium-card ojt-side-card">
             <h3>Interested in this position?</h3>
             \${isStudent?(applied?nav('View Application','applications','','','btn primary full'):b('Apply to this Position','ref-apply',id,'btn primary full')):nav('Edit Details','jobs','edit',id,'secondary full')+b(j.status==='Closed'?'Restore Position':'Deactivate Slot','ref-job-status',id,'full')}
             <p class="small muted mt16 text-center">Applying automatically forwards your verified MenteeLog profile and academic endorsement.</p>
          </section>
          
          <section class="card premium-card ojt-side-card mt24">
             <h3>Company Information</h3>
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

          <section class="card premium-card ojt-side-card mt24">
             <h3>MOA & Accreditation</h3>
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
    \`<div class="ojt-placement-dir">
        <div class="row wrap gap-8 mb24 filter-pills">
          \${['BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu','+ More Filters'].map(s=>\`<button class="btn \${s.includes('+')?'secondary':'outline'}">\${s}</button>\`).join('')}
        </div>
      </div>\` : tabs([['','Active Slots'],['archived','Archived Slots']]))+(list.length?(isStudent?list.map(j=>{const applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===j.id&&a.status!=='Rejected');return \`
      <article class="ojt-job-card card">
        <div class="ojt-job-card-inner">
          <div class="row between align-start">
            <div class="row align-center gap-16">
              <div class="ojt-job-avatar">\${e(j.company.slice(0,2))}</div>
              <div>
                <h2 class="ojt-job-title">\${e(j.title)}</h2>
                <p class="ojt-job-company">\${e(j.company)}</p>
              </div>
            </div>
            <div class="ojt-job-badge">CHED Accredited · Active MOA</div>
          </div>
          <div class="row ojt-job-meta">
            <span>\${icon('pin')} \${e(j.location)}</span>
            <span>\${icon('briefcase')} \${e(j.courses.join(' / '))}</span>
            <span>\${icon('users')} \${j.slots} slots left</span>
            <span style="color:#D97706;">\${icon('star')} \${(Math.random()*1+4).toFixed(1)}</span>
          </div>
          <div class="row wrap gap-8">
            \${j.skills.split(',').map(s=>\`<span class="ojt-job-skill">\${e(s.trim())}</span>\`).join('')}
          </div>
          <div class="row between ojt-job-footer">
             <small class="muted">Posted 2 days ago</small>
             \${!applied?nav('View Details','jobs','detail',j.id,'btn secondary small'):''}
          </div>
        </div>
        \${applied? \`<div class="ojt-job-applied">Application Submitted</div>\` : 
        b('Apply to this Position','ref-apply',j.id,'ojt-job-apply-btn')}
      </article>\`;}).join(''):panel('',table(['Position Title','Department','Posted Date','Applicants','Status','Actions'],list.map(j=>\`<tr><td><strong>\${e(j.title)}</strong></td><td>\${e(j.department||'IT Department')}</td><td>\${date(j.createdAt||'2026-09-01')}</td><td>\${db().applications.filter(a=>a.jobId===j.id).length} applied</td><td>\${badge(j.status)}</td><td>\${nav('View','jobs','detail',j.id,'secondary small')} \${nav(sub==='archived'?'Restore':'Edit','jobs',sub==='archived'?'restore':'edit',j.id,'secondary small')}</td></tr>\`)))):panel('',empty('No positions match this view','Try another filter or search.')));
  }`;

const cleanModal = `if(name==='ref-apply'){if(u().role!=='Student')throw new Error('Student access required.');const j=job(id);
      c.showModal('Apply — '+e(j.title),
      \`<div class="ojt-modal-profile">
          <p class="small mb12"><strong>PRE-POPULATED STUDENT PROFILE</strong></p>
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
          <textarea name="note" class="textarea" style="height:120px;" placeholder="Introduce yourself and share why you are interested in this position..."></textarea>
        </div>\`,
        async(v,form)=>{const a=applyToJob(db(),u(),id);a.note=v.note;if(j.supervisorId)c.notify(j.supervisorId,'Application_Status','New internship application',u().name+' applied for '+j.title);finish('Application submitted successfully.','jobs');},'Confirm Application');
        return true;}
`;

const jobsStart = jsContent.indexOf('function jobs(){');
const jobsEnd = jsContent.indexOf('function incidents(){');
if (jobsStart > -1 && jobsEnd > -1) {
  jsContent = jsContent.substring(0, jobsStart) + cleanJobsFunc + '\\n\\n  ' + jsContent.substring(jobsEnd);
}

const modalStart = jsContent.indexOf("if(name==='ref-apply'){");
if(modalStart > -1) {
  const modalEnd = jsContent.indexOf("return true;}", modalStart) + 13;
  jsContent = jsContent.substring(0, modalStart) + cleanModal + jsContent.substring(modalEnd);
}

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Final fix applied: CSP-compliant CSS in styles.css and clean classes in portal-views.js');
