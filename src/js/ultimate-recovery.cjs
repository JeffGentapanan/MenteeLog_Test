const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';

// 1. Write the clean CSS classes back into styles.css (removing old if any)
let cssContent = fs.readFileSync(cssPath, 'utf8');
const customStart = cssContent.indexOf('/* OJT PLACEMENT MOCKUP STYLES */');
if (customStart > -1) {
  cssContent = cssContent.substring(0, customStart);
}

const newCSS = `
/* OJT PLACEMENT MOCKUP STYLES */
.ojt-filter { border-radius: 20px !important; font-size: 13px !important; font-weight: 600 !important; padding: 6px 16px !important; border: 1px solid #1E293B !important; color: #1E293B !important; background: transparent !important; }
.ojt-filter.active { background: #4A1521 !important; color: #fff !important; border-color: #4A1521 !important; }
.mb32 { margin-bottom: 32px !important; }

.ojt-job-card { background: #EAE3D4 !important; border: none !important; padding: 0 !important; overflow: hidden !important; border-radius: 16px !important; margin-bottom: 24px !important; box-shadow: none !important; }
.ojt-job-card-inner { padding: 24px 32px !important; }
.ojt-job-avatar { width: 48px !important; height: 48px !important; border-radius: 12px !important; font-size: 20px !important; font-weight: 700 !important; background: #4A1521 !important; color: #fff !important; display: flex !important; align-items: center !important; justify-content: center !important; }
.ojt-job-title { margin: 0 0 4px !important; font-size: 20px !important; color: #4A1521 !important; }
.ojt-job-company { margin: 0 !important; color: #475569 !important; font-weight: 500 !important; }
.ojt-job-badge { background: #FAF4E8 !important; padding: 6px 12px !important; border-radius: 16px !important; font-size: 11px !important; font-weight: 700 !important; color: #475569 !important; }
.ojt-job-meta { font-weight: 600 !important; font-size: 13px !important; color: #475569 !important; gap: 16px !important; margin: 16px 0 !important; }
.ojt-job-skill { padding: 4px 12px !important; border-radius: 16px !important; border: 1px solid #475569 !important; font-size: 12px !important; color: #475569 !important; font-weight: 600 !important; }
.ojt-job-footer { border-top: 1px solid rgba(0,0,0,0.05) !important; padding-top: 16px !important; margin-top: 24px !important; }
.ojt-job-apply-btn { width: 100% !important; border-radius: 0 0 16px 16px !important; height: 56px !important; font-size: 16px !important; font-weight: 700 !important; background: #4A1521 !important; color: #fff !important; border: none !important; cursor: pointer !important; }
.ojt-job-applied-btn { width: 100% !important; border-radius: 0 0 16px 16px !important; height: 56px !important; font-size: 16px !important; font-weight: 700 !important; background: #58111A !important; color: #fff !important; border: none !important; display: flex !important; align-items: center !important; justify-content: center !important; text-decoration: none !important; }

.ojt-detail-main { background: #F2ECE4 !important; border: none !important; padding: 32px !important; box-shadow: none !important; }
.ojt-detail-avatar { width: 56px !important; height: 56px !important; border-radius: 12px !important; font-size: 24px !important; font-weight: 700 !important; background: var(--burgundy) !important; color: #fff !important; display: flex !important; align-items: center !important; justify-content: center !important; }
.ojt-detail-title { margin: 0 0 4px !important; font-size: 24px !important; color: #4A1521 !important; }
.ojt-detail-desc { background: #EBE3D5 !important; border: none !important; padding: 32px !important; box-shadow: none !important; }
.ojt-side-card { background: #EBE3D5 !important; border: none !important; box-shadow: none !important; margin-bottom: 24px !important; padding: 24px !important; }

.ojt-modal-profile { background: #EAE3D4 !important; padding: 20px !important; border-radius: 12px !important; margin-bottom: 24px !important; }
.ojt-modal-resume { background: #EAE3D4 !important; border: 1px solid #4A1521 !important; border-radius: 8px !important; padding: 12px 16px !important; display: flex !important; justify-content: space-between !important; align-items: center !important; }
`;
fs.writeFileSync(cssPath, cssContent + '\n' + newCSS, 'utf8');

// 2. Rewrite jobs() exactly
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
          
          <section class="card premium-card ojt-side-card">
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

          <section class="card premium-card ojt-side-card">
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
    \`<div class="row wrap gap-8 \${c.view.more?'mb16':'mb32'}">
        \${['All','BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu'].map(s=>b(s,'ref-course',s,c.view.course===s||c.view.mode===s?'ojt-filter active':'ojt-filter')).join('')}
        \${b('+ More Filters','ref-more-filters','',c.view.more?'ojt-filter active':'ojt-filter')}
      </div>
      \${c.view.more?panel('Filter Opportunities',form(\`<div class="grid-2">\${sel('Program','course',['All','BS Computer Science','BS Information Technology','BS Computer Engineering'],c.view.course)}\${sel('Location','mode',['All',...new Set(db().jobs.map(j=>j.location))],c.view.mode)}</div>\`,v=>{c.view.course=v.course;c.view.mode=v.mode;c.render();},'Apply Filters'), 'mb32'):''}
      \` : tabs([['','Active Slots'],['archived','Archived Slots']]))+(list.length?(isStudent?list.map(j=>{const applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===j.id&&a.status!=='Rejected');return \`
      <article class="ojt-job-card">
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
             \${nav('View Details','jobs','detail',j.id,'btn secondary small')}
          </div>
        </div>
        \${applied? nav('Application Submitted — View Details','jobs','detail',j.id,'ojt-job-applied-btn') : 
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
          <textarea name="note" class="textarea" style="height:120px; resize:none;" placeholder="Introduce yourself and share why you are interested in this position..."></textarea>
        </div>\`,
        async(v,form)=>{const a=applyToJob(db(),u(),id);a.note=v.note;if(j.supervisorId)c.notify(j.supervisorId,'Application_Status','New internship application',u().name+' applied for '+j.title);finish('Application submitted successfully.','jobs');},'Confirm Application');
        return true;}
`;

const jobsStart = jsContent.indexOf('function jobs(){');
const jobsEnd = jsContent.indexOf('function incidents(){');
if (jobsStart > -1 && jobsEnd > -1) {
  // Use actual newline characters, NEVER \\n
  jsContent = jsContent.substring(0, jobsStart) + cleanJobsFunc + '\n\n  ' + jsContent.substring(jobsEnd);
}

const modalStart = jsContent.indexOf("if(name==='ref-apply'){");
if(modalStart > -1) {
  const modalEnd = jsContent.indexOf("return true;}", modalStart) + 13;
  jsContent = jsContent.substring(0, modalStart) + cleanModal + jsContent.substring(modalEnd);
}

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Restored perfect structure via ultimate-recovery.cjs');
