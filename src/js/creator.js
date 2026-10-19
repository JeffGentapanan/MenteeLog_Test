// Public, local-preview accounts only. Production provisioning belongs to the API.
export function ensureCreatorAccounts(db) {
  const company = 'MenteeLog Demo HTE';
  const accounts = [
    {id:'creator-student',identifier:'CREATOR-STUDENT',name:'MenteeLog Creator',email:'creator.student@example.com',role:'Student',status:'Active',course:'BS Information Technology',company,supervisorId:'creator-supervisor',baseHours:0,requiredHours:500,badge:'Enrolled'},
    {id:'creator-supervisor',identifier:'creator.supervisor@example.com',name:'MenteeLog Creator',email:'creator.supervisor@example.com',role:'Supervisor',status:'Active',company},
    {id:'creator-coordinator',identifier:'CREATOR-FACULTY',name:'MenteeLog Creator',email:'creator.faculty@example.com',role:'Coordinator',status:'Active',department:'MenteeLog Project Team'}
  ];
  // Existing records and edits are preserved on reload, including suspended accounts.
  for (const account of accounts) {
    if (!db.users.some(user => user.id === account.id || user.identifier.toLowerCase() === account.identifier.toLowerCase())) db.users.push(account);
  }
  if (!db.htes.some(h=>h.id==='creator-hte')) db.htes.push({id:'creator-hte',name:company,industry:'Software & IT Services',location:'Project workspace',status:'Accredited',expiry:'2027-12-31',contact:'creator.supervisor@example.com'});
  if (!db.jobs.some(j=>j.id==='creator-job')) db.jobs.push({id:'creator-job',title:'Frontend Development Intern',company,location:'Project workspace',mode:'Remote',courses:['BS Information Technology'],slots:1,status:'Active',description:'Practice the MenteeLog student, supervisor, and coordinator workflows using local demonstration records.',specs:'Demonstration HTE and 500-hour training plan.',skills:'HTML, CSS, JavaScript',supervisorId:'creator-supervisor'});
  if (!db.applications.some(a=>a.id==='creator-application')) db.applications.push({id:'creator-application',studentId:'creator-student',jobId:'creator-job',status:'Accepted',date:'2026-09-26',note:'Creator demonstration placement.'});
  // Restore the reference tracker fixture once, without replacing existing applications.
  if (!db.referenceTrackerSeeded && db.jobs.some(job=>job.id==='j2')) {
    for (const studentId of ['s1','creator-student']) {
      if (db.users.some(user=>user.id===studentId) && !db.applications.some(a=>a.studentId===studentId&&a.jobId==='j2')) {
        db.applications.push({id:'reference-globe-'+studentId,studentId,jobId:'j2',status:'Under_Review',date:'2026-09-24',note:''});
      }
    }
    db.referenceTrackerSeeded=true;
  }
  return db;
}

