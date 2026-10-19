const fs = require('fs');
const path = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/app.js';
let content = fs.readFileSync(path, 'utf8');

const newDashboardFunc = `function dashboard(u){
  const db=c.db,logs=db.logs.filter(l=>u.role==='Coordinator'||l.studentId===u.id||l.supervisorId===u.id),pending=logs.filter(l=>l.status==='Pending').length,students=u.role==='Supervisor'?visibleStudents(db,u):[];
  if(u.role==='Student'){
   const hrs=approvedHours(db,u.id),j=db.jobs.find(j=>j.id===u.jobId);
   return \`
   <div class="dashboard-hero">
      <div class="hero-content">
        <h1>Welcome back, \${e(u.name.split(' ')[0])}</h1>
        <p>Your OJT Journey Overview</p>
      </div>
      <div class="hero-actions">
         \${link('Browse Jobs', 'jobs', 'btn primary')}
         \${link('My Applications', 'applications', 'btn secondary')}
      </div>
   </div>
   <div class="dashboard-grid-modern mt24">
      <div class="dash-main">
         <section class="card premium-card">
           <div class="card-header row between">
             <h2>OJT Progress Tracking</h2>
             <span class="badge neutral">\${hrs.toFixed(1)} / \${u.requiredHours} hrs</span>
           </div>
           <div class="progress-bar-modern mt16">
             <div class="progress-fill" style="width:\${Math.min(100,hrs/u.requiredHours*100)}%"></div>
           </div>
           <div class="row between mt16">
             <small class="muted">Completion Status</small>
             <small><strong>\${Math.round((hrs/u.requiredHours)*100)}%</strong></small>
           </div>
         </section>
         <section class="card premium-card mt24">
           <div class="card-header"><h2>Current Placement Details</h2></div>
           \${u.company ? \`
             <div class="placement-details mt16">
               <div class="detail-row"><span>Host Company</span><strong>\${e(u.company)}</strong></div>
               <div class="detail-row"><span>Supervisor</span><strong>\${e(student(u.supervisorId)?.name||'Pending')}</strong></div>
               <div class="detail-row"><span>Start Date</span><strong>\${date(u.startDate)}</strong></div>
             </div>
           \` : j ? \`
             <div class="placement-details pending mt16">
               <div class="row between"><strong>\${e(j.company)}</strong>\${badge('Pending')}</div>
               <p>\${e(j.title)}</p>
               \${button('View Application','application-detail',db.applications.find(a=>a.jobId===j.id&&a.studentId===u.id)?.id,'secondary small mt16')}
             </div>
           \` : empty('No active placement','Browse accredited opportunities to begin.')}
         </section>
      </div>
      <div class="dash-side">
         <section class="card premium-card">
           <div class="card-header"><h2>Recent Notices</h2></div>
           <div class="notice-list mt16">
             \${db.incidents.length ? \`<div class="notice-item alert"><strong>Action Required</strong><p>You have unresolved incidents.</p>\${link('View Incidents','incidents','secondary small')}</div>\` : ''}
             \${db.audit.slice(0,3).map(a=>\`<div class="notice-item"><p>\${e(a.action)}</p><small>\${date(a.date)}</small></div>\`).join('') || empty('No recent notices.')}
           </div>
         </section>
      </div>
   </div>
   \`;
  }
  if(u.role==='Supervisor'){
    const evalsDue = students.filter(s=>!db.appraisals.some(a=>a.studentId===s.id)).length;
    const hrsApproved = logs.filter(l=>l.status==='Approved').reduce((s,l)=>s+l.hours,0);
    return \`
    <div class="dashboard-hero">
      <div class="hero-content">
        <h1>Supervisor Dashboard</h1>
        <p>\${e(u.company)} &bull; OJT Internship Program</p>
      </div>
      <div class="hero-actions row">
         \${button('Add Intern Slot','job-edit','','primary')}
         \${button('Send Emergency Alert','announcement','','secondary alert-btn')}
      </div>
    </div>
    <div class="stat-grid-modern mt24">
       \${stat('Active Interns', students.length, 'Currently assigned', 'users')}
       \${stat('Pending DTRs', pending, 'Awaiting approval', 'clock')}
       \${stat('Evaluations Due', evalsDue, 'Performance appraisals', 'star')}
       \${stat('Hours Approved', hrsApproved.toFixed(1)+'h', 'Total managed time', 'chart')}
    </div>
    <div class="dashboard-grid-modern mt24">
      <div class="dash-full">
         <section class="card premium-card supervisor-roster">
           <div class="card-header row between">
             <h2>Active Interns Overview</h2>
             <div class="row">
               \${link('Review Pending DTRs','dtr','btn secondary small')}
               \${link('Candidate Review','candidates','btn secondary small')}
             </div>
           </div>
           <div class="table-wrap mt16">
             \${studentTable(students,u)}
           </div>
         </section>
      </div>
    </div>
    \`;
  }
  if(u.role==='Coordinator'){
    const all=db.users.filter(s=>s.role==='Student'),placed=all.filter(s=>s.company),percent=Math.round(placed.length/Math.max(1,all.length)*100),active=db.htes.filter(h=>h.status==='Accredited').length;
    const flagged = db.logs.filter(l=>l.status==='Flagged').length;
    return \`
    <div class="dashboard-hero">
      <div class="hero-content">
        <h1>Coordinator Dashboard</h1>
        <p>College of Information Technology &bull; OJT Management Overview</p>
      </div>
    </div>
    <div class="stat-grid-modern mt24">
       \${stat('Total Students', all.length, 'Enrolled this semester', 'users')}
       \${stat('Placed Students', placed.length, percent+'% placement rate', 'check')}
       \${stat('Accredited HTEs', active, 'Active partner companies', 'building')}
       \${stat('Flagged Entries', flagged, 'Requires attention', 'alert')}
    </div>
    <div class="dashboard-grid-modern mt24">
      <div class="dash-main">
         <section class="card premium-card">
           <div class="card-header"><h2>Placement Breakdown & Progress</h2></div>
           <div class="row align-start mt16" style="gap: 32px">
             <div class="ring modern-ring">
               <svg viewBox="0 0 132 132" aria-hidden="true">
                 <circle class="track" cx="66" cy="66" r="55"/>
                 <circle class="value" cx="66" cy="66" r="55" pathLength="100" stroke-dasharray="\${percent} 100"/>
               </svg>
               <span>\${percent}%</span>
             </div>
             <div class="flex-1 w100">
               <div class="detail-row"><span>Placed Students</span><strong>\${placed.length}</strong></div>
               <div class="detail-row"><span>Unplaced Students</span><strong>\${all.length-placed.length}</strong></div>
               <hr class="hr">
               <p class="small muted mb8">Overall OJT Completion</p>
               \${progress(all.reduce((n,s)=>n+approvedHours(db,s.id),0),all.reduce((n,s)=>n+s.requiredHours,0))}
             </div>
           </div>
         </section>
      </div>
      <div class="dash-side">
         <section class="card premium-card">
           <div class="card-header"><h2>HTE Accreditation Status</h2></div>
           <div class="mt16">
             \${[['Active',active],['Pending',db.htes.filter(h=>h.status==='Pending').length],['Expiring Soon',db.htes.filter(h=>new Date(h.expiry)-Date.now()<60*86400000).length]].map(([label,n])=>\`<div class="detail-row"><span>\${label}</span><strong>\${n}</strong></div>\`).join('')}
           </div>
         </section>
         <section class="card premium-card mt24">
           <div class="card-header"><h2>Real-time Activity Feed</h2></div>
           <div class="notice-list mt16">
             \${db.audit.length?db.audit.slice(0,4).map(a=>\`<div class="notice-item"><p>\${e(a.action)}</p><small>\${date(a.date)}</small></div>\`).join(''):'<p class="small muted">No recent changes.</p>'}
           </div>
         </section>
      </div>
    </div>
    \`;
  }
}
function studentTable`;

const startIdx = content.indexOf('function dashboard(u){');
const endIdx = content.indexOf('function studentTable');

if(startIdx !== -1 && endIdx !== -1) {
  const newContent = content.substring(0, startIdx) + newDashboardFunc + content.substring(endIdx + 17);
  fs.writeFileSync(path, newContent, 'utf8');
  console.log('App.js patched successfully');
} else {
  console.log('Failed to find boundaries in app.js');
}
