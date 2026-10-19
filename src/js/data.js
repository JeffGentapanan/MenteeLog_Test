export const roles = ['Student', 'Supervisor', 'Coordinator'];

export const evaluationCriteria = [
  { id: 'c1', num: '1', title: 'Demonstrated the ability to integrate theories learned in school and the practical work in your company.' },
  { id: 'c2', num: '2', title: 'Demonstrated evidence of growth as a result of his apprenticeship.' },
  { id: 'c3', num: '3', title: 'Demonstrated assertiveness and cleaving to new endeavors in the course of his training.' },
  { id: 'c4_header', num: '4', title: 'Demonstrated a knowledge of work done.', isHeader: true },
  { id: 'c4a', sub: 'a', title: 'Identified the different phases of the work.' },
  { id: 'c4b', sub: 'b', title: 'Is work neat and accurate regardless of its quantity.' },
  { id: 'c4c', sub: 'c', title: 'Demonstrated the ability to grasp instructions speedily, accept criticisms gracefully, and show enthusiasm towards learning.' },
  { id: 'c5_header', num: '5', title: 'Demonstrated promptness and active attendance.', isHeader: true },
  { id: 'c5a', sub: 'a', title: 'Did assigned tasks and handing them in on time.' },
  { id: 'c5b', sub: 'b', title: 'Contributed, developed and implemented new ideas and/or methods.' },
  { id: 'c6_header', num: '6', title: 'Demonstrated skills in interpersonal relations.', isHeader: true },
  { id: 'c6a', sub: 'a', title: 'Showed tact and concern in dealing with supervisors and peers.' },
  { id: 'c6b', sub: 'b', title: 'Practical courtesy and professional ethics.' },
  { id: 'c7_header', num: '7', title: 'Demonstrated overall performance proficiency.', isHeader: true },
  { id: 'c7a', sub: 'a', title: 'Showed sound judgment and common sense on the job.' },
  { id: 'c7b', sub: 'b', title: 'Showed the ability to learn new duties - quick in absorbing and retaining knowledge as well as learning, and adjusting to changes.' },
  { id: 'c7c', sub: 'c', title: 'Demonstrated communication skills such as the ability to express oneself in both written and oral work as well as the ability to listen and emphasize.' },
  { id: 'c7d', sub: 'd', title: 'Showed dependability through the ability to deal with emergency situations, the ability to keep confidential matters, and stay disciplined in the implementation of duties as called for on the job.' }
];

export const scorableCriteria = evaluationCriteria.filter(c => !c.isHeader);
export const rubric = scorableCriteria.map(c => (c.num ? `${c.num}. ${c.title}` : `   ${c.sub}) ${c.title}`));

export const navigation = {
  Student: [
    ['dashboard','Dashboard','grid'],
    ['documents','Documents','folder'],
    ['jobs','OJT Placement','briefcase'],
    ['applications','My Applications','file'],
    ['dtr','Attendance & DTR','clock'],
    ['appraisals','Performance Appraisal','star'],
    ['incidents','Incident Reports','alert']
  ],
  Supervisor: [
    ['dashboard','Dashboard','grid'],
    ['jobs','Slot Management','briefcase'],
    ['candidates','Candidate Review','users'],
    ['dtr','Log Sheets & Summary','clock'],
    ['appraisals','Performance Appraisal','star'],
    ['incidents','Incident Reports','alert']
  ],
  Coordinator: [
    ['dashboard','Dashboard','grid'],
    ['users','User Management','users'],
    ['hte','HTE Accreditation','building'],
    ['jobs','Job Management','briefcase'],
    ['candidates','Student Placement','users'],
    ['dtr','DTR Compliance','clock'],
    ['reports','Report Generation','chart'],
    ['incidents','Incident Reports','alert']
  ]
};
export function seedData() {
  return {
    version: 1,
    users: [
      {id:'s1',identifier:'2021-00421',name:'kenzosomes',email:'kenzosomes@gmail.com',role:'Student',status:'Active',course:'BSIT',company:'Accenture Philippines',supervisorId:'v1',baseHours:0,requiredHours:500,badge:'Active',phone:'',bio:'Aspiring software engineer with an interest in accessible web applications.'},
      {id:'s2',identifier:'2021-00518',name:'Joshua Dilera',email:'joshua.dilera@example.edu',role:'Student',status:'Active',course:'BSIT',company:'Accenture Philippines',supervisorId:'v1',baseHours:412,requiredHours:500,badge:'Enrolled'},
      {id:'s3',identifier:'2021-00602',name:'Kyla Alcantara',email:'kyla.alcantara@example.edu',role:'Student',status:'Active',course:'BSIT',company:'Accenture Philippines',supervisorId:'v1',baseHours:280,requiredHours:500,badge:'Enrolled'},
      {id:'s4',identifier:'2021-00711',name:'Aldrin Castro',email:'aldrin.castro@example.edu',role:'Student',status:'Active',course:'BSIT',company:'',supervisorId:null,baseHours:0,requiredHours:500,badge:'Eligible'},
      {id:'v1',identifier:'shisulzhin@gmail.com',name:'shisuizhin',email:'shisulzhin@gmail.com',role:'Supervisor',status:'Active',company:'Accenture Philippines'},
      {id:'c1',identifier:'FAC-2026-001',name:'jeff.gentapanan2004525',email:'jeff.gentapanan2004525@gmail.com',role:'Coordinator',status:'Active',department:'College of Information Technology'}
    ],
    jobs: [
      {id:'j1',title:'Software Engineer Intern',company:'Accenture Philippines',location:'Mandurriao, Iloilo City',mode:'Hybrid',courses:['BSIT'],slots:12,status:'Active',description:'Build meaningful software with a collaborative engineering team. Work on frontend features, automated testing, and technical documentation.',specs:'Accredited HTE · Active MOA · 500-hour training plan',skills:'JavaScript, HTML & CSS, Git',supervisorId:'v1'},
      {id:'j2',title:'Network Engineering Intern',company:'Globe Telecom',location:'City Proper, Iloilo City',mode:'On-site',courses:['BSIT'],slots:8,status:'Active',description:'Support network operations, learn infrastructure monitoring, and help document network configurations.',specs:'Accredited HTE · Active MOA · 500-hour training plan',skills:'Networking, troubleshooting, documentation'},
      {id:'j3',title:'FinTech & Systems Intern',company:'BDO Unibank',location:'Jaro, Iloilo City',mode:'On-site',courses:['BSIT'],slots:6,status:'Active',description:'Help improve internal systems through quality assurance, data validation, and business process documentation.',specs:'Accredited HTE · Active MOA · 500-hour training plan',skills:'SQL, analytical thinking, quality assurance'},
      {id:'j4',title:'ICT Infrastructure Intern',company:'MORE Power',location:'La Paz, Iloilo City',mode:'On-site',courses:['BSIT'],slots:4,status:'Active',description:'Learn enterprise IT support and contribute to reliable infrastructure services.',specs:'Accredited HTE · Active MOA',skills:'Hardware, networking, customer support'},
      {id:'j5',title:'Software Development Intern',company:'PhilStar Digital',location:'Molo, Iloilo City',mode:'Remote',courses:['BSIT'],slots:5,status:'Active',description:'Collaborate on digital publishing tools and responsive web experiences.',specs:'Accredited HTE · Active MOA',skills:'JavaScript, responsive design, Git'},
      {id:'j6',title:'Business Intelligence Intern',company:'SM Technologies',location:'Mandurriao, Iloilo City',mode:'Hybrid',courses:['BSIT'],slots:10,status:'Active',description:'Turn operational data into useful dashboards and insights for business teams.',specs:'Accredited HTE · Active MOA',skills:'SQL, spreadsheets, data visualization'}
    ],
    applications:[{id:'a1',studentId:'s1',jobId:'j1',status:'Accepted',date:'2026-08-01',note:'Endorsed by faculty coordinator.'},{id:'a2',studentId:'s2',jobId:'j1',status:'Accepted',date:'2026-08-01',note:'Training agreement complete.'},{id:'a3',studentId:'s3',jobId:'j1',status:'Accepted',date:'2026-08-04',note:''},{id:'a4',studentId:'s4',jobId:'j1',status:'Pending',date:'2026-09-24',note:''}],
    logs: [],
    incidents:[{id:'IR-048',studentId:'s1',supervisorId:'v1',category:'Student_Claim',title:'Attendance correction request',description:'My location could not be captured during an internet interruption. Please review the linked attendance record.',priority:'Medium',status:'Pending',date:'2026-09-25',logId:null,notes:[],meeting:null,evidence:null}],
    appraisals:[],
    notifications:[
      {id:'n3',userId:'s1',type:'Application_Status',title:'Your placement is confirmed',message:'You are assigned to Accenture Philippines as a Software Engineer Intern.',date:'2026-08-01T09:00:00+08:00',read:true}
    ],
    htes:[{id:'h1',name:'Accenture Philippines',industry:'Software & IT Services',location:'Mandurriao, Iloilo City',status:'Accredited',expiry:'2027-08-31',contact:'shisulzhin@gmail.com'},{id:'h2',name:'Globe Telecom',industry:'Telecommunications',location:'City Proper, Iloilo City',status:'Accredited',expiry:'2027-06-30',contact:'training@example.com'},{id:'h3',name:'BDO Unibank',industry:'Banking & Finance',location:'Jaro, Iloilo City',status:'Accredited',expiry:'2027-03-31',contact:'internships@example.com'},{id:'h4',name:'MORE Power',industry:'Energy & Utilities',location:'La Paz, Iloilo City',status:'Accredited',expiry:'2027-02-28',contact:'careers@example.com'},{id:'h5',name:'PhilStar Digital',industry:'Digital Media',location:'Molo, Iloilo City',status:'Accredited',expiry:'2027-07-31',contact:'careers@example.com'},{id:'h6',name:'SM Technologies',industry:'Software & IT Services',location:'Mandurriao, Iloilo City',status:'Accredited',expiry:'2027-06-30',contact:'careers@example.com'}],
    documents:[],
    program:{name:'BS Information Technology (BSIT) OJT Program',requiredHours:500,deadline:'2026-12-18',milestone:'Submit your weekly accomplishment report every Friday.',template:'Date, clock in/out, break duration, task summary, justification, supervisor review'},audit:[],shift:null,draft:'',
  };
}

