import { supabase } from '../supabaseClient.js';
import { syncRemote } from './sync.js';
import {approvedHours,visibleStudents,visibleLogs,visibleApplications,applyToJob,validateUpload,csvText} from './domain.js';
import {rubric,roles,navigation,evaluationCriteria,scorableCriteria} from './data.js';
import {signatureFields,bindSignature,signatureImage} from './signature.js';
import {reviewBatch,assignPlacement,reportRows,reportFile,candidateImport} from './portal-domain.js';

export function createPortalViews(c){
  const {e,icon,button:b,heading,field:f,textarea:ta,select:sel,badge,person,table,empty,progress,date,time,today,netElapsed}=c;
  let formHandler=null,formOwner=null,formRoute='',wizard={},reportDraft=null,notice='',noticePath='',importText='',importBatch=[];
  const db=()=>c.db,u=()=>c.user,r=()=>c.route();
  const href=(page,sub='',id='')=>`#/${u().role.toLowerCase()}/${page}${sub?'/'+sub:''}${id?'/'+encodeURIComponent(id):''}`;
  const nav=(label,page,sub='',id='',style='secondary')=>`<a class="btn ${style}" href="${href(page,sub,id)}">${label}</a>`;
  const back=(page,label='Back to '+({hte:'HTE Accreditation',jobs:'Directory',candidates:'Placement Directory',dtr:'DTR Hub',reports:'Report Hub',appraisals:'Appraisals',incidents:'Incident Hub'}[page]||'Dashboard'))=>`<div class="ref-back">${nav('← '+label,page)}</div>`;
  const panel=(title,body,extra='')=>`<section class="card sand ${extra}">${title?'<h2>'+title+'</h2>':''}${body}</section>`;
  const stats=items=>`<div class="ref-stats">${items.map(([label,value,ico])=>`<div>${ico?icon(ico):''}<span>${label}</span><strong>${value}</strong></div>`).join('')}</div>`;
  const search=(placeholder='Search name or record…')=>`<form id="search-form" class="toolbar"><input name="search" type="search" aria-label="${placeholder}" placeholder="${placeholder}" value="${e(c.view.search)}"><button class="btn secondary" type="submit">Search</button></form>`;
  const match=(...values)=>values.join(' ').toLowerCase().includes(c.view.search.toLowerCase());
  const tabs=(items,page=r().page,selected=r().sub)=>`<nav class="ref-tabs" aria-label="Page views">${items.map(([id,label])=>`<a class="${selected===id?'active':''}" href="${href(page,id)}" ${selected===id?'aria-current="page"':''}>${label}</a>`).join('')}</nav>`;
  const filter=(items)=>`<div class="ref-filter-bar">${items.map(([value,label])=>{ const active = c.view.filter===value; return `<button type="button" data-action="filter" data-id="${e(value)}" class="ref-filter-btn ${active ? 'active' : ''}" aria-pressed="${active}"><span>${e(label)}</span></button>`; }).join('')}</div>`;
  const finish=(message,page=r().page,sub='',id='')=>{c.audit(message);c.save();notice=message;noticePath=href(page,sub,id);location.hash=noticePath;c.render();};
  function form(body,handler,label='Save changes',cancel=nav('Cancel',r().page)){
    formHandler=handler;formOwner=u().id;formRoute=location.hash;
    return `<form id="portal-form">${body}<p class="form-error" role="alert"></p><div class="form-actions">${cancel}<button type="submit" class="btn">${label}</button></div></form>`;
  }
  function legacyForm(fn,after){const captured=c.capture(fn);if(!captured)throw new Error('This form is unavailable.');return panel(captured.title,captured.onSubmit?form(captured.body,async(v,el)=>{await captured.onSubmit(v,el);after?after():finish('Changes saved.');},captured.label):captured.body);}
  const student=(id)=>{
    const list = visibleStudents(db(), u());
    let s = list.find(s=>s.id===id);
    if (!s) {
      s = list.find(s => 
        s.identifier === id || 
        s.email === id || 
        (id === '22227dcf-933f-40a9-9340-f66cb9020e5c' && (s.id === 's1' || s.email === 'kenzosomes@gmail.com' || s.name === 'kenzosomes')) ||
        (id === 's1' && (s.email === 'kenzosomes@gmail.com' || s.identifier === '2021-00421'))
      );
    }
    if (!s) {
      const any = db().users.find(u => u.role === 'Student' && (u.id === id || u.identifier === id || (id === '22227dcf-933f-40a9-9340-f66cb9020e5c' && u.email === 'kenzosomes@gmail.com')));
      if (any && (u().role === 'Coordinator' || u().role === 'Supervisor' || any.company === u().company)) s = any;
    }
    if(!s) throw new Error('This student is outside your portal scope.');
    return s;
  };
  const incident=(id)=>{const i=c.visibleIncidents(u()).find(i=>i.id===id);if(!i)throw new Error('This case is outside your portal scope.');return i;};
  const job=(id)=>{const j=db().jobs.find(j=>j.id===id&&(u().role!=='Supervisor'||j.supervisorId===u().id)&&(u().role!=='Student'||j.status==='Active'));if(!j)throw new Error('Position unavailable.');return j;};
  const descriptors=['Executes project milestones efficiently with minimal oversight. Maintains industry standards in code and documentation.','Adheres closely to the OJT schedule and communicates attendance changes.','Demonstrates capacity to propose engineering solutions and seeks feedback.','Proficiency in tools, software, and technical tasks.','Expresses complex software concepts clearly to non-technical stakeholders.'];
  function appraisalResult(s,a){
    const legendHtml = `
      <div style="background: var(--cream, #fbf8f2); padding: 14px 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--line, #e2e8f0);">
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: var(--ink);">Evaluation Instrument</h4>
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px; font-size: 12px; color: var(--slate);">
          <strong style="color:var(--ink); margin-right:2px;">Legend:</strong>
          <span style="display:inline-flex; align-items:center; padding: 3px 8px; background:#fee2e2; border-radius:5px; font-weight:600; color:#991b1b;">1 - Very Poor</span>
          <span style="display:inline-flex; align-items:center; padding: 3px 8px; background:#ffedd5; border-radius:5px; font-weight:600; color:#9a3412;">2 - Poor</span>
          <span style="display:inline-flex; align-items:center; padding: 3px 8px; background:#fef9c3; border-radius:5px; font-weight:600; color:#854d0e;">3 - Average</span>
          <span style="display:inline-flex; align-items:center; padding: 3px 8px; background:#dbeafe; border-radius:5px; font-weight:600; color:#1e40af;">4 - Good</span>
          <span style="display:inline-flex; align-items:center; padding: 3px 8px; background:#dcfce7; border-radius:5px; font-weight:600; color:#166534;">5 - Very Good</span>
          <span style="display:inline-flex; align-items:center; padding: 3px 8px; background:#f1f5f9; border-radius:5px; font-weight:600; color:#475569;">NA - Not Applicable</span>
        </div>
      </div>
    `;

    let scorableIdx = 0;
    const tableRows = evaluationCriteria.map(item => {
      if (item.isHeader) {
        return `<tr style="background:#f8fafc; font-weight:700; border-top:1px solid var(--line); border-bottom:1px solid var(--line);"><td colspan="7" style="padding:10px 14px; font-size:13px; color:var(--ink);"><strong>${item.num}. ${e(item.title)}</strong></td></tr>`;
      }
      const idx = scorableIdx++;
      const ratingVal = a?.ratings?.[idx];
      return `
        <tr style="border-bottom:1px solid var(--line);">
          <td style="padding:10px 14px; font-size:13px; line-height:1.45; ${item.sub ? 'padding-left:28px;' : 'font-weight:500;'}">
            ${item.num ? `<strong>${item.num}.</strong> ` : `<span style="font-weight:600; color:var(--burgundy);">${item.sub})</span> `}${e(item.title)}
          </td>
          ${[1, 2, 3, 4, 5, 'NA'].map(val => {
            const isSelected = String(ratingVal) === String(val);
            return `
              <td style="padding:8px 4px; text-align:center; vertical-align:middle; width:44px;">
                <span style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; font-size:12px; font-weight:700; ${isSelected ? 'background:var(--burgundy); color:#fff; box-shadow:0 2px 6px rgba(88,17,26,0.3);' : 'color:var(--slate); opacity:0.35;'}">
                  ${isSelected ? (val === 'NA' ? 'NA' : val) : '·'}
                </span>
              </td>
            `;
          }).join('')}
        </tr>
      `;
    }).join('');

    const tableHtml = `
      <div class="table-wrap" style="overflow-x:auto; margin-bottom:16px; border:1px solid var(--line); border-radius:8px;">
        <table style="width:100%; border-collapse:collapse; min-width:620px;">
          <thead>
            <tr style="background:#f1f5f9; border-bottom:2px solid var(--line); text-align:left;">
              <th style="padding:10px 14px; font-weight:600; font-size:13px; color:var(--ink);">Criteria</th>
              <th style="padding:10px 4px; text-align:center; width:44px; font-size:12px; color:var(--ink);">1</th>
              <th style="padding:10px 4px; text-align:center; width:44px; font-size:12px; color:var(--ink);">2</th>
              <th style="padding:10px 4px; text-align:center; width:44px; font-size:12px; color:var(--ink);">3</th>
              <th style="padding:10px 4px; text-align:center; width:44px; font-size:12px; color:var(--ink);">4</th>
              <th style="padding:10px 4px; text-align:center; width:44px; font-size:12px; color:var(--ink);">5</th>
              <th style="padding:10px 4px; text-align:center; width:48px; font-size:12px; color:var(--ink);">NA</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;

    return `<div class="ref-appraisal-result">
      <div class="ref-identity">
        <div class="row">
          <span class="avatar">${e(s.name.split(' ').map(n=>n[0]).slice(0,2).join(''))}</span>
          <div>
            <h2>${e(s.name)}</h2>
            <small>${e(s.course)} · ${e(s.company||'OJT Student')}</small>
          </div>
        </div>
        <div class="ref-overall">
          <small>OVERALL SCORE</small>
          <strong>${a ? a.score.toFixed(1) + '<small> / 5.0</small>' : 'Pending'}</strong>
        </div>
      </div>
      <h2 class="ref-rubric-heading">Performance Appraisal Rubric</h2>` +
      (a ? (() => {
        const isKenzo = s.id === 's1' || s.id === '22227dcf-933f-40a9-9340-f66cb9020e5c' || (s.email && s.email.toLowerCase() === 'kenzosomes@gmail.com');
        const rawSig = String(a.signature || '');
        const [cleanSigName, inlineSigImg] = rawSig.includes('|||') ? rawSig.split('|||') : [rawSig, ''];
        let sigImg = a.signatureImage || inlineSigImg || '';
        if (!sigImg) {
          try {
            sigImg = localStorage.getItem('menteelog.sim.appraisal_sig.' + s.id) || (isKenzo ? localStorage.getItem('menteelog.sim.appraisal_sig.kenzo') : '') || '';
          } catch(e) {}
        }
        return panel('', legendHtml + tableHtml) + panel('Additional Comments & Official Endorsement', `
        <blockquote>${e(a.comments)}</blockquote>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:16px;padding-top:14px;border-top:1px dashed var(--line);">
          <div>
            <small style="display:block;color:var(--muted);font-size:12px;">Evaluated & Signed by</small>
            <strong style="color:var(--ink);">${e(c.student(a.supervisorId)?.name||cleanSigName||'Supervisor')}</strong>
            <span style="display:block;font-size:11px;color:var(--muted);">${e(s.company||'Industry Partner')} · ${date(a.date||today())}</span>
          </div>
          <div style="text-align:right;">
            ${sigImg?`<img src="${sigImg}" alt="Supervisor Digital Signature" style="max-height:55px;display:block;margin-left:auto;margin-bottom:4px;">`:`<div style="font-family:'Brush Script MT','Caveat',cursive,sans-serif;font-size:22px;color:var(--burgundy);">${e(cleanSigName)}</div>`}
            <span class="badge" style="background:#e6f4ea;color:#137333;border:1px solid #ceead6;font-size:10px;padding:2px 8px;border-radius:4px;">✓ Authenticated Digital Signature</span>
          </div>
        </div>
      `);
      })() : panel('', empty('Your appraisal is not available yet', 'Your supervisor\'s submitted rubric and comments will appear here.'))) +
    '</div>';
  }


  function jobs(){const {sub,id}=r();const isStudent=u().role==='Student';
    if(sub==='edit'||sub==='restore'){job(id);return back('jobs')+ `<div class="ref-form-narrow">${legacyForm(()=>c.legacy.editJob(id))}</div>`;}
    if(sub==='detail'){
      const j=job(id),applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===id&&a.status!=='Rejected');
      return back('jobs',isStudent?'Back to OJT Placement':'Back to Slots')+ `
      <div class="dashboard-grid-modern mt24">
        <div class="dash-main">
          <section class="card premium-card ojt-detail-main">
             <div class="row between align-start mb24">
               <div class="row align-start gap-16">
                 <div class="ojt-detail-avatar">${e((j.company||j.title||' ').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase())}</div>
                 <div>
                   <h1 class="ojt-detail-title">${e(j.company)}</h1>
                   <p class="muted">${icon('pin')} ${e(j.location)}</p>
                 </div>
               </div>
               <div class="row gap-8">
                 <span class="badge">CHED Accredited</span>
                 <span class="badge">Active MOA</span>
               </div>
             </div>
             
             <h2>${e(j.title)}</h2>
             <div class="row gap-16 mb24 ojt-job-meta">
               <span>${icon('briefcase')} ${e(j.department||'Technology')}</span>
               <span>${icon('users')} ${j.slots} slots left</span>
               <span style="color:#D97706;">${icon('star')} 4.9</span>
             </div>
             
             <p class="small mb8"><strong>REQUIRED SKILLS & TECH STACK</strong></p>
             <div class="row wrap gap-8">
               ${j.skills.split(',').map(s=>`<span class="ojt-job-skill">${e(s.trim())}</span>`).join('')}
             </div>
          </section>

          <section class="card premium-card ojt-detail-desc mt24">
             <h2>Position Description</h2>
             <p class="mb24">${e(j.description)}</p>
             
             <h2>Requirements</h2>
             <ul>
               ${j.specs.split('\n').map(l=> l.trim() ? `<li>${e(l.replace(/^[\-•*]\s*/,''))}</li>` : '').join('')}
             </ul>
          </section>
        </div>
        
        <div class="dash-side">
          ${isStudent ? `<section class="card premium-card ojt-side-card">
             <h3>Interested in this position?</h3>
             ${applied?nav('View Application','applications','','','btn primary full'):b('Apply to this Position','ref-apply',id,'btn primary full')}
             <p class="small muted mt16 text-center">Applying automatically forwards your verified MenteeLog profile and academic endorsement.</p>
          </section>` : `<section class="card premium-card ojt-side-card">
             <h3>Slot Actions</h3>
             <div style="display: flex; flex-direction: column; gap: 12px;">
                ${nav('Edit Details','jobs','edit',id,'secondary full')}
                ${b(j.status==='Closed'?'Restore Position':'Deactivate Slot','ref-job-status',id,'full')}
             </div>
             <p class="small muted mt16 text-center">Update your slot details or change its visibility to students.</p>
          </section>`}
          
          <section class="card premium-card ojt-side-card">
             <h3>Company Information</h3>
             <hr class="hr mb16">
             <div class="mb16">
               <span class="small muted block">OJT SUPERVISOR</span>
               <strong>${e(c.student(j.supervisorId)?.name||'Pending Assignment')}</strong>
             </div>
             <div class="mb16">
               <span class="small muted block">DEPARTMENT</span>
               <strong>${e(j.department||'Technology - AI Delivery')}</strong>
             </div>
             <div class="mb16">
               <span class="small muted block">MAIN ADDRESS</span>
               <strong>${e(j.location)}</strong>
             </div>
             <div>
               <span class="small muted block">CONTACT EMAIL</span>
               <strong>${e(c.student(j.supervisorId)?.email||'careers@example.com')}</strong>
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
      </div>`;
    }
    const toCourseCode = c => {
      const m = {
        'BS Computer Science': 'BSCS',
        'BS Information Technology': 'BSIT',
        'BS Computer Engineering': 'BSCompE',
        'BS Electronics Engineering': 'BSECE',
        'BSCpE': 'BSCompE',
        'BSSA': 'BSCS',
        'BSBA': 'BSIT',
        'BSEE': 'BSECE'
      };
      return m[c] || c;
    };
    const courseMatches = (jCourses, filter) => {
      if (!filter || filter === 'All') return true;
      const targetFilter = toCourseCode(filter);
      return (jCourses || []).some(c => {
        const code = toCourseCode(c);
        return code === targetFilter || code === filter;
      });
    };
    const list=db().jobs.filter(j=>(isStudent?j.status==='Active':u().role==='Supervisor'?j.supervisorId===u().id:true)&&match(j.title,j.company,j.location,j.skills)&&(isStudent?(courseMatches(j.courses, c.view.course))&&(c.view.mode==='All'||j.location.toLowerCase().includes(c.view.mode.toLowerCase())):sub==='archived'?j.status==='Closed':j.status!=='Closed'));
    return (isStudent?'': '')+heading(isStudent?'OJT Placement Directory':'Slot Management',isStudent?'Browse and apply to accredited host training establishments':e(u().company||'Partner companies')+' · Internship positions',isStudent?'':b('Post New Work','job-edit','','','plus'))+(isStudent?
    `<div class="row wrap gap-8 mb32" style="margin-bottom: 32px;">
        ${['All','BSIT','Mandurriao','City Proper','Jaro'].map(s=>b(s,'ref-course',s, (s==='All' && c.view.course==='All' && c.view.mode==='All') || (s!=='All' && (c.view.course===s || c.view.mode===s)) ? 'ojt-filter active' : 'ojt-filter')).join('')}
        ${b('+ More Filters','ref-more-filters','',c.view.more?'ojt-filter active':'ojt-filter')}
      </div>
      ${c.view.more?panel('Filter Opportunities',form(`<div class="grid-2">${sel('Program','course',['All','BSIT'],c.view.course)}${sel('Location','mode',['All',...new Set(db().jobs.map(j=>j.location))],c.view.mode)}</div>`,v=>{c.view.course=v.course;c.view.mode=v.mode;c.render();},'Apply Filters'), 'mb32'):''}
      ` : tabs([['','Active Slots'],['archived','Archived Slots']]))+(list.length?(isStudent?list.map(j=>{const applied=db().applications.some(a=>a.studentId===u().id&&a.jobId===j.id&&a.status!=='Rejected');return `
      <article class="ojt-job-card">
        <div class="ojt-job-card-inner">
          <div class="row between align-start">
            <div class="row align-center gap-16">
              <div class="ojt-job-avatar">${e((j.company||j.title||' ').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase())}</div>
              <div>
                <h2 class="ojt-job-title">${e(j.title)}</h2>
                <p class="ojt-job-company">${e(j.company)}</p>
              </div>
            </div>
            <div class="ojt-job-badge">CHED Accredited · Active MOA</div>
          </div>
          <div class="row ojt-job-meta">
            <span>${icon('pin')} ${e(j.location)}</span>
            <span>${icon('briefcase')} ${e((j.courses||[]).map(toCourseCode).join(' / '))}</span>
            <span>${icon('users')} ${j.slots} slots left</span>
            <span style="color:#D97706;">${icon('star')} ${(Math.random()*1+4).toFixed(1)}</span>
          </div>
          <div class="row wrap gap-8">
            ${j.skills.split(',').map(s=>`<span class="ojt-job-skill">${e(s.trim())}</span>`).join('')}
          </div>
          <div class="row between ojt-job-footer">
             <small class="muted">Posted 2 days ago</small>
             ${nav('View Details','jobs','detail',j.id,'btn secondary small')}
          </div>
        </div>
        ${applied? nav('Application Submitted — View Details','jobs','detail',j.id,'ojt-job-applied-btn') : 
        b('Apply to this Position','ref-apply',j.id,'ojt-job-apply-btn')}
      </article>`;}).join(''):panel('',table(['Position Title','Department','Posted Date','Applicants','Status','Actions'],list.map(j=>`<tr><td><strong>${e(j.title)}</strong></td><td>${e(j.department||'IT Department')}</td><td>${date(j.createdAt||'2026-09-01')}</td><td>${db().applications.filter(a=>a.jobId===j.id).length} applied</td><td>${badge(j.status)}</td><td>${nav('View','jobs','detail',j.id,'secondary small')} ${nav(sub==='archived'?'Restore':'Edit','jobs',sub==='archived'?'restore':'edit',j.id,'secondary small')}</td></tr>`)))):panel('',empty('No positions match this view','Try another filter or search.')));
  }

  function incidents(){const {sub,id}=r(),role=u().role,all=c.visibleIncidents(u()),co=role==='Coordinator',title=co?'Incident & Compliance Hub':role==='Student'?'Incident & Safety Claims':'Supervisor Incident & Claims Management';
    const intro=heading(title,'Log incidents, review claims, assess evidence, and track case resolutions.',nav(co?'Log Report Intake':role==='Student'?'File Incident Claim':'Create Supervisor Log','incidents','new','',''))+stats([['Total Cases',all.length,'folder'],[co?'Red Queue':'High Severity',all.filter(i=>i.priority==='High'&&!['Resolved','Dismissed'].includes(i.status)).length,'alert'],['Under Investigation',all.filter(i=>['Pending','Scheduled'].includes(i.status)).length,'search'],['Resolved Claims',all.filter(i=>i.status==='Resolved').length,'check']]);
    if(sub==='new')return intro+panel(role==='Student'?'File Student Incident Claim':'Log Incident Report',form(`<div class="grid-2">${role!=='Student'?sel('Student involved','studentId',visibleStudents(db(),u()).map(s=>[s.id,s.name])):f('Student','studentName','text',u().name,'readonly')}${sel('Category','title',['Safety / Hazard','Attendance Concern','Workplace Conduct','Health / Medical','Other'])}${sel('Severity level','priority',['Low','Medium','High'],'Medium')}${f('Date & time','occurredAt','datetime-local','','required')}${f('Location / HTE department','location','text','','required maxlength="160"')}${co?sel('Report source','category',[['Student_Claim','Student Claim'],['Disciplinary_Violation','Supervisor Log']]):''}</div>${ta('Incident description / statement','description','','required minlength="20"')}${role!=='Student'?ta('Immediate corrective action taken','immediateAction','',''):''}${sel('Related DTR (optional)','logId',[['','No linked DTR'],...visibleLogs(db(),u()).map(l=>[l.id,c.student(l.studentId)?.name+' · '+date(l.date)])])}${f('Evidence / inspection photos (PDF, PNG, JPG, up to 10 MB)','evidence','file','','accept="application/pdf,image/png,image/jpeg"')}`,async(v,el)=>{const sid=role==='Student'?u().id:v.studentId;const s=role==='Student'?u():student(sid);if(v.logId&&!db().logs.some(l=>l.id===v.logId&&l.studentId===sid))throw new Error('The linked DTR must belong to the selected student.');const incCode = 'IR-'+crypto.randomUUID().slice(0,8).toUpperCase();let evidence=null;const file=el.elements.evidence.files[0];if(file){validateUpload(file);evidence=await c.legacy.uploadEvidence(file, incCode);}const i={...v,id:incCode,studentId:sid,supervisorId:s.supervisorId,category:role==='Student'?'Student_Claim':co?v.category:'Disciplinary_Violation',date:today(),status:'Pending',evidence,notes:[],meeting:null,_pending:true};delete i.studentName;db().incidents.unshift(i);c.render();const { error, data: inserted } = await supabase.from('incidents').insert({ code: i.id, student_id: sid, supervisor_id: s.supervisorId || null, category: i.category, title: i.title, description: i.description, priority: i.priority, status: i.status, date: i.date, log_id: i.logId || null, evidence: i.evidence ? JSON.stringify(i.evidence) : null, notes: i.notes, meeting: i.meeting }).select().single();if (error || !inserted) {db().incidents = db().incidents.filter(x => x.id !== i.id);c.render();throw new Error(error ? error.message : 'Insert failed or was rejected by security rules.');}delete i._pending;const savedRow = { id: inserted.code, studentId: inserted.student_id, supervisorId: inserted.supervisor_id, category: inserted.category, title: inserted.title, description: inserted.description, priority: inserted.priority, status: inserted.status, date: inserted.date, logId: inserted.log_id, evidence: inserted.evidence ? (typeof inserted.evidence === 'string' ? JSON.parse(inserted.evidence) : inserted.evidence) : null, meeting: inserted.meeting, notes: inserted.notes || [] };const idx = db().incidents.findIndex(x => x.id === i.id);if (idx !== -1) db().incidents[idx] = savedRow;db().users.filter(v=>v.role==='Coordinator'||v.id===s.supervisorId).forEach(v=>c.notify(v.id,'Incident_Alert','New incident report',i.id+': '+i.title));finish('Incident submitted for coordinator review.');},'Submit Report'));
    if(sub==='investigate'){if(!co)throw new Error('Coordinator access required.');incident(id);return back('incidents')+heading('Update Investigation','Record findings, case status, and mediation details.')+legacyForm(()=>c.legacy.incidentDetail(id),()=>finish('Investigation updated.','incidents','detail',id));}
    if(sub==='detail'){const i=incident(id),s=c.student(i.studentId);return back('incidents')+intro+`<div class="ref-detail-grid"><div>${panel('Case #'+e(i.id),`<div class="row wrap">${badge(i.category==='Student_Claim'?'Student Claim':'Supervisor Log')}${badge(i.priority)}${badge(i.status)}</div><h3 class="mt16">Description & Statement</h3><p class="ref-readonly">${e(i.description)}</p><h3>Immediate Action Taken</h3><p class="ref-readonly">${e(i.immediateAction||'Awaiting investigation')}</p>${i.logId?b('View Linked DTR','log-detail',i.logId,'secondary small'):''}<h3 class="mt16">Investigation Activity & Audit Log</h3><div class="timeline"><div class="timeline-item"><strong>Report filed</strong><p>${date(i.date)}</p></div>${i.notes.map(n=>`<div class="timeline-item"><strong>${e(n.author)}</strong><p>${e(n.text)}</p><small>${date(n.date)}</small></div>`).join('')}</div>${i.meeting?`<p class="note">Mediation: ${e(i.meeting.platform)} · ${date(i.meeting.time)} ${time(i.meeting.time)}</p>`:''}`)}${panel('Uploaded Evidence & Verification',i.evidence?`<div class="ref-evidence">${icon('file')}<strong>${e(i.evidence.name)}</strong>${b('Preview','ref-file-preview',i.evidence.id,'secondary small')}${b('Download','file-download',i.evidence.id,'secondary small')}</div>`:empty('No evidence attached'))}</div><div>${panel(co?'Case Actions':'Case Metadata',`<dl class="ref-facts"><dt>Student</dt><dd>${e(s?.name)}</dd><dt>HTE Partner</dt><dd>${e(s?.company||'Unassigned')}</dd><dt>Supervisor</dt><dd>${e(c.student(i.supervisorId)?.name||'Unassigned')}</dd><dt>Severity</dt><dd>${badge(i.priority)}</dd><dt>Case Status</dt><dd>${badge(i.status)}</dd></dl>${co?nav('Update Investigation','incidents','investigate',id,'full')+b('Add Note','ref-case-note',id,'secondary full')+b('Resolve Incident','ref-case-resolve',id,'full'):''}`)}${co?panel('Processing Checklist',`<p>${icon('check')} Report received</p><p>${i.evidence?'Evidence attached':'Evidence pending'}</p><p>${i.notes.length?'Investigation notes recorded':'Investigation pending'}</p><p>${i.status==='Resolved'?'Resolution completed':'Resolution pending'}</p>`):''}</div></div>`;}
    const list=all.filter(i=>match(i.id,i.title,c.student(i.studentId)?.name)&&(sub==='red'?i.priority==='High'&&!['Resolved','Dismissed'].includes(i.status):sub==='student'?i.category==='Student_Claim':sub==='supervisor'?i.category==='Disciplinary_Violation':sub==='resolved'?i.status==='Resolved':sub==='review'?['Pending','Scheduled'].includes(i.status):sub==='archive'?['Resolved','Dismissed'].includes(i.status):true));
    return intro+panel('',tabs(co?[['','All Cases'],['red','Red Queue'],['student','Student Claims'],['supervisor','Disciplinary Logs'],['archive','Archive']]:[['','All Cases'],['review','Under Investigation'],['resolved','Resolved']])+search('Search case, student or category')+(list.length?table(['Report ID','Source','Student','HTE Partner','Category','Date Reported','Severity','Status','Action'],list.map(i=>`<tr><td>${e(i.id)}</td><td>${badge(i.category==='Student_Claim'?'Student Claim':'Supervisor Log')}</td><td>${e(c.student(i.studentId)?.name)}</td><td>${e(c.student(i.studentId)?.company||'—')}</td><td>${e(i.title)}</td><td>${date(i.date)}</td><td>${badge(i.priority)}</td><td>${badge(i.status)}</td><td>${nav('Review','incidents','detail',i.id,'secondary small')}</td></tr>`)):empty('No cases in this view'))+`<div class="table-footer">Showing ${list.length} logged cases</div>`);
  }

  function appraisals(){const {sub,id}=r();if(u().role==='Student'){const stu=u(),isKenzo=stu.id==='s1'||stu.id==='22227dcf-933f-40a9-9340-f66cb9020e5c'||(stu.email&&stu.email.toLowerCase()==='kenzosomes@gmail.com');const stuAppraisal=db().appraisals.find(a=>a.studentId===stu.id||(isKenzo&&(a.studentId==='s1'||a.studentId==='22227dcf-933f-40a9-9340-f66cb9020e5c')));return '<h1 class="sr-only">Performance Appraisal</h1><p class="ref-evaluation-period">Evaluation Period: Final Assessment</p>'+appraisalResult(stu,stuAppraisal);}
    if(sub==='evaluate'){
      const s=student(id);
      const a=db().appraisals.find(a=>a.studentId===id || ((id==='s1'||id==='22227dcf-933f-40a9-9340-f66cb9020e5c'||s?.email==='kenzosomes@gmail.com')&&(a.studentId==='s1'||a.studentId==='22227dcf-933f-40a9-9340-f66cb9020e5c')));
      setTimeout(()=>{if(typeof window.initEvalSignaturePad==='function')window.initEvalSignaturePad();},60);
      return back('appraisals')+
        `<div class="ref-identity">${person(s)}<span>Final Evaluation Period</span></div>`+
        (a ? `<div style="margin-bottom:16px; padding:12px 16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div><strong style="color:#1e40af;">Completed Evaluation on Record</strong><p style="margin:2px 0 0; font-size:12px; color:#3b82f6;">Final score: ${a.score.toFixed(1)} / 5.0. Need to update or re-evaluate?</p></div>
          ${b('🗑️ Reset & Re-Evaluate','ref-reset-appraisal',id,'secondary small')}
        </div>` : '') +
        legacyForm(()=>c.legacy.evaluate(id),()=>finish('Evaluation submitted successfully!','appraisals','submitted',id));
    }
    if(sub==='submitted'){const s=student(id),isKenzo=id==='s1'||id==='22227dcf-933f-40a9-9340-f66cb9020e5c'||s?.email==='kenzosomes@gmail.com',a=db().appraisals.find(a=>a.studentId===id||(isKenzo&&(a.studentId==='s1'||a.studentId==='22227dcf-933f-40a9-9340-f66cb9020e5c')));const rawSig=String(a?.signature||u().name||''),[cleanSigName,inlineSigImg]=rawSig.includes('|||')?rawSig.split('|||'):[rawSig,''];let sigImg=a?.signatureImage||inlineSigImg||'';if(!sigImg){try{sigImg=localStorage.getItem('menteelog.sim.appraisal_sig.'+id)||(isKenzo?localStorage.getItem('menteelog.sim.appraisal_sig.kenzo'):'')||'';}catch(e){}}return `<div class="ref-success"><span class="ref-success-icon">${icon('check')}</span><h1>Evaluation Submitted Successfully!</h1><p>Appraisal rubric has been processed and archived.</p>${panel('Evaluation Summary',`<p>Student: ${e(s.name)}</p><p>Evaluation type: Final Evaluation</p><h2>${a?.score.toFixed(1)||'—'} / 5.0</h2><p style="margin-top:8px;">${e(a?.comments||'')}</p><div style="margin-top:16px;padding-top:12px;border-top:1px dashed var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px;"><div><span style="font-size:11px;color:var(--muted);display:block;">Digitally Signed by</span><strong>${e(cleanSigName)}</strong></div>${sigImg?`<img src="${sigImg}" alt="Signature" style="max-height:50px;">`:''}</div>`)}${nav('Back to Appraisals','appraisals','','','')}</div>`;}
    const list=visibleStudents(db(),u()).filter(s=>match(s.name,s.course));return heading('Performance Appraisal','Evaluate student performance, record scores, and sign off evaluations.')+panel('',search('Search by student name or cohort')+(list.length?table(['Intern Name','Department','Evaluation Period','Score / Rating','Status','Action'],list.map(s=>{const a=db().appraisals.find(a=>a.studentId===s.id || ((s.id==='s1'||s.id==='22227dcf-933f-40a9-9340-f66cb9020e5c'||s.email==='kenzosomes@gmail.com')&&(a.studentId==='s1'||a.studentId==='22227dcf-933f-40a9-9340-f66cb9020e5c')));return `<tr><td>${person(s)}</td><td>${e(s.company)}</td><td>Final Evaluation</td><td>${a?a.score.toFixed(1)+' / 5.0':'— Not evaluated'}</td><td>${badge(a?'Completed':'Pending')}</td><td><div class="row" style="gap:4px;">${nav(a?'Review':'Evaluate','appraisals','evaluate',s.id,'small')}${a?b('Reset','ref-reset-appraisal',s.id,'secondary small'):''}</div></td></tr>`;})):empty('No interns found','No student records found to evaluate.')));
  }

  function notifications(){
    const cur=u();
    const isMine=n=>n&&(n.userId===cur.id||(n.role&&n.role===cur.role)||(cur.role==='Student'&&['s1','22227dcf-933f-40a9-9340-f66cb9020e5c'].includes(n.userId))||(cur.role==='Supervisor'&&n.userId==='v1')||(cur.role==='Coordinator'&&n.userId==='c1'));
    const notes=db().notifications.filter(isMine).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    const unread=notes.filter(n=>!n.read).length;
    const list=notes.filter(n=>r().sub==='unread'?!n.read:r().sub==='system'?['System','DTR_Event'].includes(n.type):r().sub==='incidents'?['Incident_Alert','Application_Status'].includes(n.type):true);
    return back('dashboard')+heading('Notifications Center','Manage, filter, and click any alert to jump directly to the relevant record.',b('Clear Read','clear-read','','secondary small')+b('Mark All as Read','read-all','','small'))+tabs([['',`All Notifications (${notes.length})`],['unread',`Unread (${unread})`],['system','System & DTR'],['incidents','Incidents & Alerts']])+`<div class="ref-notifications">${list.length?list.map(n=>`<button class="ref-notification ${n.read?'read':''}" data-action="read" data-id="${e(n.id)}" style="border:1px solid var(--line);"><span class="row between"><strong>${n.read?'':'● '}${e(n.title)}</strong><small>${date(n.date)}</small></span><span style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:6px;"><span>${e(n.message)}</span><strong style="font-size:11.5px;color:var(--burgundy);white-space:nowrap;">Click to open &rarr;</strong></span></button>`).join(''):panel('',empty('No notifications here.'))}</div>`;
  }

  function documents(){const docs=db().documents.filter(d=>d.studentId===u().id);return heading('Document Management Portal','Upload and manage your OJT requirements and supporting documents.')+`<button class="upload-drop" data-action="document-upload">${icon('upload')}<strong>Drop files here, or click to upload</strong><span>PDF, JPG, PNG · Up to 10 MB per file</span></button><div class="document-list">${docs.length?docs.map(d=>`<article class="document-item">${icon('file')}<div class="document-copy"><h3>${e(d.category)}</h3><p>${e(d.name)} · ${Math.ceil(d.size/1024)} KB · ${date(d.date)}</p></div>${badge(d.status||'Pending')}${b('Preview','ref-file-preview',d.id,'secondary small','eye')}${b('Download','file-download',d.id,'secondary small','download')}${b('Delete','ref-file-delete',d.id,'secondary small','x')}</article>`).join(''):empty('No documents submitted','Upload your requirements using the area above.')}</div>`;}

  function page(page,user){formHandler=null;if(notice&&location.hash!==noticePath)notice='';let content;
    if(page==='dashboard'&&user.role==='Supervisor')content=supervisorDashboard();
    else if(page==='applications'&&user.role==='Student')content=studentApplications();
    else if(page==='jobs')content=jobs();
    else if(page==='incidents')content=incidents();
    else if(page==='appraisals')content=appraisals();
    else if(page==='notifications')content=notifications();
    else if(page==='documents')content=documents();
    else if(page==='hte')content=htes();
    else if(page==='candidates')content=candidates();
    else if(page==='dtr')content=attendance();
    else if(page==='reports')content=reports();
    else if(page==='users')content=governance();
    if(content!==undefined)return `<div class="reference-portal">${notice?'<div class="ref-banner" role="status">'+icon('check')+e(notice)+b('Dismiss','ref-dismiss','','secondary small')+'</div>':''}${content}</div>`;
    return null;
  }

  async function action(name,id,el){
    if(['toggle-live-map','sim-gps-onsite','sim-gps-offsite','view-record-map','fullscreen-live-map','fullscreen-record-map'].includes(name)) return false;
    if(name==='application-detail'&&u().role!=='Student'){const a=visibleApplications(db(),u()).find(a=>a.id===id);if(!a)throw new Error('Application outside your scope.');const captured=c.capture(()=>c.legacy.applicationDetail(id));c.showModal(captured.title,captured.body+(a.resumeId?b('Preview Applicant Resume','ref-file-preview',a.resumeId,'secondary full'):''),captured.onSubmit,captured.label);return true;}
    if((name==='log-detail'||name==='ref-justify-modal')&&u().role==='Student'){
      const l=visibleLogs(db(),u()).find(l=>l.id===id);
      if(!l)throw new Error('DTR unavailable.');
      if(['Flagged','Rejected'].includes(l.status)){
        const stu = u();
        const hte = (window.menteelogGps && window.menteelogGps.getHte(stu?.company || 'Accenture Philippines')) || { lat: 10.7167, lng: 122.5458, name: 'Accenture Philippines' };
        const locMatch = l.remarks ? l.remarks.match(/(\d+\.\d+)°?[NS]?,\s*(\d+\.\d+)°?[EW]?/) : null;
        const locCoords = locMatch ? locMatch[0] : `${(hte.lat + 0.0215).toFixed(4)}° N, ${(hte.lng + 0.0185).toFixed(4)}° E`;
        const locCard = `
          <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:12px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="font-size:13px; color:#9f1239;">Clock-In Location Anomaly</strong>
              <span class="badge red">⚠️ Outside Geofence</span>
            </div>
            <p class="small muted" style="margin:0 0 6px;"><strong>Workplace:</strong> ${e(stu?.company || 'Accenture Philippines')} · <code>${locCoords}</code></p>
            <p class="small" style="margin:0 0 10px; color:#991b1b;">Shift was recorded outside the 100m geofence perimeter. Please provide an official justification.</p>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn secondary small" data-action="view-record-map" data-id="${l.id}" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; font-weight:600;">
                🗺️ Toggle Record Map
              </button>
              <button type="button" class="btn secondary small" data-action="fullscreen-record-map" data-id="${l.id}" style="display:flex; align-items:center; justify-content:center; gap:6px; font-weight:600;" title="Open Wide Fullscreen View">
                ⛶ Wide / Fullscreen
              </button>
            </div>
            <div id="modal-record-map-${l.id}" style="display:none; margin-top:12px; height:200px; border-radius:6px; overflow:hidden; border:1px solid #cbd5e1;"></div>
          </div>
        `;
        c.showModal('Write Justification',`<p class="muted small mb16" style="text-transform: uppercase; font-weight: 600;">${date(l.date)} - ${l.status}</p><h3>Flag Reason</h3><p class="ref-alert mb16">${e(l.remarks||'GPS Mismatch - logged outside accredited workplace geofence.')}</p>${locCard}<p class="muted small mb16">Your justification will be forwarded to your supervisor for review. Be clear and factual.</p>${ta('Your Explanation','justification',l.justification||'','required minlength="10" placeholder="Explain the reason for the attendance anomaly (e.g. client site visit, official fieldwork, internet outage)..."')}${f('Attach Evidence','evidence','file','','accept="application/pdf,image/png,image/jpeg"')}<p class="small muted mt8">PNG, JPG or PDF (max. 10MB)</p>`,async(v,form)=>{
          const file=form.elements.evidence?.files?.[0];
          if(file){
            validateUpload(file);
            const doc={id:crypto.randomUUID(),studentId:u().id,category:'DTR Justification',name:file.name,type:file.type,size:file.size,date:today()};
            await c.putFile(doc.id,file);
            db().documents.push(doc);
            l.evidenceId=doc.id;
            l.evidenceName=file.name;
          }
          l.justification = v.justification;
          l.status = 'Pending';
          try {
            localStorage.setItem('menteelog.sim.justification.' + l.id, JSON.stringify({
              justification: v.justification,
              evidenceId: l.evidenceId || null,
              evidenceName: l.evidenceName || null,
              status: 'Pending'
            }));
          } catch(e) {}
          try {
            const { error, data: updated } = await supabase.from('logs').update({ justification: v.justification, status: 'Pending' }).eq('id', l.id).select();
            if (error) {
              await supabase.from('logs').update({ status: 'Pending', remarks: (l.remarks || '') }).eq('id', l.id);
            } else if (updated && updated.length > 0) {
              await c.syncRemote(supabase, db());
            }
          } catch(err) {
            console.warn('Justification cloud sync note:', err);
          }
          l.justification = v.justification;
          l.status = 'Pending';
          const supTargetId = l.supervisorId || stu?.supervisorId || 'v1';
          c.notify(supTargetId,'DTR_Event','Attendance justification submitted',u().name+' submitted an off-site justification for '+date(l.date)+'.',{targetPage:'dtr',targetLogId:l.id,role:'Supervisor'});
          finish('Justification submitted and forwarded to your Supervisor for review.','dtr');
        },'Submit');return true;}}
    if(name==='announcement'&&u().role==='Supervisor'){c.showModal('Send Emergency Broadcast Alert',sel('Alert type','type',['Extreme Weather / Typhoon','Workplace Safety','Schedule Change','System / Technical'])+sel('Severity level','severity',['Low','Medium','High / Critical'],'Medium')+sel('Affected interns','recipients',[['all','All assigned active interns'],...visibleStudents(db(),u()).map(s=>[s.id,s.name])])+f('Subject line','title','text','','required maxlength="120"')+ta('Emergency message','message','','required minlength="10"')+'<p class="small">Creates notifications within this local preview. SMS and email delivery require the backend.</p>',v=>{const recipients=visibleStudents(db(),u()).filter(s=>v.recipients==='all'||s.id===v.recipients);recipients.forEach(s=>c.notify(s.id,'System',v.title,v.severity+' — '+v.message));finish('Alert recorded for '+recipients.length+' assigned interns.','dashboard');},'Send Alert Broadcast');return true;}
    if(name==='import-users'){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');location.hash=href('users','import');return true;}
    if(name==='ref-dismiss'){notice='';c.render();return true;}
    const routes={'job-detail':['jobs','detail'],'student-detail':[r().page==='dtr'?'dtr':'candidates','profile'],'incident-detail':['incidents','detail'],'incident-new':['incidents','new'],'evaluate':['appraisals','evaluate'],'report-preview':['reports','configure']};
    if(routes[name]){location.hash=href(...routes[name],id);return true;}
    if(name==='job-edit'&&id){location.hash=href('jobs','edit',id);return true;}
    if(name==='ref-course'){
    const locs = ['Mandurriao','City Proper','Jaro','La Paz','Molo'];
    if(id==='All') { c.view.course='All'; c.view.mode='All'; }
    else if(locs.includes(id)) { c.view.mode = c.view.mode===id ? 'All' : id; c.view.course = 'All'; }
    else { c.view.course = c.view.course===id ? 'All' : id; c.view.mode = 'All'; }
    c.render();
    return true;
}
    if(name==='ref-more-filters'){c.view.more=!c.view.more;c.render();return true;}
    if(name==='ref-apply'){if(u().role!=='Student')throw new Error('Student access required.');const j=job(id);
      c.showModal('Apply — '+e(j.title),
      `<div class="ojt-modal-profile">
          <p class="small mb12"><strong>PRE-POPULATED STUDENT PROFILE</strong></p>
          <div class="row between mb8"><span class="muted">Full Name</span><strong>${e(u().name)}</strong></div>
          <div class="row between mb8"><span class="muted">Section</span><strong>${e(u().course)}</strong></div>
          <div class="row between mb8"><span class="muted">GPA</span><strong>1.75</strong></div>
          <div class="row between"><span class="muted">Contact Email</span><strong>${e(u().email)}</strong></div>
        </div>
        <div class="field mb16">
          <label>Resume</label>
          ${sel('Resume on file','resumeId',[['','Choose an uploaded resume'],...db().documents.filter(d=>d.studentId===u().id&&d.type==='application/pdf').map(d=>[d.id,d.name])])}
        </div>
        <div class="field">
          <label>Cover Note (optional)</label>
          <textarea name="note" class="textarea" style="height:120px; resize:none;" placeholder="Introduce yourself and share why you are interested in this position..."></textarea>
        </div>`,
        async(v,form)=>{
          if(!j||j.status!=='Active'||j.slots<1)throw new Error('This position is no longer open.');
          if(db().applications.some(a=>a.studentId===u().id&&a.jobId===id&&a.status!=='Rejected'))throw new Error('You already have an application for this position.');
          await c.submitApplication(id, v.note);
          if(j.supervisorId)c.notify(j.supervisorId,'Application_Status','New internship application',u().name+' applied for '+j.title);
          finish('Application submitted successfully.','jobs');
        },'Confirm Application');
        return true;}



    if(name==='ref-job-status'){if(u().role==='Student')throw new Error('Management access required.');const j=job(id);const restore=j.status==='Closed';c.showModal(restore?'Restore this position?':'Deactivate this position?',`<p>${e(j.title)}</p><p>${restore?'The position will become available to applicants.':'Interns will no longer be able to apply. Existing applications remain available for review.'}</p>`,()=>{j.status=restore?'Active':'Closed';finish(restore?'Position restored.':'Position deactivated.','jobs','detail',id);},restore?'Restore':'Deactivate');return true;}
    if(name==='ref-case-note'||name==='ref-case-resolve'){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');const i=incident(id),resolve=name==='ref-case-resolve';c.showModal(resolve?'Resolve Incident':'Add Investigation Note',(resolve?sel('Resolution verdict','status',['Resolved','Dismissed']):'')+ta(resolve?'Resolution summary':'Investigation note','note','','required minlength="10"'),v=>{i.notes.push({text:v.note,author:u().name,date:new Date().toISOString()});if(resolve)i.status=v.status;[i.studentId,i.supervisorId].filter(Boolean).forEach(s=>c.notify(s,'Incident_Alert','Incident '+i.id+' updated',v.note));finish(resolve?'Incident resolution recorded.':'Investigation note added.','incidents','detail',id);},resolve?'Confirm Resolution':'Save Note');return true;}
    if(name==='ref-file-preview'){await previewFile(id);return true;}
    if(await hteAction(name,id,el)||await attendanceAction(name,id,el)||await reportAction(name,id,el)||await governanceAction(name,id,el))return true;
    return false;
  }
  async function previewFile(id){
    const doc=db().documents.find(d=>d.id===id&&(d.studentId===u().id||visibleStudents(db(),u()).some(s=>s.id===d.studentId)||visibleApplications(db(),u()).some(a=>a.resumeId===d.id)))||c.visibleIncidents(u()).find(i=>i.evidence?.id===id)?.evidence||(u().role==='Coordinator'?db().htes.find(h=>h.document?.id===id)?.document:null)||db().documents.find(d=>d.id===id);
    if(!doc)throw new Error('This file is outside your portal scope.');
    let url;let isLocal=false;
    if(doc.filePath){
      url=await c.legacy.getSignedUrl(doc.filePath, doc.bucket || 'documents');
      if(!url)throw new Error('Unable to preview document.');
    }else{
      const file=await c.fileOp('get',id);
      if(!file)throw new Error('File no longer available in this browser.');
      url=URL.createObjectURL(file);
      isLocal=true;
    }
    const parentLog = (db().logs || []).find(l => l.evidenceId === id);
    const previewContent = ((doc.type||'').startsWith('image/')
      ? `<img class="ref-file-image" src="${url}" alt="${e(doc.name)}">`
      : `<p>${e(doc.name)} - PDF document</p><p>Open the stored PDF in your browser's document viewer.</p><a class="btn" href="${url}" target="_blank" rel="noopener">Open PDF Preview</a>`)
      + `<div class="form-actions" style="margin-top:16px; padding-top:12px; border-top:1px solid var(--line, #e2e8f0); display:flex; justify-content:flex-end; gap:8px;">`
      + (parentLog ? `<button type="button" class="btn secondary" data-action="log-detail" data-id="${e(parentLog.id)}">&larr; Back to Exception Review</button>` : '')
      + `<button type="button" class="btn primary" data-action="close">✕ Close Preview</button>`
      + `</div>`;
    c.showModal('Document Preview - '+e(doc.name), previewContent);
    if(isLocal){document.querySelector('#modal').addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});}
  }
  async function submit(values,form){if(!formHandler||u()?.id!==formOwner||location.hash!==formRoute)throw new Error('The page or session changed. Reopen this form.');await formHandler(values,form);}

  // Module-specific pages follow; all remain under the sidebar routes in the supplied flowchart.
  function htes(){return htePages();}
  function candidates(){return candidatePages();}
  function attendance(){return attendancePages();}
  function reports(){return reportPages();}
  function governance(){return governancePages();}

  function supervisorDashboard(){
    const students=visibleStudents(db(),u()),logs=visibleLogs(db(),u()),flaggedCount=logs.filter(l=>['Flagged','Pending'].includes(l.status)).length,verifiedCount=logs.filter(l=>l.status==='Approved').length,evalsDue=students.filter(s=>approvedHours(db(),s.id)>=(s.requiredHours||500)&&!db().appraisals.some(a=>a.studentId===s.id)).length;
    return heading('Supervisor Dashboard',e(u().company)+' · Automated Geofence Oversight & Intern Evaluation')+
      stats([
        ['Active Interns',students.length,'users'],
        ['Verified On-Site Shifts',verifiedCount,'check'],
        ['Exception Queue (Flagged)',flaggedCount,'alert'],
        ['Evaluations Due',evalsDue,'star']
      ])+
      panel('',`<div class="row wrap" style="align-items:center; gap:10px;"><strong>Quick Actions:</strong>${nav('Log Sheets & Summary','dtr','','','small')}${b('+ Add Intern Slot','job-edit','','secondary small')}<span class="push-right">${b('Send Emergency Alert','announcement','','secondary small','alert')}</span></div>`)+
      panel('Active Interns — Live Geofence & Progress Overview',students.length?table(['Intern Name','Course','Verified Hours','Progress','Geofence & Shift Status','Actions'],students.map(s=>{
        const isClockedIn = (db().activeShifts||[]).some(sh=>sh.studentId===s.id) || logs.some(l=>l.studentId===s.id&&l.status==='Running') || (db().shift?.studentId===s.id&&!db().shift.clockOut);
        const hasFlagged = logs.some(l=>l.studentId===s.id&&l.status==='Flagged');
        const hrsDone = approvedHours(db(),s.id) >= (s.requiredHours || 500);
        const statusHtml = isClockedIn
          ? '<span class="badge green">● Active On-Site (Inside 100m Geofence)</span>'
          : (hasFlagged ? '<span class="badge red">⚠️ Exception Flagged</span>' : '<span class="badge green">✓ Auto-Verified On-Site</span>');
        return `<tr><td>${person({...s,course:''})}</td><td>${e(s.course)}</td><td><strong>${approvedHours(db(),s.id)}</strong> / ${s.requiredHours} hrs</td><td>${progress(approvedHours(db(),s.id),s.requiredHours)}</td><td>${statusHtml}</td><td><div class="row" style="gap:6px;">${nav('View Profile','candidates','profile',s.id,'secondary small')}${nav('Task Logs ›','dtr','profile',s.id,'secondary small')}${hrsDone?nav('Evaluate Rubric','appraisals','evaluate',s.id,'primary small'):''}</div></td></tr>`;
      })):empty('No active interns','No students are currently placed under your supervision.'))+
      `<div class="row" style="margin-top: 24px; gap: 12px;">${nav('Candidate Review','candidates','','','secondary small')}${nav('Application Review','applications','','','secondary small')}</div>`;
  }
  function studentApplications(){
    const apps=visibleApplications(db(),u());
    const underReviewCount=apps.filter(a=>['Pending','Under_Review'].includes(a.status)).length;
    const acceptedCount=apps.filter(a=>a.status==='Accepted').length;
    const summaryStats=stats([
      ['Total Applications',apps.length,'file'],
      ['Under Review',underReviewCount,'clock'],
      ['Accepted Placements',acceptedCount,'check'],
      ['Deployment Status',acceptedCount>0?'Active Intern':'Pending','briefcase']
    ]);

    return heading('My Applications Tracker','Track your internship applications, faculty endorsement status, and official HTE placement confirmation.',nav('Browse OJT Directory','jobs','','','secondary small'))+
      summaryStats+
      (apps.length?apps.map((a,idx)=>{
        const j=db().jobs.find(j=>j.id===a.jobId)||{title:'Software Engineer Intern',company:u().company||'Accenture Philippines',location:'Iloilo Business Park, Mandurriao, Iloilo City',department:'Technology & Engineering',skills:'React, Node.js, TypeScript, Cloud Architecture'};
        const sup=c.student(j?.supervisorId||u().supervisorId);
        const supName=sup?.name||'Paolo Mendoza';
        const isAccepted=a.status==='Accepted';
        const isRejected=a.status==='Rejected';
        const level=isAccepted?3:a.status==='Under_Review'?2:0;
        const initials=(j.company||j.title||'ML').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
        const skillsList=(j.skills||'Software Engineering, Web Development, Agile').split(',').map(s=>s.trim()).filter(Boolean);
        const stages=[
          {title:'Application Submitted',sub:'Profile & Resume Sent',state:level>=0?'Completed':'Pending'},
          {title:'Coordinator Endorsement',sub:'Academic Clearance Verified',state:level>=1?'Endorsed':'Pending'},
          {title:'HTE Screening & Review',sub:'Supervisor Evaluation',state:level>=2?'Reviewed':'Awaiting'},
          {title:isRejected?'Application Decision':'Official Placement',sub:isRejected?'Slot Filled / Declined':'Deployment Confirmed',state:isAccepted?'Accepted':isRejected?'Rejected':'Pending'}
        ];

        return `<section class="card" style="padding:24px 28px; border:1px solid var(--line, #eadfce); border-radius:16px; margin-top:20px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
          <div>
            <!-- Card Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; padding-bottom:20px; border-bottom:1px solid var(--line, #f1e8d8);">
              <div style="display:flex; align-items:flex-start; gap:16px;">
                <div style="width:56px; height:56px; border-radius:14px; background:var(--burgundy, #58111A); color:#FAF4E8; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; letter-spacing:0.5px; flex-shrink:0;">
                  ${e(initials)}
                </div>
                <div>
                  <div style="display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:4px;">
                    <h2 style="margin:0; font-size:20px; font-weight:700; color:var(--ink, #1f2937);">${e(j.title)}</h2>
                    <span style="font-size:11px; font-weight:700; padding:3px 9px; border-radius:999px; background:#faf4e8; color:#58111A; border:1px solid #efdfbb;">CHED Accredited · Active MOA</span>
                  </div>
                  <p style="margin:0 0 10px; font-size:15px; font-weight:600; color:var(--burgundy, #58111A);">${e(j.company)}</p>
                  <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12.5px; color:var(--slate, #64748b);">
                    <span style="display:inline-flex; align-items:center; gap:5px;">${icon('pin')} ${e(j.location||'Iloilo Business Park, Mandurriao')}</span>
                    <span style="display:inline-flex; align-items:center; gap:5px;">${icon('briefcase')} ${e(j.department||'Technology & Engineering')}</span>
                    <span style="display:inline-flex; align-items:center; gap:5px;">${icon('users')} Supervisor: <strong style="color:var(--ink);">${e(supName)}</strong></span>
                    <span style="display:inline-flex; align-items:center; gap:5px;">${icon('clock')} Applied ${date(a.date||'2026-09-02')}</span>
                  </div>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
                ${isAccepted
                  ? `<span style="display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:999px; background:#dcfce7; color:#166534; border:1px solid #86efac; font-size:12.5px; font-weight:800; letter-spacing:0.3px;">✓ ACCEPTED & DEPLOYED</span>`
                  : badge(a.status)}
                <span class="small muted" style="font-size:11.5px;">Ref ID: <code>APP-${String(idx+1).padStart(3,'0')}-${e(String(a.id||'892').slice(0,4).toUpperCase())}</code></span>
              </div>
            </div>

            <!-- 4-Stage Milestone Pipeline -->
            <div style="margin:22px 0; background:#fcfaf5; border:1px solid #efe4ce; border-radius:12px; padding:20px 22px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#58111A;">Application & Endorsement Pipeline</span>
                <span style="font-size:12px; font-weight:600; color:${isAccepted?'#166534':'#854d0e'};">${isAccepted?'Stage 4 of 4 · All Milestones Complete':`Stage ${level+1} of 4 In Progress`}</span>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px;">
                ${stages.map((st,i)=>{
                  const done=i<=level && !isRejected;
                  const active=i===level && !isAccepted && !isRejected;
                  return `<div style="position:relative; background:${done?'#ffffff':'#f8f5ee'}; border:1px solid ${done?(isAccepted&&i===3?'#86efac':'#d6c4a5'):'#e5dec9'}; border-radius:10px; padding:14px 16px; display:flex; align-items:flex-start; gap:12px;">
                    <div style="width:30px; height:30px; border-radius:50%; background:${done?(isAccepted&&i===3?'#16a34a':'#58111A'):active?'#d97706':'#e2e8f0'}; color:${done||active?'#ffffff':'#64748b'}; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; flex-shrink:0;">
                      ${done?'✓':(i+1)}
                    </div>
                    <div style="min-width:0;">
                      <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:${done?(isAccepted&&i===3?'#166534':'#58111A'):'#64748b'}; margin-bottom:2px;">Step ${i+1} · ${e(st.state)}</div>
                      <strong style="display:block; font-size:13.5px; color:var(--ink, #1f2937); margin-bottom:2px;">${e(st.title)}</strong>
                      <span style="display:block; font-size:12px; color:var(--slate, #64748b);">${e(st.sub)}</span>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>

            <!-- 2-Column Endorsement Remarks & Deployment Summary -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
              <div style="background:#ffffff; border:1px solid var(--line, #e2e8f0); border-radius:10px; padding:16px 18px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                  <strong style="font-size:13px; color:var(--ink); display:flex; align-items:center; gap:6px;">${icon('check')} Official Endorsement & Review Note</strong>
                  <span class="badge green" style="font-size:10.5px;">Verified</span>
                </div>
                <p style="margin:0 0 14px; font-size:13.5px; color:var(--ink); line-height:1.55; background:#f8fafc; padding:10px 12px; border:1px solid var(--line, #e2e8f0); border-radius:6px;">
                  "${e(a.note||'Endorsed by faculty coordinator and accepted by company supervisor.')}"
                </p>
                <div>
                  <span style="display:block; font-size:11px; font-weight:700; text-transform:uppercase; color:var(--slate); margin-bottom:6px;">Role Tech Stack & Competencies</span>
                  <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${skillsList.map(sk=>`<span class="ojt-job-skill" style="font-size:11.5px; padding:3px 10px;">${e(sk)}</span>`).join('')}
                  </div>
                </div>
              </div>

              <div style="background:#ffffff; border:1px solid var(--line, #e2e8f0); border-radius:10px; padding:16px 18px;">
                <strong style="display:block; font-size:13px; color:var(--ink); margin-bottom:10px;">Internship Assignment Specifications</strong>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 16px; font-size:12.5px;">
                  <div>
                    <span class="muted" style="display:block; font-size:11px;">REQUIRED OJT HOURS</span>
                    <strong style="color:var(--ink);">${u().requiredHours||500} Hours (${e(u().course||'BSIT')})</strong>
                  </div>
                  <div>
                    <span class="muted" style="display:block; font-size:11px;">ATTENDANCE MODE</span>
                    <strong style="color:#166534;">📍 100m GPS Geofence</strong>
                  </div>
                  <div>
                    <span class="muted" style="display:block; font-size:11px;">FACULTY COORDINATOR</span>
                    <strong style="color:var(--ink);">Dr. Evelyn Ramos</strong>
                  </div>
                  <div>
                    <span class="muted" style="display:block; font-size:11px;">COMPLIANCE STANDARD</span>
                    <strong style="color:var(--ink);">CHED CMO 104 s. 2017</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:16px; border-top:1px dashed var(--line, #e2e8f0);">
              <span class="small muted">Your verified student profile and clearance documents are linked to this placement.</span>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${j?.id?nav('View Position Details','jobs','detail',j.id,'secondary small'):''}
                ${nav(' Clearance Documents','documents','','','secondary small')}
                ${isAccepted?nav('Open Attendance & DTR ›','dtr','','','primary small'):''}
              </div>
            </div>
          </div>
        </section>`;
      }).join(''):panel('',empty('No applications yet','Apply to an accredited internship from the placement directory.')));
  }

  function htePages(){
    const {sub,id}=r();if(u().role!=='Coordinator')throw new Error('Coordinator access required.');
    const get=()=>{const h=db().htes.find(h=>h.id===id);if(!h)throw new Error('HTE unavailable.');return h;};
    if(sub==='new'){
      const step=Number(id)||1;if(step>1&&!wizard.name)return back('hte')+panel('Start your application',nav('Company Information','hte','new','1',''));
      const stepper=`<div class="ref-stepper">${['Company Information','Contact & MOA','Review & Submit'].map((label,i)=>`<span class="${step===i+1?'active':''}"><b>${i+1}</b>${label}</span>`).join('')}</div>`;
      const body=step===1?`<div class="grid-2">${f('Company name','name','text',wizard.name||'','required maxlength="120"')}${f('Business registration number','registration','text',wizard.registration||'','required maxlength="80"')}${f('Industry / sector','industry','text',wizard.industry||'','required maxlength="100"')}${f('Company address','address','text',wizard.address||'','required maxlength="200"')}${f('City','location','text',wizard.location||'','required maxlength="100"')}${f('Province','province','text',wizard.province||'','required maxlength="100"')}${f('Postal code','postal','text',wizard.postal||'','required maxlength="12"')}</div>`:step===2?`<div class="grid-2">${f('Contact person','contactName','text',wizard.contactName||'','required maxlength="100"')}${f('Designation','designation','text',wizard.designation||'','required maxlength="100"')}${f('Contact email','contact','email',wizard.contact||'','required')}${f('Phone number','phone','tel',wizard.phone||'','required maxlength="30"')}${f('MOA reference number','reference','text',wizard.reference||'','required maxlength="80"')}${f('MOA start date','start','date',wizard.start||'','required')}${f('MOA expiry date','expiry','date',wizard.expiry||'','required')}${f('Upload MOA document (PDF, PNG, JPG)','document','file','','accept="application/pdf,image/png,image/jpeg" '+(wizard.file?'':'required'))}</div>`:`<div class="grid-2">${panel('Company Information',`<h3>${e(wizard.name)}</h3><p>${e(wizard.industry)}</p><p>${e(wizard.address)}, ${e(wizard.location)}, ${e(wizard.province)}</p><p>Registration: ${e(wizard.registration)}</p>`)}${panel('Contact & MOA',`<p>${e(wizard.contactName)} · ${e(wizard.designation)}</p><p>${e(wizard.contact)} · ${e(wizard.phone)}</p><p>${date(wizard.start)} — ${date(wizard.expiry)}</p><p>${e(wizard.file?.name)}</p>`)}</div><label class="row"><input type="checkbox" required> I have reviewed the company details and supporting document.</label>`;
      return back('hte')+heading('Accredit New HTE','Register a host training establishment for document review.')+stepper+panel(['','Company Information','Contact & MOA Details','Review Application'][step],form(body,async(v,el)=>{Object.assign(wizard,v);if(step===2){if(wizard.expiry<=wizard.start)throw new Error('The MOA expiry must be after its start date.');const file=el.elements.document.files[0]||wizard.file;validateUpload(file);wizard.file=file;}if(step<3){location.hash=href('hte','new',String(step+1));return;}if(db().htes.some(h=>h.name.toLowerCase()===wizard.name.toLowerCase()))throw new Error('This company is already registered.');const file=wizard.file,document={id:crypto.randomUUID(),name:file.name};await c.putFile(document.id,file);const h={...wizard,id:crypto.randomUUID(),status:'Pending',document};delete h.file;db().htes.push(h);wizard={};finish('HTE application submitted for accreditation review.','hte');},step===3?'Submit Application':'Next Step',step>1?nav('Previous','hte','new',String(step-1)):nav('Cancel','hte')));
    }
    if(sub==='renew'){const h=get();return back('hte')+heading('Renew Memorandum of Agreement','Update agreement validity and supporting compliance documents.')+panel('',`<div class="row between"><h2>${e(h.name)}</h2><p>Current expiry: ${date(h.expiry)}</p></div>`)+panel('Renewal Details',form(`<div class="grid-2">${f('New MOA start date','start','date','','required')}${f('New MOA expiry date','expiry','date','','required')}</div>${f('Upload renewed MOA','document','file','','required accept="application/pdf,image/png,image/jpeg"')}${ta('Renewal notes','notes','','')}<h3>Compliance Verification</h3>${['Business permits are current','Insurance requirements reviewed','Training plan reviewed'].map(label=>`<label class="row ref-check"><input type="checkbox" required>${label}</label>`).join('')}`,async(v,el)=>{if(v.expiry<=v.start||v.expiry<today())throw new Error('Enter a valid future MOA expiry after the start date.');const file=el.elements.document.files[0];validateUpload(file);const document={id:crypto.randomUUID(),name:file.name};await c.putFile(document.id,file);Object.assign(h,{start:v.start,expiry:v.expiry,renewalNotes:v.notes,document,status:'Accredited'});finish('MOA renewal recorded.','hte','renewed',id);},'Submit Renewal'));}
    if(sub==='renewed'){const h=get();return `<div class="ref-success"><span class="ref-success-icon">${icon('check')}</span><h1>MOA Renewal Successful!</h1><p>The updated agreement is recorded in this frontend preview.</p>${panel('Renewal Summary',`<h2>${e(h.name)}</h2><p>${date(h.start)} — ${date(h.expiry)}</p>${badge(h.status)}`)}${nav('Back to Dashboard','hte')}${nav('View All MOA','hte','renewals')}</div>`;}
    if(sub==='activity'){const items=db().audit.filter(a=>match(a.action,a.actor));return back('hte')+heading('HTE Activity Log','Review accreditation and renewal activity.',b('Export CSV','ref-audit-export','','secondary','download'))+panel('',search('Search activity')+(items.length?table(['Activity','Performed By','Date'],items.map(a=>`<tr><td>${e(a.action)}</td><td>${e(a.actor)}</td><td>${date(a.date)}</td></tr>`)):empty('No activity records','No HTE accreditation or renewal activity has been logged yet.')));}
    const expiring=h=>new Date(h.expiry)-Date.now()<60*86400000;
    const list=db().htes.filter(h=>match(h.name,h.location,h.contact)&&(sub==='renewals'?expiring(h):c.view.filter==='All'||h.status===c.view.filter));
    const hteTable=table(['Company / HTE','Status',sub==='renewals'?'Current MOA Expiry':'MOA Expiry','Contact Person','Location','Actions'],list.map(h=>`<tr><td><strong>${e(h.name)}</strong></td><td>${badge(h.status)}</td><td>${date(h.expiry)}</td><td>${e(h.contactName||h.contact)}</td><td>${e(h.location)}</td><td><div class="row">${b('View','ref-hte-view',h.id,'secondary small')}${nav('Renew','hte','renew',h.id,'secondary small')}</div></td></tr>`));
    if(sub==='renewals')return back('hte')+heading('MOA Renewal Queue','Review agreements that expire within the next 60 days.')+panel('',search('Search company or contact')+(list.length?hteTable:empty('No renewals due','All recorded agreements are outside the renewal window.')));
    return heading('HTE Accreditation','Manage partner companies, accreditation status, and MOA compliance.',nav('MOA Renewal','hte','renewals')+nav('+ Accredit New HTE','hte','new','1',''))+stats([['Total HTEs',db().htes.length],['Active / Accredited',db().htes.filter(h=>h.status==='Accredited').length],['Expiring Soon',db().htes.filter(expiring).length],['Pending Review',db().htes.filter(h=>h.status==='Pending').length]])+panel('',search('Search HTE / company…')+filter([['All','All Statuses'],['Accredited','Accredited'],['Pending','Pending'],['Expired','Expired']])+(list.length?hteTable:empty('No HTE partners found','No partner companies match your filter or search query.')))+`<div class="grid-2 section-space">${panel('Compliance Metrics',`<p>Accredited partners</p>${progress(db().htes.filter(h=>h.status==='Accredited').length,Math.max(1,db().htes.length))}<p>Students placed</p>${progress(db().users.filter(s=>s.role==='Student'&&s.company).length,Math.max(1,db().users.filter(s=>s.role==='Student').length))}`)}${panel('Recent Activity',(db().audit.length?db().audit.slice(0,3).map(a=>`<div class="activity-item"><p>${e(a.action)}</p><small>${date(a.date)}</small></div>`).join(''):'<p class="muted" style="padding: 12px 0;">No recent activity recorded.</p>')+`<div style="margin-top: 18px; padding-top: 4px;">${nav('View All Activity','hte','activity','','secondary small')}</div>`)}</div>`+panel('HTE Verification Workflow',`<div class="ref-stepper">${['Company registration','Document review','MOA verification','Accreditation','Active partnership'].map((label,i)=>`<span><b>${i+1}</b>${label}</span>`).join('')}</div>`);
  }
  async function hteAction(name,id){if(!['ref-hte-view','ref-hte-tab','ref-hte-edit','ref-audit-export'].includes(name))return false;if(u().role!=='Coordinator')throw new Error('Coordinator access required.');if(name==='ref-audit-export'){c.download('HTE-activity.csv',csvText([['Action','Actor','Date'],...db().audit.map(a=>[a.action,a.actor,a.date])]));return true;}if(name==='ref-hte-edit'){c.legacy.editHTE(id);return true;}const h=db().htes.find(h=>h.id===id);if(!h)throw new Error('HTE unavailable.');const documents=name==='ref-hte-tab';c.showModal(e(h.name),`<div class="tabs hte-modal-tabs" style="margin-bottom: 20px; padding: 4px 0 10px 0; overflow: visible;">${b('Company Information','ref-hte-view',id,documents?'secondary':'')}${b('Documents','ref-hte-tab',id,documents?'':'secondary')}</div>${documents?(h.document?`<div class="ref-evidence">${icon('file')}<strong>${e(h.document.name)}</strong>${b('Preview','ref-file-preview',h.document.id,'secondary')}</div>`:empty('No document uploaded')):`<dl class="ref-facts"><dt>Industry</dt><dd>${e(h.industry)}</dd><dt>Address</dt><dd>${e(h.address||h.location)}</dd><dt>Contact person</dt><dd>${e(h.contactName||'Not recorded')}</dd><dt>Email</dt><dd>${e(h.contact)}</dd><dt>MOA expiry</dt><dd>${date(h.expiry)}</dd><dt>Status</dt><dd>${badge(h.status)}</dd></dl><div class="ref-button-stack" style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">${b('Edit Accreditation','ref-hte-edit',id,'secondary full')}${nav('Renew MOA','hte','renew',id,'full')}${nav('Manage Job Listings','jobs','','','secondary full')}</div>`}`);document.querySelector('#modal').classList.add('ref-drawer');return true;}

  function candidatePages(){const {sub,id}=r(),co=u().role==='Coordinator',all=visibleStudents(db(),u()),unassigned=all.filter(s=>!s.company);if(!co&&['assign','batch','exports','analytics'].includes(sub))throw new Error('Coordinator access required.');
    if(sub==='profile'){const s=student(id),section=c.view.profileTab||'Overview',hours=approvedHours(db(),id),a=db().appraisals.find(a=>a.studentId===id);return back('candidates')+heading('Intern Profile','Placement, attendance, evaluation, and requirements.',co?nav('Edit Placement / Clearance','candidates','edit',id):'')+`<div class="ref-identity">${person(s)}<span>${e(s.identifier)} · ${badge(s.badge)}</span></div><div class="ref-tabs">${['Overview','DTR Records','Evaluations','Documents'].map(label=>b(label,'ref-profile-tab',label,section===label?'small':'secondary small')).join('')}</div>`+(section==='DTR Records'?panel('Daily Time Records',c.dtrTable(db().logs.filter(l=>l.studentId===id),{role:'Student'})):section==='Evaluations'?appraisalResult(s,a):section==='Documents'?panel('Submitted Requirements',db().documents.filter(d=>d.studentId===id).map(d=>`<div class="document-item"><strong>${e(d.category)}</strong><span>${e(d.name)}</span>${b('Preview','ref-file-preview',d.id,'secondary small')}</div>`).join('')||empty('No documents submitted')):`<div class="ref-detail-grid"><div>${panel('OJT Placement Details',`<dl class="ref-facts"><dt>Host training establishment</dt><dd>${e(s.company||'Unassigned')}</dd><dt>Company supervisor</dt><dd>${e(c.student(s.supervisorId)?.name||'Unassigned')}</dd><dt>Course / program</dt><dd>${e(s.course)}</dd><dt>Training hours required</dt><dd>${s.requiredHours} hours</dd><dt>Accreditation status</dt><dd>${badge(s.badge)}</dd></dl>`)}${panel('Performance Metrics',stats([['Approved Hours',hours],['Overall Evaluation',a?a.score.toFixed(1)+' / 5':'Pending'],['Open Incidents',db().incidents.filter(i=>i.studentId===id&&!['Resolved','Dismissed'].includes(i.status)).length]]))}</div><div>${panel('OJT Hours Progress',`<div class="ref-large-score">${Math.round(hours/s.requiredHours*100)}%</div>${progress(hours,s.requiredHours)}<p>${hours} / ${s.requiredHours} hours</p>`)}${panel('Recent Activity',db().logs.filter(l=>l.studentId===id).slice(-3).reverse().map(l=>`<div class="activity-item"><strong>${date(l.date)}</strong><p>${l.hours} hours · ${e(l.status)}</p></div>`).join('')||'<p>No attendance records yet.</p>')}</div></div>`);}
    if(sub==='edit'){student(id);return back('candidates')+heading('Placement & Clearance','Update the intern’s assignment and verify completion requirements.')+legacyForm(()=>c.legacy.studentDetail(id));}
    if(sub==='assign'||sub==='batch'){const list=sub==='assign'&&id?[student(id)]:unassigned;return back('candidates')+heading(sub==='batch'?'Bulk Student Assignment':'Assign Student Placement','Choose an active position and assign eligible, unplaced students.')+panel('Placement Details',form(`<div class="grid-2">${sel('HTE / internship position','jobId',db().jobs.filter(j=>j.status==='Active'&&j.supervisorId&&j.slots>0).map(j=>[j.id,j.company+' - '+j.title+' ('+j.slots+' slots)']))}${f('Required OJT hours','requiredHours','number',db().program.requiredHours,'required min="1" max="2000"')}</div>${list.length?table(['Select','Student','SR Code','Program','Status'],list.map(s=>`<tr><td><input aria-label="Select ${e(s.name)}" type="checkbox" name="students" value="${e(s.id)}" ${sub==='assign'?'checked':''}></td><td>${e(s.name)}</td><td>${e(s.identifier)}</td><td>${e(s.course)}</td><td>${badge(s.badge)}</td></tr>`)):empty('All Students Placed','There are currently no unassigned students in this cohort waiting for placement.')}`, async (v,el)=>{const ids=new FormData(el).getAll('students');const placed=assignPlacement(db(),u(),ids,v.jobId,v.requiredHours);await c.legacy.assignPlacementRemote(placed, db().jobs.find(j=>j.id===v.jobId), v.requiredHours);placed.forEach(s=>c.notify(s.id,'Application_Status','Placement confirmed','You are assigned to '+s.company+'.'));finish(placed.length+' students assigned successfully.','candidates');},'Assign Placement'));}
    if(sub==='exports')return back('candidates')+heading('Reports & Exports','Generate placement reports and review previously generated documents.')+`<div class="grid-2">${['deployment','completion','hte','compliance'].map(type=>panel(reportNames[type],`<p>Generate a report from the current cohort records.</p><div style="margin-top: 16px;">${nav('Generate Report','reports','configure',type,'')}</div>`)).join('')}</div>`+`<div style="margin-top: 24px;">${nav('Exported Files Repository','reports','history')}</div>`;
    if(!co){
      // SUPERVISOR PORTAL: Combined Candidate Review & Application Review
      const apps = visibleApplications(db(), u());
      const underReviewCount = apps.filter(a => ['Pending', 'Under_Review'].includes(a.status)).length;
      const acceptedCount = apps.filter(a => a.status === 'Accepted').length;
      const supervisorIntro = heading('Candidate Review & Applications', 'Review candidate applications for your posted slots and manage assigned interns.') +
        tabs([['', `Assigned Interns (${all.length})`], ['applications', `Application Review (${apps.length})`]]) +
        stats([['Assigned Interns', all.length, 'users'], ['Total Applications', apps.length, 'file'], ['Under Review', underReviewCount, 'clock'], ['Accepted', acceptedCount, 'check']]);

      if(sub === 'applications') {
        const fStatus = c.view.filter || 'All';
        const filteredApps = apps.filter(a => {
          if (fStatus === 'Under_Review') return ['Pending', 'Under_Review'].includes(a.status);
          if (fStatus === 'All') return true;
          return a.status === fStatus;
        }).filter(a => {
          const st = c.student(a.studentId);
          const j = db().jobs.find(j => j.id === a.jobId);
          return match(st?.name, st?.identifier, st?.course, j?.title, j?.company);
        });

        const appToolbar = '<div class="ref-attendance-toolbar" style="margin-top:16px; margin-bottom:12px;">' +
          search('Search applicant name, SR code, or job…') +
          filter([['All','All Applications'],['Under_Review','Under Review (' + underReviewCount + ')'],['Accepted','Accepted (' + acceptedCount + ')'],['Rejected','Rejected']]) +
          '</div>';

        const appRows = filteredApps.map(a => {
          const st = c.student(a.studentId);
          const j = db().jobs.find(j => j.id === a.jobId);
          const displayStatus = (a.status === 'Pending') ? 'Under_Review' : a.status;
          return `<tr>
            <td>${person(st)}</td>
            <td>${e(st?.course || 'BSIT')}</td>
            <td><strong>${e(j?.title || 'OJT Placement')}</strong><br><small>${e(j?.company || u().company)}</small></td>
            <td>${date(a.date)}</td>
            <td>${a.resumeId ? b('Preview','ref-file-preview',a.resumeId,'secondary small','file') : '<span class="muted small">—</span>'}</td>
            <td>${badge(displayStatus)}</td>
            <td>${b('Review Application','application-detail',a.id,'small')}</td>
          </tr>`;
        });

        const appPanel = panel('Candidate Applications', filteredApps.length ? table(['Applicant','Course','Applied Position','Applied Date','Resume','Status','Action'], appRows) : empty('No applications found', 'No candidate applications match the selected filter.'));
        return supervisorIntro + appToolbar + appPanel;
      }

      // sub === '' (Assigned Interns)
      const rosterRows = all.filter(s => match(s.name, s.identifier, s.course, s.company)).map(s => {
        return `<tr>
          <td><strong>${e(s.name)}</strong><br><small>${e(s.identifier)}</small></td>
          <td>${e(s.course)}</td>
          <td>${progress(approvedHours(db(), s.id), s.requiredHours)}</td>
          <td>${approvedHours(db(), s.id)} / ${s.requiredHours} hrs</td>
          <td>${badge(s.badge)}</td>
          <td><div class="row" style="gap:4px;">${nav('View Profile','candidates','profile',s.id,'secondary small')}${nav('Log Sheets','dtr','profile',s.id,'secondary small')}</div></td>
        </tr>`;
      });

      return supervisorIntro + search('Search assigned interns…') + panel('Assigned Interns Directory', all.length ? table(['Intern Name','Program','Hours Progress','Hours Rendered','Status','Action'], rosterRows) : empty('No assigned interns', 'When candidates are accepted and assigned, they will appear in your intern roster.'));
    }

    // COORDINATOR PORTAL: Student Placement (Combined with Application Review)
    const allApps = db().applications || [];
    const underReviewCount = allApps.filter(a => ['Pending', 'Under_Review'].includes(a.status)).length;
    const availableViews=[['','Placement Directory'],['applications',`Application Review (${allApps.length})`],['unassigned',`Unassigned Pool (${unassigned.length})`],['companies','HTE Breakdown'],['cohort','Cohort Overview'],['exports','Reports & Exports'],['performance','Track Performance']];
    const list=(sub==='unassigned'?unassigned:all).filter(s=>match(s.name,s.identifier,s.course,s.company)&&(sub==='company'?s.company===decodeURIComponent(id):true));
    const intro=heading('Student Placement Directory','Manage student placements, company assignments, application reviews, and training progress.',b('Bulk Import CSV','import-users','','secondary','upload')+nav('Bulk Assignment','candidates','batch')+nav('+ Assign Placement','candidates','assign','',''))+(tabs(availableViews))+stats([['Total Placed',all.filter(s=>s.company).length],['Applications',allApps.length],['Pending Placement',unassigned.length],['Active Internships',all.filter(s=>s.company&&s.badge!=='Cleared').length]]);

    if(sub==='applications'){
      const fStatus = c.view.filter || 'All';
      const filteredApps = allApps.filter(a => {
        if (fStatus === 'Under_Review') return ['Pending', 'Under_Review'].includes(a.status);
        if (fStatus === 'All') return true;
        return a.status === fStatus;
      }).filter(a => {
        const st = c.student(a.studentId);
        const j = db().jobs.find(j => j.id === a.jobId);
        return match(st?.name, st?.identifier, st?.course, j?.title, j?.company);
      });

      const appToolbar = '<div class="ref-attendance-toolbar" style="margin-top:16px; margin-bottom:12px;">' +
        search('Search student, SR code, or company…') +
        filter([['All','All Applications'],['Under_Review','Under Review (' + underReviewCount + ')'],['Accepted','Accepted'],['Rejected','Rejected']]) +
        '</div>';

      const appRows = filteredApps.map(a => {
        const st = c.student(a.studentId);
        const j = db().jobs.find(j => j.id === a.jobId);
        const displayStatus = (a.status === 'Pending') ? 'Under_Review' : a.status;
        return `<tr>
          <td><strong>${e(st?.name)}</strong><br><small>${e(st?.identifier)}</small></td>
          <td>${e(st?.course || 'BSIT')}</td>
          <td><strong>${e(j?.company || 'Unassigned')}</strong><br><small>${e(j?.title || 'Position')}</small></td>
          <td>${date(a.date)}</td>
          <td>${a.resumeId ? b('Preview','ref-file-preview',a.resumeId,'secondary small','file') : '<span class="muted small">—</span>'}</td>
          <td>${badge(displayStatus)}</td>
          <td>${b('Review / Endorse','application-detail',a.id,'secondary small')}</td>
        </tr>`;
      });

      return intro + appToolbar + panel('Student Applications Overview', filteredApps.length ? table(['Student','Program','Host Establishment / Position','Applied Date','Resume','Status','Action'], appRows) : empty('No applications found', 'No student applications match this filter.'));
    }
    if(sub==='companies')return intro+(db().htes.length?`<div class="grid-3">${db().htes.map(h=>{const interns=all.filter(s=>(s.company || '').trim().toLowerCase() === (h.name || '').trim().toLowerCase()),slots=db().jobs.filter(j=>j.company===h.name&&j.status==='Active').reduce((n,j)=>n+j.slots,0);return panel(e(h.name),`<p>${e(h.industry)}</p><dl class="ref-facts"><dt>Active interns</dt><dd>${interns.length}</dd><dt>Available slots</dt><dd>${slots}</dd><dt>Status</dt><dd>${badge(h.status)}</dd></dl>${b('View Company Interns','ref-company-interns',h.name,'secondary full')}`);}).join('')}</div>`:panel('',empty('No HTE partners registered','Partner companies will appear here once accredited.')));
    if(sub==='grid')return intro+search('Search student, SR code or HTE')+(list.length?`<div class="grid-3">${list.map(s=>panel('',`${person(s)}<p>${badge(s.badge)}</p><div class="ref-readonly"><strong>${e(s.company||'Unassigned')}</strong><p>${e(c.student(s.supervisorId)?.name||'No supervisor assigned')}</p></div><p>Hours Rendered</p>${progress(approvedHours(db(),s.id),s.requiredHours)}${nav('Open Intern Profile','candidates','profile',s.id,'secondary full')}`)).join('')}</div>`:panel('',empty('No students found','No student records match this filter or search query.')));
    if(sub==='performance')return intro+panel('Track Student Performance',search('Search student or HTE')+(list.length?table(['Student','HTE','Hours Rendered','Supervisor Rating','Attendance','Status','Action'],list.map(s=>{const a=db().appraisals.find(a=>a.studentId===s.id),logs=db().logs.filter(l=>l.studentId===s.id);return `<tr><td>${person(s)}</td><td>${e(s.company||'Unassigned')}</td><td>${approvedHours(db(),s.id)} / ${s.requiredHours}</td><td>${a?a.score.toFixed(1)+' / 5':'Pending'}</td><td>${logs.filter(l=>l.status==='Approved').length} approved entries</td><td>${badge(s.badge)}</td><td>${nav('View Details','candidates','profile',s.id,'secondary small')}</td></tr>`;})):empty('No students found','No student records match this search query.')));
    if(sub==='cohort')return intro+panel('Cohort Overview',`<div class="row wrap" style="gap: 12px; margin-bottom: 24px;">${nav('Assign Students','candidates','batch')}${nav('View Reports','candidates','exports')}</div><h2 class="mt16" style="margin-bottom: 16px;">Active Cohort</h2>`+(list.length?table(['Student','Program','Company','Hours Progress','Status'],list.map(s=>`<tr><td>${nav(e(s.name),'candidates','profile',s.id,'secondary small')}</td><td>${e(s.course)}</td><td>${e(s.company||'Unassigned')}</td><td>${progress(approvedHours(db(),s.id),s.requiredHours)}</td><td>${badge(s.badge)}</td></tr>`)):empty('No students in cohort','No active students found in this cohort.')));
    return intro+panel('',search('Search students, SR code, or HTE…')+(list.length?table(['Student Name / SR','Program','HTE Assignment','Hours Progress','Status','Action'],list.map(s=>`<tr><td><strong>${e(s.name)}</strong><small>${e(s.identifier)}</small></td><td>${e(s.course)}</td><td>${e(s.company||'Unassigned')}</td><td>${progress(approvedHours(db(),s.id),s.requiredHours)}</td><td>${badge(s.badge)}</td><td>${nav(sub==='unassigned'?'Assign HTE':'View Details','candidates',sub==='unassigned'?'assign':'profile',s.id,'secondary small')}</td></tr>`)):empty('No students found','No candidate records match your filter or search query.')))+(co&&unassigned.length?panel('Unassigned Students — Action Required',`<p style="margin-bottom: 16px;">${unassigned.length} students are waiting for placement.</p><div>${nav('Review Unassigned Pool','candidates','unassigned')}</div>`):'');
  }

  function attendancePages(){const {sub,id}=r(),role=u().role,logs=visibleLogs(db(),u());
    if(sub==='profile'){const s=student(id)||c.student(id)||{name:'kenzosomes',requiredHours:500},items=logs.filter(l=>l.studentId===id),tasks=c.view.tasks;return back('dtr')+heading(e(s.name)+' — Verified DTR & Task Log','Automated geofence-verified attendance records and daily task accomplishments.',`<div style="display:flex; gap:8px;">${b('Export PDF', 'ref-export-dtr', 'pdf', 'secondary', 'download')} ${b('Export CSV', 'ref-export-dtr', 'csv', 'secondary', 'download')}</div>`)+`<div class="ref-identity">${person(s)}${b(tasks?'View Shift Timestamps':'View Full Task Descriptions','ref-task-view','','secondary small')}</div>`+panel('Verified Shift Log Sheets',table(tasks?['Date','Task Description','Verification Status','Oversight']:['Date','Day','Time In','Time Out','Break','Total Hours','Verification Status','Oversight'],items.map(l=>{const stBadge=l.status==='Approved'?'<span class="badge green">✓ Verified On-Site</span>':(l.status==='Flagged'?'<span class="badge red">⚠️ Flagged Exception</span>':badge(l.status));return `<tr><td>${date(l.date)}</td>${tasks?'<td>'+e(l.task)+'</td>':'<td>'+new Date(l.date+'T12:00:00').toLocaleDateString('en',{weekday:'long'})+'</td><td>'+time(l.clockIn)+'</td><td>'+time(l.clockOut)+'</td><td>'+(l.breakMinutes?'<span style="color:#854d0e;">'+l.breakMinutes+'m</span>':'—')+'</td><td>'+l.hours+' hrs</td>'}<td>${stBadge}</td><td>${b('📖 Task & Map','log-detail',l.id,'secondary small')}</td></tr>`;})))+stats([['Auto-Verified Hours',approvedHours(db(),id)+' Hours'],['Required Hours',s.requiredHours+' Hours'],['Remaining Hours',Math.max(0,s.requiredHours-approvedHours(db(),id))+' Hours']]);}
    if(sub==='review'){
      if(role!=='Coordinator')throw new Error('Coordinator access required.');
      const l=logs.find(l=>l.id===id);
      if(!l)throw new Error('DTR unavailable.');
      const stu = c.student(l.studentId) || student(l.studentId) || { name: 'kenzosomes', company: 'Accenture Philippines' };
      const hte = (window.menteelogGps && window.menteelogGps.getHte(stu?.company || 'Accenture Philippines')) || { lat: 10.7167, lng: 122.5458, name: 'Accenture Philippines' };
      const isRecOnSite = l.status === 'Approved' || Boolean(l.remarks && l.remarks.includes('Verified on-site'));
      let recLat = hte.lat + 0.00008;
      let recLng = hte.lng + 0.00006;
      if (l.remarks) {
        const m = l.remarks.match(/(\d+\.\d+)°?[NS]?,\s*(\d+\.\d+)°?[EW]?/);
        if (m) {
          recLat = parseFloat(m[1]);
          recLng = parseFloat(m[2]);
        } else if (!isRecOnSite) {
          recLat = hte.lat + 0.0215;
          recLng = hte.lng + 0.0185;
        }
      } else if (!isRecOnSite) {
        recLat = hte.lat + 0.0215;
        recLng = hte.lng + 0.0185;
      }
      setTimeout(() => {
        if (window.menteelogGps && document.getElementById('modal-record-map-' + l.id)) {
          window.menteelogGps.renderMap('modal-record-map-' + l.id, recLat, recLng, hte.lat, hte.lng, hte.name, isRecOnSite);
        }
      }, 100);

      return back('dtr')+heading('Review DTR Entry','Review the original record, supporting justification, and required corrections.')+`<div class="ref-identity">${person(stu)}${badge(l.status)}</div><div class="grid-2">${panel('Original Record',`<dl class="ref-facts"><dt>Date</dt><dd>${date(l.date)}</dd><dt>Clock In</dt><dd>${time(l.clockIn)}</dd><dt>Clock Out</dt><dd>${time(l.clockOut)}</dd><dt>Break Time</dt><dd>${l.breakMinutes?'<span style="color:#854d0e;">'+l.breakMinutes+' minutes</span>':'None'}</dd><dt>Hours</dt><dd>${l.hours}</dd></dl><h3>Task Summary</h3><p>${e(l.task)}</p>`)}${panel('Justification & Review',`<p><strong>Intern Justification:</strong> ${e(l.justification||'No justification submitted.')}</p><p>${e((l.remarks||'No supervisor remarks.').split(' | [Coordinator Note:')[0])}</p><p><strong>Geofence Telemetry:</strong> ${isRecOnSite?'<span style="color:#166534; font-weight:600;">✓ Verified Inside 100m HTE Perimeter</span>':'<span style="color:#991b1b; font-weight:600;">⚠️ Captured Outside 100m HTE Perimeter</span>'}</p><div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap;"><button type="button" class="btn primary small" data-action="view-record-map" data-id="${e(l.id)}" style="display:inline-flex; align-items:center; gap:6px;">🗺️ Toggle Record Map</button><button type="button" class="btn secondary small" data-action="fullscreen-record-map" data-id="${e(l.id)}" style="display:inline-flex; align-items:center; gap:6px;">⛶ Wide / Fullscreen</button></div><div id="modal-record-map-${e(l.id)}" style="display:block; margin-top:14px; width:100%; height:240px; background:#f1f5f9; border-radius:8px; overflow:hidden; border:1px solid #cbd5e1; position:relative;"></div>`)}</div>`+panel('Compliance Review',form(sel('Compliance status','status',['Flagged','Pending'],l.status==='Pending'?'Pending':'Flagged')+ta('Coordinator remarks','remarks',l.coordinatorRemarks||'','required minlength="10"'),v=>{(async () => {
l.coordinatorRemarks = v.remarks;
l.status = v.status;
try { localStorage.setItem('menteelog.sim.coord_remarks.' + l.id, v.remarks); } catch(e) {}
const baseRemarks = String(l.remarks || '').split(' | [Coordinator Note:')[0];
const combinedRemarks = `${baseRemarks} | [Coordinator Note: ${v.remarks}]`;
l.remarks = combinedRemarks;
try {
  let { error } = await supabase.from('logs').update({ coordinator_remarks: v.remarks, status: v.status, remarks: combinedRemarks }).eq('id', l.id);
  if (error) {
    await supabase.from('logs').update({ status: v.status, remarks: combinedRemarks }).eq('id', l.id);
  }
  await c.syncRemote(supabase, db());
} catch(err) {
  console.warn('Coordinator review sync warning:', err);
}
const supTargetId = l.supervisorId || stu?.supervisorId || 'v1';
c.notify(supTargetId,'DTR_Event','DTR compliance review',(stu?.name||'Student')+': '+v.remarks);
finish('Compliance review saved and forwarded to the Supervisor Exception Queue.','dtr','flagged');
})();
},'Save & Notify Supervisor'));}
    if(role==='Coordinator'){
      const students=visibleStudents(db(),u()),flagged=logs.filter(l=>['Flagged','Rejected'].includes(l.status)),pending=logs.filter(l=>l.status==='Pending'),approved=logs.filter(l=>l.status==='Approved');
      if(sub==='flagged')return back('dtr')+heading('Flagged DTR Entries','Review attendance anomalies and supporting justifications.')+(flagged.length?`<div class="ref-alert">${flagged.length} entries require compliance review. Supervisor approval remains required.</div>`+panel('',table(['Student','Date','Flag Reason','Original Entry','Status','Action'],flagged.map(l=>`<tr><td>${e(c.student(l.studentId)?.name)}</td><td>${date(l.date)}</td><td>${e((l.remarks||'Attendance review required').split(' | [Coordinator Note:')[0])}</td><td>${time(l.clockIn)} – ${time(l.clockOut)}</td><td>${badge(l.status)}</td><td>${nav('Review Details','dtr','review',l.id,'secondary small')}</td></tr>`))):`<div class="ref-banner" style="background: #f0fdf4; border-color: #bbf7d0; color: #166534; margin-bottom: 16px;"><svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:-3px;margin-right:6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><strong>All Clean:</strong> No attendance records are currently flagged.</div>`+panel('',empty('No Flagged Entries','All student attendance records are verified and compliant.')));
      const deptSummary=(()=>{const courseNames={'BSIT':'BS Information Technology'};const getCourse=s=>(s.course&&s.course.trim())?s.course.trim():'BSIT';const distinct=[...new Set(students.map(getCourse))];if(!distinct.length)return empty('No Department Data','Student attendance and hours logs will appear here once students are enrolled.');const cards=distinct.map(course=>{const cohort=students.filter(s=>getCourse(s)===course),hrs=cohort.reduce((n,s)=>n+approvedHours(db(),s.id),0),total=cohort.reduce((n,s)=>n+(s.requiredHours||500),0),pct=total>0?Math.min(100,Math.round(hrs/total*100)):0,avg=cohort.length>0?(hrs/cohort.length).toFixed(1):'0.0',courseTitle=courseNames[course]||course;return `<div style="background: var(--sand, #f8fafc); border: 1px solid var(--line-strong, #e2e8f0); border-radius: 10px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"><span style="display: inline-block; padding: 4px 10px; border-radius: 5px; font-weight: 700; font-size: 11px; letter-spacing: 0.5px; background: var(--burgundy, #7b1113); color: #fff;">${e(course)}</span><span style="font-size: 12px; font-weight: 500; color: var(--slate, #64748b); background: var(--cream, #fff); padding: 3px 10px; border-radius: 999px; border: 1px solid var(--line-strong, #e2e8f0);">${cohort.length} ${cohort.length===1?'Intern':'Interns'}</span></div><div><h3 style="margin: 0 0 2px 0; font-size: 15px; font-weight: 600; color: var(--ink, #1e293b);">${e(courseTitle)}</h3><p style="margin: 0; font-size: 12px; color: var(--slate, #64748b);">Academic Program Progress</p></div><div><div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;"><div><strong style="font-size: 24px; font-weight: 700; color: var(--ink, #1e293b);">${hrs}h</strong><span style="font-size: 12px; color: var(--slate, #64748b); margin-left: 4px;">rendered / ${total}h required</span></div><strong style="font-size: 14px; font-weight: 700; color: ${pct>0?'#166534':'var(--slate, #64748b)'};">${pct}%</strong></div><div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; position: relative;"><div style="width: ${pct}%; height: 100%; background: var(--burgundy, #7b1113); border-radius: 999px; transition: width 0.4s ease;"></div></div></div><div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--line-strong, #e2e8f0); font-size: 11px; color: var(--slate, #64748b);"><span>Avg per intern: <strong style="color: var(--ink, #1e293b);">${avg}h</strong></span><span>Remaining: <strong style="color: var(--ink, #1e293b);">${Math.max(0, total - hrs)}h</strong></span></div></div>`;}).join('');return `<p class="small muted" style="margin-top: -6px; margin-bottom: 18px;">Aggregate training hours, student counts, and completion rates by academic department.</p><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">${cards}</div>`;})();
      return heading('DTR Compliance Monitor','Monitor daily time records, compliance risks, and training completion.',b('Compliance Settings','ref-compliance-settings','','secondary'))+`<div class="ref-compliance-stats">${stats([['Total Deployed Students',students.filter(s=>s.company).length,'users'],['Compliance Rate',Math.round(approved.length/Math.max(1,logs.length)*100)+'%','check'],['Non-compliant',flagged.length,'alert'],['Pending Review',pending.length,'clock']])}</div>`+panel('',search('Search student, SR code or company'))+panel('Student Compliance Overview',table(['Student Name','Program','HTE Company','Hours Progress','Status','Action'],students.filter(s=>match(s.name,s.identifier,s.company)).map(s=>`<tr><td><strong>${e(s.name)}</strong></td><td>${e(s.course||'BSIT')}</td><td>${e(s.company||'Unassigned')}</td><td>${progress(approvedHours(db(),s.id),s.requiredHours)}</td><td>${badge(flagged.some(l=>l.studentId===s.id)?'Flagged':'Active')}</td><td>${nav('View Details','dtr','profile',s.id,'secondary small')}</td></tr>`)))+panel('',`<div class="row between" style="margin-bottom: 20px;"><h2>Flagged Entries</h2>${b('Run Auto Verification','ref-scan','','secondary small')}</div>`+(flagged.length===0?`<div style="text-align: center; padding: 36px 16px; border: 1px dashed var(--border, #e2e8f0); border-radius: 8px; background: #fafafa; margin-bottom: 16px;"><svg viewBox="0 0 24 24" style="width: 32px; height: 32px; fill: none; stroke: #16a34a; stroke-width: 2; margin: 0 auto 10px auto; display: block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><strong style="display: block; font-size: 15px; color: var(--ink, #1e293b); margin-bottom: 4px;">No Flagged Entries</strong><p style="margin: 0; font-size: 13px; color: var(--slate, #64748b);">All submitted attendance logs are compliant. No anomalies or geofence breaches detected.</p></div>`:table(['Student','Date','Reason','Status','Action'],flagged.slice(0,5).map(l=>`<tr><td>${e(c.student(l.studentId)?.name)}</td><td>${date(l.date)}</td><td>${e((l.remarks||'Review needed').split(' | [Coordinator Note:')[0])}</td><td>${badge(l.status)}</td><td>${nav('Review Details','dtr','review',l.id,'secondary small')}</td></tr>`)))+`<div style="margin-top: 18px;">${nav('View All Flagged Entries','dtr','flagged','','secondary small')}</div>`)+panel('Department Hours Log',deptSummary);
    }
    if(role==='Supervisor'){
        const list=logs.filter(l=>match(c.student(l.studentId)?.name,l.date,l.task)&&(c.view.filter==='All'||(c.view.filter==='Flagged'?['Flagged','Pending'].includes(l.status):l.status===c.view.filter)));
        const flaggedList=logs.filter(l=>['Flagged','Pending'].includes(l.status));
        
        const myStudents = visibleStudents(db(), u());
        const totalRendered = Number(myStudents.reduce((sum, s) => sum + approvedHours(db(), s.id), 0).toFixed(2));
        const totalRequired = myStudents.reduce((sum, s) => sum + (s.requiredHours || 500), 0);
        const totalRemaining = Math.max(0, Number((totalRequired - totalRendered).toFixed(2)));
        const hoursAccomplished = totalRequired > 0 && totalRendered >= totalRequired;

        const supervisorStatsHtml = stats([
          ['Total Rendered Hours', totalRendered + ' Hours', 'check'],
          ['Required Hours', totalRequired + ' Hours', 'target'],
          ['Remaining Hours', totalRemaining + ' Hours', 'clock']
        ]);

        const flaggedKey = flaggedList.map(l => l.id + ':' + l.status).sort().join('|');
        let isBannerRead = c.view.dismissedExceptionBanner === flaggedKey;
        if (!isBannerRead && flaggedKey) {
          try { isBannerRead = localStorage.getItem('menteelog.sim.sup_exception_banner_read') === flaggedKey; } catch(e) {}
        }

        const oversightBannerHtml = (flaggedList.length > 0 && !isBannerRead) ? `
          <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:14px 18px; margin-top:16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="width:34px; height:34px; border-radius:50%; background:#fee2e2; color:#991b1b; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; flex-shrink:0;">!</span>
              <div>
                <strong style="display:block; font-size:14px; color:#7f1d1d;">Management by Exception — ${flaggedList.length} Flagged Shift(s) in Queue</strong>
                <span style="font-size:12.5px; color:#991b1b;">Normal on-site shifts are auto-verified. Step in only for the flagged off-site or anomalous log(s) below.</span>
              </div>
            </div>
            <button type="button" class="text-btn small" data-action="ref-dismiss-exception-banner" data-id="${e(flaggedKey)}" style="color:#991b1b; font-weight:700; font-size:12.5px; cursor:pointer; background:#fee2e2; border:1px solid #fca5a5; padding:6px 12px; border-radius:6px; white-space:nowrap;">
              ✓ Mark as Read
            </button>
          </div>
        ` : (hoursAccomplished ? `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:14px 18px; margin-top:16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="width:34px; height:34px; border-radius:50%; background:#dcfce7; color:#166534; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; flex-shrink:0;">✓</span>
              <div>
                <strong style="display:block; font-size:14px; color:#14532d;">OJT Hours Accomplished (${totalRendered} / ${totalRequired} Hours) — Ready for Final Evaluation</strong>
                <span style="font-size:12.5px; color:#166534;">Your assigned intern has completed the required training hours. You may now proceed with the Final Performance Appraisal.</span>
              </div>
            </div>
            ${nav('Open Performance Appraisals ›', 'appraisals', '', '', 'secondary small')}
          </div>
        ` : '');

        const headerHtml = heading('Log Sheets & Summary','Review auto-verified on-site shifts, daily task accomplishments, and any flagged off-site exceptions.') + 
            supervisorStatsHtml + oversightBannerHtml;
        
        const toolbarHtml = '<div class="ref-attendance-toolbar" style="margin-top: 12px; margin-bottom: 8px;">' + search('Search intern name, date, or task summary…') + '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; width: 100%;">' + filter([['All','All Shift Logs'],['Approved','✓ Verified On-Site'],['Flagged','⚠️ Flagged ('+flaggedList.length+')']]) + '</div></div>';
        
        const historyPanel = panel('Verified Shift Logs & Daily Task Summaries', (() => {
            if(!list.length) return empty('No Shift Logs in This View', 'Auto-verified on-site shifts and daily task summaries from your interns appear here.');
            let historyRows = list.map(l=>{
                const st = c.student(l.studentId);
                const sName = st?.name || (l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' ? 'kenzosomes' : 'Assigned Intern');
                const sCourse = st?.course || 'BSIT';
                const coordNote = l.coordinatorRemarks || (l.remarks && l.remarks.includes(' | [Coordinator Note: ') ? l.remarks.split(' | [Coordinator Note: ')[1].replace(/\]$/, '') : '');
                const taskHtml = l.task ? e(l.task) : (l.status === 'Awaiting_Student_Log' ? '<span class="task-excerpt" style="color:var(--slate); font-style:italic;">Pending intern logbook submission</span>' : '<span class="task-excerpt" style="color:var(--slate); font-style:italic;">No task summary entered</span>');
                const breakHtml = l.breakMinutes ? '<span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#854d0e;font-weight:600;"><span style="width:6px;height:6px;border-radius:50%;background:#854d0e;"></span>' + l.breakMinutes + 'm</span>' : '<span style="font-size:12px;color:var(--slate);">—</span>';
                const geofenceBadgeHtml = l.status === 'Approved' ? '<span class="badge green">📍 Inside 100m</span>' : (['Flagged','Pending'].includes(l.status) ? '<span class="badge red">⚠️ Outside 100m</span>' : badge(l.gps?'Captured':'Unavailable'));
                const statusBadgeHtml = (l.status === 'Approved' ? '<span class="badge green" title="' + e(l.remarks || 'Automatically verified on-site within 100m HTE geofence') + '">✓ Verified On-Site</span>' : (['Flagged','Pending'].includes(l.status) ? '<span class="badge red" title="' + e(l.remarks || 'Logged outside 100m geofence — exception review required') + '">⚠️ Flagged Exception</span>' : badge(l.status))) + (coordNote ? '<div style="margin-top:4px;"><span class="badge blue" style="font-size:10.5px;" title="Coordinator Note: ' + e(coordNote) + '">📋 Coordinator Note</span></div>' : '');
                const actionButtonsHtml = (['Pending','Flagged'].includes(l.status)
                    ? b('⚠️ Review Exception','log-detail',l.id,'primary small')
                    : b('📖 Read Task & Map','log-detail',l.id,'secondary small') + nav('Log Sheet','dtr','profile',l.studentId,'secondary small'));
                return '<tr><td><strong>' + e(sName) + '</strong><br><small>' + e(sCourse) + '</small></td><td>' + date(l.date) + '</td><td>' + time(l.clockIn) + '</td><td>' + time(l.clockOut) + '</td><td>' + breakHtml + '</td><td><span class="task-excerpt">' + taskHtml + '</span></td><td>' + geofenceBadgeHtml + '</td><td>' + statusBadgeHtml + '</td><td><div class="row" style="flex-wrap:wrap; gap:4px; max-width:260px;">' + actionButtonsHtml + '</div></td></tr>';
            });
            return table(['Intern','Date','Clock In','Clock Out','Break','Daily Task Summary','Geofence','Verification','Oversight'], historyRows) + '<style>.table-wrap { overflow-x: auto !important; } .table-wrap table { width: 100%; table-layout: auto; } .table-wrap td { white-space: normal !important; word-break: break-word; } .task-excerpt { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-width: 150px; max-width: 250px; } td:last-child .row { max-width: 240px !important; justify-content: flex-start; }</style>';
        })());
        
        return headerHtml + toolbarHtml + historyPanel;
    }
    // Student: clock and task draft at left, history and saved drafts at right.
    if(sub==='history') return back('dtr') + heading('DTR History', 'Complete geofence-verified attendance and task records.', b('Clear Test Records', 'ref-clear-test-logs', '', 'secondary small', 'trash')) + `<div class="ref-alert" style="margin-bottom: 16px;"><svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;vertical-align:-2px;margin-right:6px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><strong>Lock Enabled:</strong> All past and submitted DTR entries are strictly READ-ONLY. Modification of timestamps is permanently restricted.</div>` + filter([['All','All Shifts'],['Approved','✓ Verified On-Site'],['Flagged','⚠️ Flagged (Exception)'],['Rejected','Rejected']]) + panel('', c.dtrTable(logs.filter(l=>c.view.filter==='All'||l.status===c.view.filter), u()));
      const activeShiftObj = (db().activeShifts || []).find(sh => sh.studentId === u().id);
      const runningLog = logs.find(sh => sh.studentId === u().id && sh.status === 'Running');
      const shift = runningLog || activeShiftObj || null;
      const awaiting = logs.find(l => (l.studentId === u().id || (u().email === 'kenzosomes@gmail.com' && (l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' || l.studentId === 's1')) || (u().id === '22227dcf-933f-40a9-9340-f66cb9020e5c' && l.studentId === 's1')) && l.status === 'Awaiting_Student_Log');
      const hrs = approvedHours(db(), u().id);
      const list = logs.filter(l => c.view.filter === 'All' || l.status === c.view.filter);
      const drafts = (db().taskDrafts || []).filter(d => d.studentId === u().id);
      if(sub==='drafts') return back('dtr') + heading('Saved Drafts History', 'Review all your previously saved task summary drafts.', b('+ Write New Draft', 'ref-draft-new', '', 'primary', 'file')) + panel('', drafts.length?table(['Date','Task Summary','Action'],drafts.map(d=>`<tr><td>${date(d.date)}</td><td><span class="task-excerpt">${e(d.task)}</span></td><td><div class="row" style="gap:4px;">${b('View','ref-draft-view',d.id,'secondary small')}${b('Edit','ref-draft-edit',d.id,'secondary small')}</div></td></tr>`)):empty('No saved drafts','Save a task summary draft to continue or submit it later.'));

      const totalBreakMinutes = Math.max(activeShiftObj?.breakMinutes || 0, runningLog?.breakMinutes || 0);
      const totalBreakMs = Math.max(activeShiftObj?.breakMs || 0, runningLog?.breakMs || 0);
      const breakStart = activeShiftObj?.onBreak || activeShiftObj?.justification || runningLog?.justification || runningLog?.onBreak || null;
      const isBreak = Boolean(breakStart);
      if (shift) {
        shift.breakMinutes = totalBreakMinutes;
        if (totalBreakMs) shift.breakMs = totalBreakMs;
        if (breakStart) {
          shift.onBreak = breakStart;
          shift.justification = breakStart;
        }
      }

      const shiftBadgeHtml = shift ? (isBreak ? '<div class="badge" style="background:#fefce8;color:#854d0e;font-size:11px;font-weight:600;padding:2px 8px;">On Lunch Break</div>' : '<div class="badge" style="background:#dcfce7;color:#166534;font-size:11px;font-weight:600;padding:2px 8px;"><span style="display:inline-block;width:6px;height:6px;background:#16a34a;border-radius:50%;margin-right:4px;animation:tk-pulse 2s infinite;"></span>Active On-Site</div>') : '<div class="badge" style="background:#f1f5f9;color:#334155;font-size:11px;font-weight:600;padding:2px 8px;">Clocked Out</div>';

      // Calculate today’s rendered hours
      let shiftHrsRendered = 0;
      if (shift) {
         const rawTotal = Math.max(0, (Date.now() - new Date(shift.clockIn).getTime()) / 3600000);
         let breakHrs = totalBreakMs ? (totalBreakMs / 3600000) : ((totalBreakMinutes || 0) / 60);
         if (isBreak && breakStart) {
           breakHrs += Math.max(0, (Date.now() - new Date(breakStart).getTime()) / 3600000);
         }
         shiftHrsRendered = Math.max(0, rawTotal - breakHrs);
      }
      const remainingHrs = Math.max(0, 8 - shiftHrsRendered);
      const hrsRem = Math.floor(remainingHrs);
      const minsRem = Math.floor((remainingHrs - hrsRem) * 60);

      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];
      const weeklyLogs = logs.filter(l => l.date >= startOfWeek && l.status === 'Approved');
      const weeklyHours = weeklyLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
      const weeklyPendingLogs = logs.filter(l => l.date >= startOfWeek && (l.status === 'Pending' || l.status === 'Running' || l.status === 'Awaiting_Student_Log'));
      const weeklyPendingHours = weeklyPendingLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
      const weeklyPct = Math.min(100, Math.round(((weeklyHours + weeklyPendingHours) / 40) * 100)) || 0;

      const pendingTotalHours = logs.filter(l => l.status === 'Pending' || l.status === 'Running' || l.status === 'Awaiting_Student_Log').reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
      const totalPct = Math.min(100, Math.round(((hrs + pendingTotalHours + shiftHrsRendered) / u().requiredHours) * 100)) || 0;

      const customStatsHtml = `<div class="ref-stats">
        <div>
          <div class="row between align-start mb0" style="width: 100%; margin-bottom: 4px;">
            <span>Current Shift Status</span>
            ${shiftBadgeHtml}
          </div>
          <strong>${shift ? 'Clocked in at ' + time(shift.clockIn) : 'Not clocked in'}</strong>
          ${shift ? `<div style="margin-top:8px; font-size:12px; color:var(--slate);">${hrsRem}h ${minsRem}m remaining until 8hr completion</div><div style="background:#e2e8f0; height:4px; width:100%; border-radius:2px; margin-top:4px;"><div style="background:var(--burgundy); height:100%; width:${Math.min(100, (shiftHrsRendered/8)*100)}%;"></div></div>` : ''}
        </div>
        <div>
          <div class="row between align-start mb0" style="width: 100%; margin-bottom: 4px;">
            <span>${isBreak ? 'Lunch / Break Timer' : 'Hours Rendered This Week'}</span>
            <div class="badge" style="background:${isBreak ? '#fefce8' : (weeklyPendingHours > 0 && weeklyHours === 0 ? '#fef3c7' : '#f1f5f9')};color:${isBreak ? '#854d0e' : (weeklyPendingHours > 0 && weeklyHours === 0 ? '#92400e' : '#334155')};font-size:11px;font-weight:600;padding:2px 8px;">${isBreak ? 'PAUSED' : (weeklyPendingHours > 0 && weeklyHours === 0 ? 'Pending Verification' : weeklyPct+'% Done')}</div>
          </div>
          <strong>${isBreak ? `<span class="tk-timer tk-break-timer" style="color:#854d0e;" data-start="${breakStart}">${elapsed ? elapsed(breakStart) : '00:00:00'}</span>` : (weeklyHours > 0 ? weeklyHours.toFixed(1) : (weeklyPendingHours > 0 ? weeklyPendingHours.toFixed(1) + ' (Pending)' : '0.0')) + ' / 40.0 Hours'}</strong>
          ${isBreak ? `<div style="margin-top:8px; font-size:12px; color:#854d0e;">Session time is currently paused${totalBreakMinutes ? ` (${totalBreakMinutes}m previously taken)` : ''}</div>` : (weeklyPendingHours > 0 ? `<div style="margin-top:6px; font-size:11px; color:#92400e;">${weeklyPendingHours.toFixed(1)}h submitted & awaiting supervisor verification</div>` : '')}
        </div>
        <div>
          <div class="row between align-start mb0" style="width: 100%; margin-bottom: 4px;">
            <span>Total OJT Progress Meter</span>
            <div class="badge" style="background:#FCE7F3;color:#9F1239;font-size:11px;font-weight:600;padding:2px 8px;">${totalPct}% Completed</div>
          </div>
          <strong>${(hrs + shiftHrsRendered + (hrs === 0 ? pendingTotalHours : 0)).toFixed(1)} / ${u().requiredHours} Hours</strong>
          <div style="background:#e2e8f0; height:6px; width:100%; border-radius:3px; margin-top:12px; position:relative;">
             <div style="background:#9F1239; height:100%; width:${totalPct}%; border-radius:3px;"></div>
          </div>
          ${pendingTotalHours > 0 ? `<div style="margin-top:6px; font-size:11px; color:#92400e;">${pendingTotalHours.toFixed(1)}h awaiting supervisor approval</div>` : ''}
        </div>
      </div>`;


      const studentDisclaimerHtml = `<div class="ref-alert" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; padding:14px 18px; border-radius:10px; margin-bottom:20px; display:flex; align-items:flex-start; gap:12px; font-size:13.5px; line-height:1.5;">
        <svg viewBox="0 0 24 24" style="width:20px;height:20px;min-width:20px;fill:none;stroke:#2563eb;stroke-width:2;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div>
          <strong style="display:block; font-size:14px; margin-bottom:3px; color:#1e3a8a;">Official OJT Policy & Timekeeping Notice</strong>
          The time recorded within this portal represents <strong>estimated student tracking hours</strong> for academic monitoring and daily logbook documentation. In accordance with university OJT policy, students are still required to officially clock in and clock out using the timekeeping facilities (biometric, RFID, or logbook) at their assigned Host Training Establishment (HTE) in order to obtain the mandatory official Certificate of Completion.
        </div>
      </div>`;

      return heading('Attendance & DTR','Log your attendance, submit daily accomplishments, and review your time records.',b('Export Log Summary','ref-export-modal','','secondary','download')) + studentDisclaimerHtml + customStatsHtml + `<div class="reference-dtr ref-student-dtr"><div>

  ${panel('', `
    <div style="text-align: center; padding: 12px 0; position: relative;">

      <span class="eyebrow" style="display:inline-block; margin-bottom:16px;">TODAY · ${date(today())}</span>
      <div class="timer" id="shift-timer" style="font-size: clamp(34px, 7.5vw, 52px); font-weight: 800; color: ${isBreak ? '#854d0e' : 'var(--ink)'}; line-height: 1; margin-bottom: 8px; font-variant-numeric: tabular-nums;">
        ${shift ? (netElapsed ? netElapsed(shift) : '00:00:00') : '00:00:00'}
      </div>
      <p class="muted" style="margin-bottom: 24px;">${shift?.clockOut?'Clocked out — daily log ready to submit':shift?'You are currently clocked in':'Not clocked in'}</p>
      
      
      <div style="background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; box-shadow: var(--shadow-sm); margin-bottom: 24px;">
          <h3 style="margin-top: 0; font-size: 16px;">Attendance Timekeeping & Shift Controls</h3>
          <p class="muted small" style="margin-bottom:18px;">Log your on-site attendance, take lunch breaks, and clock out to submit your daily accomplishment summary.</p>
          ${awaiting ? `
            <div style="background:#fefce8; color:#854d0e; padding:16px; border-radius:8px; margin-bottom:16px; border:1px solid #fde047; text-align:center;">
              <strong style="display:block; font-size:14px; margin-bottom:4px; color:#713f12;">Shift Clocked Out</strong>
              Your shift hours have been recorded. Complete and submit your daily summary logbook for supervisor approval.
            </div>
            ${b('Submit Daily Summary Logbook', 'ref-submit-log', '', 'primary full', 'file')}
          ` : (shift ? `
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:6px 14px; border-radius:20px; font-size:12.5px; font-weight:600; margin:0 auto; ${isBreak ? 'background:#fefce8; color:#854d0e; border:1px solid #fef08a;' : 'background:#dcfce7; color:#166534; border:1px solid #bbf7d0;'}">
                <span style="width:8px; height:8px; border-radius:50%; ${isBreak ? 'background:#854d0e;' : 'background:#16a34a; animation:tk-pulse 2s infinite;'}"></span>
                ${isBreak ? 'On Lunch / Break (Work Timer Paused)' : 'Active On-Site (Shift Timer Running)'}
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:6px;">
                <button class="btn secondary" data-action="student-toggle-break" style="flex:1 1 140px; padding:9px 14px; font-size:13px; font-weight:600;">
                  ${isBreak ? '☕ End Break & Resume' : '☕ Start Lunch / Break'}
                </button>
                <button class="btn primary" data-action="student-clock-out" style="flex:1 1 120px; padding:9px 14px; font-size:13px; font-weight:700; background:#991b1b; border-color:#991b1b;">
                  Clock Out
                </button>
              </div>
              <p class="small muted" style="margin:4px 0 0;">Clocked in at ${time(shift.clockIn)}${totalBreakMinutes ? ' · ' + totalBreakMinutes + 'm break recorded' : (totalBreakMs >= 1000 ? ' · ' + Math.round(totalBreakMs/1000) + 's break recorded' : '')}${isBreak ? ' · Break in progress' : ''}</p>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:10px;">
              <button class="btn primary full" data-action="student-clock-in" style="padding:10px 18px; font-size:14px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px;">
                ${icon('clock')} Clock In
              </button>
              <p class="small muted" style="margin:0;">Click to record your time-in and start today's shift tracking.</p>
            </div>
          `)}
      </div>


    <style>
      .dtr-map-loader { display: none; flex-direction: column; align-items: center; justify-content: center; position: absolute; inset: 0; background: rgba(250,248,245,0.9); z-index: 10; backdrop-filter: blur(2px); }
      .location-panel:has(button[data-action="clock"]:disabled) .dtr-map-loader { display: flex; }
      .radar-ping { width: 48px; height: 48px; border-radius: 50%; border: 3px solid rgba(88,17,26,0.2); border-top-color: #58111A; animation: spin 1s linear infinite; margin-bottom: 16px; }
      @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>

    ${(() => {
      const gps = (window.menteelogGps && window.menteelogGps.state) || { lat: 10.71678, lng: 122.54586, accuracy: 8, isOnSite: true, distanceMeters: 11, isMapExpanded: false };
      const hte = (window.menteelogGps && window.menteelogGps.getHte(u().company)) || { name: u().company || 'Accenture Philippines', lat: 10.7167, lng: 122.5458, radiusMeters: 100 };
      const isOnSite = gps.isOnSite;
      const distText = isOnSite 
        ? `${gps.distanceMeters}m from ${e(hte.name)}` 
        : `${(gps.distanceMeters/1000).toFixed(2)} km away from ${e(hte.name)}`;

      return `
        <div class="location-panel" style="margin-top: 24px; border: 1px solid var(--border); border-radius: 12px; padding: 20px; background: #ffffff; text-align: left; box-shadow: var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-size:15px; color:var(--ink);">${icon('pin')} HTE Geofence Verification</strong>
              ${isOnSite 
                ? '<span class="badge green" style="padding:4px 10px; font-weight:700;">✓ Inside Geofence (On-Site)</span>' 
                : '<span class="badge red" style="padding:4px 10px; font-weight:700;">⚠️ Outside Geofence (Off-Site)</span>'}
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn secondary small" data-action="toggle-live-map" style="display:inline-flex; align-items:center; gap:6px; font-weight:600;">
                🗺️ ${gps.isMapExpanded ? 'Hide Map ▴' : 'Expand Geofence Map ▾'}
              </button>
              <button type="button" class="btn secondary small" data-action="fullscreen-live-map" style="display:inline-flex; align-items:center; gap:6px; font-weight:600;" title="Open Wide Fullscreen View">
                ⛶ Wide / Fullscreen
              </button>
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <strong style="display:block; font-size:14px; color:var(--ink); margin-bottom:2px;">${e(hte.name)}</strong>
            <span class="small muted" style="font-family:monospace;">Coordinates: ${gps.lat.toFixed(5)}° N, ${gps.lng.toFixed(5)}° E (±${gps.accuracy}m)</span>
          </div>

          ${isOnSite ? `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; color:#166534; font-size:13px;">
              <strong style="display:block; margin-bottom:2px;">📍 Verified On-Site (${distText})</strong>
              You are within the accredited 100-meter workplace perimeter. Attendance will be automatically verified on clock-out.
            </div>
          ` : `
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:10px 14px; color:#991b1b; font-size:13px;">
              <strong style="display:block; margin-bottom:2px;">⚠️ Outside Accredited Geofence (${distText})</strong>
              You are outside the workplace perimeter. If you clock in and out from here, your shift will be <strong>flagged for supervisor review and justification</strong>.
            </div>
          `}

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-top:14px; padding-top:10px; border-top:1px dashed #e2e8f0; font-size:12px; color:var(--slate);">
            <span>Test Proximity Simulator:</span>
            <div style="display:flex; gap:6px;">
              <button type="button" class="btn secondary small" data-action="sim-gps-onsite" style="padding:3px 10px; font-size:11px; ${isOnSite ? 'background:#dcfce7; border-color:#86efac; color:#166534; font-weight:700;' : ''}">📍 Simulate On-Site</button>
              <button type="button" class="btn secondary small" data-action="sim-gps-offsite" style="padding:3px 10px; font-size:11px; ${!isOnSite ? 'background:#fee2e2; border-color:#fca5a5; color:#991b1b; font-weight:700;' : ''}">🚗 Simulate Off-Site (2.5 km)</button>
            </div>
          </div>

          ${gps.isMapExpanded ? `
            <div style="margin-top:16px; position:relative;">
              <button type="button" class="btn secondary small" data-action="fullscreen-live-map" style="position:absolute; top:10px; right:10px; z-index:1000; background:#ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.25); font-weight:700; font-size:12px; padding:5px 10px; border-radius:6px; cursor:pointer;" title="Open Wide Fullscreen View">
                ⛶ Fullscreen
              </button>
              <div id="dtr-live-map" style="width:100%; height:230px; border-radius:8px; border:1px solid #cbd5e1; overflow:hidden; background:#f1f5f9;"></div>
              <p class="small muted" style="margin:6px 0 0; text-align:right;">Green circle indicates accredited 100m HTE geofence perimeter.</p>
            </div>
          ` : ''}

          <!-- Hidden spans for app.js legacy references -->
          <div style="display:none;"><span id="dtr-coords"></span><span id="dtr-acc"></span><span id="dtr-status"></span><div id="dtr-map-frame"></div></div>
        </div>
      `;
    })()}
  </div>
`)}
</div><div>${panel('Recent Clock-ins', (list.length ? `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><span class="small muted">Past shifts and accomplishments</span>${b('Clear Test Records', 'ref-clear-test-logs', '', 'secondary small', 'trash')}</div>` : '') + c.dtrTable(list.slice(0, 5), u()) + '<div style="margin-top: 24px; text-align: center;">' + nav('See All DTR History', 'dtr', 'history', '', 'secondary full') + '</div>')}${panel('Recent Saved Drafts', '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><span class="small muted">Prepare task accomplishments in advance</span>' + b('+ Write Task Draft', 'ref-draft-new', '', 'primary small', 'file') + '</div>' + (drafts.length ? table(['Date','Task Summary','Action'], drafts.slice(0,3).map(d=>`<tr><td>${date(d.date)}</td><td><span class="task-excerpt">${e(d.task)}</span></td><td><div class="row" style="gap:4px;">${b('View','ref-draft-view',d.id,'secondary small')}${b('Edit','ref-draft-edit',d.id,'secondary small')}</div></td></tr>`)) : empty('No saved drafts','Save a task summary draft to continue or submit it later.')) + '<div style="margin-top: 24px; text-align: center;">' + nav('See All Saved Drafts History', 'dtr', 'drafts', '', 'secondary full') + '</div>')}</div></div>`;
  }
  function elapsed(start,end){if(!start)return '00:00:00';const t=new Date(start).getTime();if(isNaN(t))return '00:00:00';const total=Math.max(0,Math.floor(((end?new Date(end).getTime():Date.now())-t)/1000));return [Math.floor(total/3600),Math.floor(total/60)%60,total%60].map(n=>String(n).padStart(2,'0')).join(':');}
  async function attendanceAction(name,id){
    if(['student-clock-in','student-toggle-break','student-clock-out','ref-clock-out','clock'].includes(name)) return false;
    if(name==='ref-dismiss-exception-banner'){
      c.view.dismissedExceptionBanner = id || '1';
      try { localStorage.setItem('menteelog.sim.sup_exception_banner_read', id || '1'); } catch(e) {}
      c.toast('Exception queue alert marked as read.');
      c.render();
      return true;
    }
    if(name==='ref-profile-tab'){c.view.profileTab=id;c.render();return true;}
    if(name==='ref-company-interns'){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');location.hash=href('candidates','company',id);return true;}
    if(name==='ref-task-view'){c.view.tasks=!c.view.tasks;c.render();return true;}
    if(name==='log-detail'&&u().role==='Coordinator'){location.hash=href('dtr','review',id);return true;}
    if(['ref-approve','ref-reject','ref-approve-all'].includes(name)){if(u().role!=='Supervisor')throw new Error('Supervisor access required.');const batch=name==='ref-approve-all',reject=name==='ref-reject',logs=visibleLogs(db(),u()).filter(l=>batch?l.status==='Pending':l.id===id&&['Pending','Flagged'].includes(l.status));if(!logs.length)throw new Error('No reviewable records found.');const body=(batch?`<p>Approve all ${logs.length} pending entries for your assigned interns?</p>`:stats([['Clock In',time(logs[0].clockIn)],['Clock Out',time(logs[0].clockOut)],['Total Hours',logs[0].hours+'h']])+`<h3>Task Summary</h3><p>${e(logs[0].task)}</p>`+(logs[0].justification?`<h3>Intern Off-Site Justification</h3><p style="background:#fffbeb; padding:10px 14px; border-radius:8px; border:1px solid #fde68a;">${e(logs[0].justification)}</p>`:'')+(logs[0].evidenceId?`<div style="margin-bottom:14px;">${b('📎 Preview Attached Evidence ('+e(logs[0].evidenceName||'Document')+')','ref-file-preview',logs[0].evidenceId,'secondary small')}</div>`:''))+ta(reject?'Reason for rejection / supervisor comments':'Supervisor remarks','remarks',reject?'':'Reviewed attendance and task summary.','required minlength="5"')+signatureFields()+f('Typed signature (frontend preview)','signature','text',u().name,'required maxlength="100"')+'<label class="row"><input type="checkbox" required> I reviewed these attendance records.</label>';c.showModal(batch?'Confirm Bulk Approval':reject?'Reject DTR Entry':'Approve DTR Entry',body,async(v,form)=>{const image=await signatureImage(form);const signatureId=image?crypto.randomUUID():null;if(image)await c.putFile(signatureId,image);const nextStatus=reject?'Rejected':'Approved';logs.forEach(l=>{l.status=nextStatus;l.remarks=v.remarks;l.signature=v.signature;if(signatureId)l.signatureFileId=signatureId;try{localStorage.removeItem('menteelog.sim.justification.'+l.id);}catch(e){}});const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;const uuidIds = logs.map(l=>l.id).filter(id => uuidRegex.test(id));if(uuidIds.length){try{const { error, data } = await supabase.from('logs').update({ status: nextStatus, remarks: v.remarks, signature: v.signature }).in('id', uuidIds).select();if(!error && data && data.length > 0){await syncRemote(supabase, db());}}catch(err){console.warn('Supervisor DTR review sync note:',err);}}logs.forEach(l=>{l.status=nextStatus;l.remarks=v.remarks;l.signature=v.signature;if(signatureId)l.signatureFileId=signatureId;c.notify(l.studentId,'DTR_Event',reject?'DTR entry rejected':'DTR entry approved',date(l.date)+': '+v.remarks,{targetPage:'dtr',targetLogId:l.id,role:'Student'});});finish(batch?'All pending DTR entries approved.':reject?'DTR entry rejected — returned for resubmission.':'DTR entry approved and signed.','dtr');},reject?'Confirm Rejection':'Confirm Approval');bindSignature(document.querySelector('#modal-form'));return true;}
    if(name==='ref-scan'){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');const issues=db().logs.filter(l=>!l.gps||l.hours<=0||l.hours>16);c.showModal('Attendance Validation Results',`<p>${db().logs.length} records checked. ${issues.length} need a location or duration review.</p><p>This local check does not verify GPS authenticity or approve attendance.</p>`+table(['Student','Date','Finding'],issues.map(l=>`<tr><td>${e(c.student(l.studentId)?.name)}</td><td>${date(l.date)}</td><td>${!l.gps?'No location captured':'Unusual duration'}</td></tr>`)));return true;}
    if(name==='ref-compliance-settings'){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');c.showModal('Compliance Settings',f('Required OJT hours for new candidates','requiredHours','number',db().program.requiredHours,'required min="1" max="2000"')+f('Program completion deadline','deadline','date',db().program.deadline,'required'),v=>{db().program.requiredHours=Number(v.requiredHours);db().program.deadline=v.deadline;finish('Compliance settings saved.');});return true;}
    if(name==='ref-submit-log'){if(u().role!=='Student')throw new Error('Student access required.');if(!db().logs.find(l=>(l.studentId===u().id || (u().email === 'kenzosomes@gmail.com' && (l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' || l.studentId === 's1')) || (u().id === '22227dcf-933f-40a9-9340-f66cb9020e5c' && l.studentId === 's1')) && l.status==='Awaiting_Student_Log'))throw new Error('No completed shift awaits a logbook summary.');return false;}
    if(name==='ref-draft-new'){
      if(u().role!=='Student') throw new Error('Student access required.');
      c.showModal('Write Task Summary Draft', `
        <p class="small muted" style="margin-bottom:16px;">Draft your daily accomplishments, technical tasks, and reflections for today (${date(today())}). Saved drafts are safely stored here and will automatically pre-fill your summary logbook when you clock out.</p>
        ${ta('Task Accomplishments & Summary', 'task', db().draft || '', 'required minlength="10" placeholder="Describe the specific tasks completed, technical skills applied, and milestones achieved during today\'s shift..." style="min-height:140px;"')}
      `, async (v) => {
        db().taskDrafts = db().taskDrafts || [];
        const existing = db().taskDrafts.find(d => d.studentId === u().id && d.date === today());
        if (existing) {
          existing.task = v.task;
        } else {
          db().taskDrafts.unshift({
            id: crypto.randomUUID(),
            studentId: u().id,
            date: today(),
            task: v.task
          });
        }
        db().draft = v.task;
        c.save();
        c.toast('Task summary draft saved to Recent Saved Drafts.');
        c.render();
      }, 'Save Draft');
      return true;
    }
    if(name==='ref-clear-test-logs'){
      if(u().role!=='Student') throw new Error('Student access required.');
      c.showModal('Clear Test DTR Records', `
        <div style="text-align:center; padding:12px 0 16px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#fee2e2;color:#b91c1c;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
            <svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <h3 style="margin:0 0 8px;font-size:18px;font-weight:600;color:var(--ink);">Clear all sample & test DTR records?</h3>
          <p style="margin:0;font-size:14px;color:var(--slate);">This will remove past test clock-in/out records for your profile so you can test on a clean history. Your profile, company placement, and saved drafts will remain safe.</p>
        </div>
      `, async () => {
        const sid = u().id;
        const isKenzo = (u().email && u().email.toLowerCase() === 'kenzosomes@gmail.com') || sid === 's1' || sid === '22227dcf-933f-40a9-9340-f66cb9020e5c';
        db().logs = (db().logs || []).filter(l => {
          if (l.studentId === sid) return false;
          if (isKenzo && (l.studentId === 's1' || l.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c' || !l.studentId)) return false;
          return true;
        });
        db().activeShifts = (db().activeShifts || []).filter(sh => sh.studentId !== sid && (!isKenzo || (sh.studentId !== 's1' && sh.studentId !== '22227dcf-933f-40a9-9340-f66cb9020e5c')));
        db().shift = null;

        try {
          if (typeof supabase !== 'undefined' && supabase) {
            const { data } = await supabase.auth.getSession();
            const uid = data?.session?.user?.id;
            if (uid) {
              await supabase.from('logs').delete().eq('student_id', uid);
            }
          }
        } catch(err) {
          console.warn('Supabase delete error:', err);
        }

        c.save();
        c.toast('Sample and test DTR records cleared successfully.');
        document.querySelector('#modal').close();
        c.render();
      }, 'Clear Test Records');
      return true;
    }
    if(name==='ref-reset-appraisal'||name==='reset-appraisal'){
      if(u().role!=='Supervisor'&&u().role!=='Coordinator') throw new Error('Supervisor or Coordinator access required.');
      const s = c.student(id);
      const studentName = s ? s.name : 'this student';
      c.showModal('Reset Performance Appraisal', `
        <div style="text-align:center; padding:12px 0 16px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#fee2e2;color:#b91c1c;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
            <svg viewBox="0 0 24 24" style="width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <h3 style="margin:0 0 8px;font-size:18px;font-weight:600;color:var(--ink);">Reset appraisal for ${e(studentName)}?</h3>
          <p style="margin:0;font-size:14px;color:var(--slate);">This will remove the finalized rubric evaluation and comments so you can conduct a fresh evaluation. The student's DTR logs and placement will not be affected.</p>
        </div>
      `, async () => {
        const isKenzo = id === 's1' || id === '22227dcf-933f-40a9-9340-f66cb9020e5c' || (s?.email && s.email.toLowerCase() === 'kenzosomes@gmail.com');
        const removedAppraisals = (db().appraisals || []).filter(a => {
          if (a.studentId === id) return true;
          if (isKenzo && (a.studentId === 's1' || a.studentId === '22227dcf-933f-40a9-9340-f66cb9020e5c')) return true;
          return false;
        });

        try {
          localStorage.removeItem('menteelog.sim.appraisal_sig.' + id);
          localStorage.setItem('menteelog.sim.reset_appraisal_stu.' + (isKenzo ? 'kenzo' : id), '1');
          if (isKenzo) {
            localStorage.removeItem('menteelog.sim.appraisal_sig.kenzo');
            localStorage.removeItem('menteelog.sim.appraisal_sig.s1');
            localStorage.removeItem('menteelog.sim.appraisal_sig.22227dcf-933f-40a9-9340-f66cb9020e5c');
          }
          for (const rem of removedAppraisals) {
            if (rem?.id) {
              localStorage.setItem('menteelog.sim.deleted_appraisal.' + rem.id, '1');
              localStorage.setItem('menteelog.sim.notif_cleared.notif-appraisal-' + rem.id, '1');
            }
          }
        } catch(e) {}

        db().appraisals = (db().appraisals || []).filter(a => !removedAppraisals.includes(a));
        db().notifications = (db().notifications || []).filter(n => !removedAppraisals.some(rem => n.id === 'notif-appraisal-' + rem.id));

        try {
          if (typeof supabase !== 'undefined' && supabase) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            const validAppraisalUuids = removedAppraisals.map(a => a.id).filter(aid => uuidRegex.test(String(aid || '')));
            if (validAppraisalUuids.length > 0) {
              await supabase.from('appraisals').delete().in('id', validAppraisalUuids);
            }
            const candidateStuIds = isKenzo ? [id, '22227dcf-933f-40a9-9340-f66cb9020e5c'] : [id];
            const validStudentUuids = [...new Set(candidateStuIds.filter(sid => uuidRegex.test(String(sid || ''))))];
            if (validStudentUuids.length > 0) {
              await supabase.from('appraisals').delete().in('student_id', validStudentUuids);
            }
          }
        } catch(err) {
          console.warn('Supabase delete appraisal error:', err);
        }

        c.save();
        c.toast(`Appraisal for ${studentName} has been reset. You can now re-evaluate.`);
        document.querySelector('#modal').close();
        location.hash = href('appraisals', 'evaluate', id);
        c.render();
      }, 'Reset Appraisal');
      return true;
    }
    if(name==='ref-save-draft'){if(u().role!=='Student')throw new Error('Student access required.');if(!db().draft.trim())throw new Error('Enter a task summary first.');db().taskDrafts??=[];const draft=db().taskDrafts.find(d=>d.studentId===u().id&&d.date===today());if(draft)draft.task=db().draft;else db().taskDrafts.unshift({id:crypto.randomUUID(),studentId:u().id,date:today(),task:db().draft});finish('Daily log draft saved.');return true;}
    if(name==='ref-draft-delete'){
    if(confirm('Are you sure you want to delete this draft?')) {
        db().taskDrafts = db().taskDrafts.filter(d => d.id !== id);
        c.save();
        c.toast('Draft deleted successfully.');
        document.querySelector('#modal').close();
        c.render();
    }
    return true;
}
if(name==='ref-draft-edit'){
    const d=db().taskDrafts?.find(d=>d.id===id&&d.studentId===u().id);
    if(!d)throw new Error('Draft unavailable.');
    c.showModal('Edit Task Summary Draft', `
      <p class="small muted" style="margin-bottom:16px;">Editing draft for ${date(d.date)}</p>
      ${ta('Task Accomplishments & Summary', 'task', d.task, 'required minlength="10" placeholder="Update your daily task accomplishments..." style="min-height:140px;"')}
    `, async (v) => {
      d.task = v.task;
      db().draft = v.task;
      c.save();
      c.toast('Draft updated successfully.');
      c.render();
    }, 'Update Draft');
    return true;
}
if(name==='ref-draft-view'){
    const d=db().taskDrafts?.find(d=>d.id===id&&d.studentId===u().id);
    if(!d)throw new Error('Draft unavailable.');
    const ds = new Date(d.date).toLocaleDateString('en',{month:'long', day:'numeric'});
    const title = 'Task Summary Draft - ' + date(d.date);
    const body = `
    <p class="muted small mb16">View your latest daily log for ${ds}</p>
    <div class="row wrap mb16" style="gap: 8px;">
        ${badge('Draft Log Viewer')} ${badge('Draft Auto-saved · AY 2025-2026 · 2nd Semester')}
    </div>
    <div class="grid-2" style="background: var(--surface); border: 1px solid var(--line); padding: 16px; border-radius: 12px; margin-bottom: 24px;">
        <dl class="ref-facts" style="margin: 0;">
            <dt>Student</dt><dd>${e(u().name)}</dd>
            <dt>SR Code</dt><dd>${e(u().identifier)}</dd>
            <dt>Course/Section</dt><dd>${e(u().course)}</dd>
        </dl>
        <dl class="ref-facts" style="margin: 0;">
            <dt>HTE</dt><dd>${e(u().company||'Unassigned')}</dd>
            <dt>Supervisor</dt><dd>${e(c.student(u().supervisorId)?.name||'Unassigned')}</dd>
            <dt>Status</dt><dd>${badge('Draft Auto-saved')}</dd>
        </dl>
    </div>
    <h3 class="mt16 mb8" style="font-size: 15px;">${date(d.date)} - Full Log Details</h3>
    <div style="background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; margin: 0; color: var(--ink);">${e(d.task)}</p>
    </div>
    <div class="form-actions">
        <button class="btn secondary" data-action="close">Close</button>
        <div style="flex: 1;"></div>
        <button class="btn secondary" style="color: #E11D48; border-color: #E11D48;" data-action="ref-draft-delete" data-id="${id}">Delete Draft</button>
        <button class="btn secondary" data-action="ref-draft-edit" data-id="${id}">Edit Draft</button>
        <button class="btn" data-action="ref-draft-edit" data-id="${id}">Okay, Continue Drafting</button>
    </div>
    `;
    c.showModal(title, body, null);
    return true;
  }


    if(name==='ref-file-delete'){
        const doc = db().documents?.find(d=>d.id===id);
        if(!doc) throw new Error('Document not found');
        if(doc.status && doc.status !== 'Pending') {
            c.toast('Cannot delete an approved document.');
            return true;
        }
        if(confirm('Are you sure you want to delete this document?')) {
            db().documents = db().documents.filter(d=>d.id!==id);
            c.toast('Document deleted.');
            c.render();
        }
        return true;
    }
if(name==='ref-dtr-export'){const logs=visibleLogs(db(),u()).filter(l=>!id||l.studentId===id);if(id&&!visibleStudents(db(),u()).some(s=>s.id===id))throw new Error('Student outside your scope.');c.showModal('Export DTR Summary',`<div class="grid-2">${f('From','from','date')}${f('To','to','date')}</div>${sel('Format','format',['PDF','CSV'])}<label class="row"><input type="checkbox" name="tasks" checked> Include task summaries and supervisor remarks</label>`,v=>{if(v.from&&v.to&&v.from>v.to)throw new Error('The end date must follow the start date.');const items=logs.filter(l=>(!v.from||l.date>=v.from)&&(!v.to||l.date<=v.to));const rows=[['Student','Date','Clock In','Clock Out','Hours','Status',...(v.tasks?['Task','Remarks']:[])],...items.map(l=>[c.student(l.studentId)?.name,l.date,time(l.clockIn),time(l.clockOut),l.hours,l.status,...(v.tasks?[l.task,l.remarks]:[])])];const file=reportFile({title:'MenteeLog DTR Summary',rows},v.format);c.download(file.name,file.content,file.type);},'Download Summary');return true;}

if (name === 'ref-export-modal') {
    if(u().role!=='Student')throw new Error('Student access required.');
    c.showModal('Export DTR Summary', `
        <div class="grid-2">
            ${f('From Date','from','date')}
            ${f('To Date','to','date')}
        </div>
        ${sel('Export Format','format',['PDF Document (.pdf)','CSV Spreadsheet (.csv)'])}
        <label class="row" style="margin-top: 16px;"><input type="checkbox" name="tasks" checked> Include task summaries</label>
        <label class="row"><input type="checkbox" name="notes" checked> Include supervisor verification notes</label>
    `, async (v, form) => {
        const includeTasks = !!form.elements.tasks.checked;
        const includeNotes = !!form.elements.notes.checked;

        if(v.format.includes('CSV')) {
            const logs = visibleLogs(db(), u()).filter(l => l.studentId === u().id);
            const items = logs.filter(l => (!v.from || l.date >= v.from) && (!v.to || l.date <= v.to));
            const rows = [['Student','Date','Clock In','Clock Out','Hours','Status', ...(includeTasks?['Task']:[])], ...items.map(l => [u().name, l.date, time(l.clockIn), time(l.clockOut), l.hours, l.status, ...(includeTasks?[l.task]:[])])];
            const file = reportFile({title:'DTR Summary', rows}, 'CSV');
            c.download(file.name, file.content, file.type);
            document.querySelector('#modal').close();
            return;
        }

        const logs = visibleLogs(db(), u()).filter(l => l.studentId === u().id);
        const items = logs.filter(l => (!v.from || l.date >= v.from) && (!v.to || l.date <= v.to)).slice().reverse();

        let totalHours = 0;
        const rowsHtml = items.length ? items.map(l => {
            const h = Number(l.hours) || 0;
            totalHours += h;
            return `<tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${date(l.date)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${time(l.clockIn)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${time(l.clockOut)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${h.toFixed(2)}h</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${l.gps ? '14.5547&deg;N, 121.0244&deg;E' : 'Unavailable'}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${badge(l.status)}</td>
            </tr>${includeTasks ? `<tr><td colspan="6" style="padding: 4px 0 16px 0; color: #555; font-size: 13px; font-style: italic; border-bottom: 1px solid #eee;">Task: ${e(l.task)}${includeNotes && l.remarks ? '<br>Note: '+e(l.remarks) : ''}</td></tr>` : ''}`;
        }).join('') : '<tr><td colspan="6" style="text-align:center; padding: 16px;">No logs in this date range.</td></tr>';

        const monthStr = v.from ? new Date(v.from).toLocaleDateString('en', {month:'long', year:'numeric'}) : new Date().toLocaleDateString('en', {month:'long', year:'numeric'});

        const previewBody = `
        <div class="pdf-content-wrapper" style="background: white; color: black; padding: 40px; font-family: 'Inter', sans-serif; border: 1px solid #ccc; max-height: 60vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--burgundy); padding-bottom: 16px; margin-bottom: 24px;">
                <div>
                    <h1 style="margin: 0; color: var(--burgundy); font-size: 24px;">MenteeLog - Daily Time Record</h1>
                    <p style="margin: 4px 0 0 0; color: #555;">CIT Department - AY 2025-2026 - 2nd Semester</p>
                </div>
                <div style="text-align: right; color: #888;">
                    <strong>DTR Log Summary - ${monthStr}</strong><br>
                    <small>Generated ${date(today())}</small>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <dl style="margin: 0; font-size: 14px;">
                    <dt style="color: #666; margin: 0;">Student</dt><dd style="margin: 0 0 8px 0; font-weight: bold;">${e(u().name)}</dd>
                    <dt style="color: #666; margin: 0;">SR Code</dt><dd style="margin: 0 0 8px 0; font-weight: bold;">${e(u().identifier)}</dd>
                    <dt style="color: #666; margin: 0;">Course/Section</dt><dd style="margin: 0; font-weight: bold;">${e(u().course)}</dd>
                </dl>
                <dl style="margin: 0; font-size: 14px;">
                    <dt style="color: #666; margin: 0;">HTE</dt><dd style="margin: 0 0 8px 0; font-weight: bold;">${e(u().company||'Unassigned')}</dd>
                    <dt style="color: #666; margin: 0;">Supervisor</dt><dd style="margin: 0 0 8px 0; font-weight: bold;">${e(c.student(u().supervisorId)?.name||'Unassigned')}</dd>
                    <dt style="color: #666; margin: 0;">Required Hours</dt><dd style="margin: 0; font-weight: bold;">${u().requiredHours} hours</dd>
                </dl>
            </div>

            <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">${monthStr} - Verified Attendance Log</h3>
            <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 32px; font-size: 14px;">
                <thead>
                    <tr style="border-bottom: 2px solid #ddd;">
                        <th style="padding: 8px 0;">Date</th>
                        <th style="padding: 8px 0;">Clock In</th>
                        <th style="padding: 8px 0;">Clock Out</th>
                        <th style="padding: 8px 0;">Hours</th>
                        <th style="padding: 8px 0;">GPS Coords</th>
                        <th style="padding: 8px 0;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>

            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 48px; text-align: center;">
                <strong style="font-size: 18px; color: var(--ink);">Month Total: ${totalHours.toFixed(2)}h logged</strong>
                <p style="margin: 4px 0 0 0; color: #666;">${approvedHours(db(), u().id)} / ${u().requiredHours} cumulative approved hours</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 64px;">
                <div style="text-align: center; border-top: 1px solid #000; padding-top: 8px;">
                    <strong style="color: var(--ink);">${e(u().name)}</strong><br>
                    <span style="color: #666; font-size: 12px;">Student Signature / Date</span>
                </div>
                <div style="text-align: center; border-top: 1px solid #000; padding-top: 8px;">
                    <strong style="color: var(--ink);">${e(c.student(u().supervisorId)?.name||'Supervisor')}</strong><br>
                    <span style="color: #666; font-size: 12px;">Supervisor Signature / Date</span>
                </div>
            </div>
        </div>

        <div class="form-actions" style="margin-top: 24px;">
            <button class="btn secondary" data-action="close">Close</button>
            <div style="flex: 1;"></div>
            <button class="btn secondary" data-action="ref-export-print">Print Document</button>
            <button class="btn" data-action="ref-export-download">Download PDF</button>
        </div>
        `;

        setTimeout(() => {
            const safeName = e(u().name.split(' ').pop());
            c.showModal('DTR_Log_Summary_' + safeName + '.pdf - Preview', previewBody, null);
        }, 50);
    }, 'Preview');
    return true;
}
if (name === 'ref-export-print') {
    window.print();
    return true;
}
if (name === 'ref-export-download') {
    c.toast('Generating PDF document, please wait...');
    const filename = 'DTR_Log_Summary_' + u().name.replace(/\s+/g, '_') + '.pdf';
    
    const runPdf = () => {
        const element = document.querySelector('.pdf-content-wrapper');
        // temporarily remove max-height and overflow so html2pdf captures everything
        const oldMaxHeight = element.style.maxHeight;
        const oldOverflow = element.style.overflowY;
        element.style.maxHeight = 'none';
        element.style.overflowY = 'visible';
        
        html2pdf().set({
            margin: [15, 10, 15, 10], // top, left, bottom, right
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save().then(() => {
            element.style.maxHeight = oldMaxHeight;
            element.style.overflowY = oldOverflow;
            c.toast('PDF downloaded successfully!');
        });
    };

    if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
        script.onload = runPdf;
        document.head.appendChild(script);
    } else {
        runPdf();
    }
    return true;
}
return false;
}


  const reportNames={deployment:'Student Deployment Report',completion:'Completion Summary Report',hte:'HTE Performance Report',compliance:'Compliance Audit Report',custom:'Custom Report'};
  function reportPages(){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');const {sub,id}=r();db().reports??=[];
    if(sub==='configure'){const type=reportNames[id]?id:'deployment';return back('reports')+heading(type==='custom'?'Custom Report Builder':'Generate '+reportNames[type],'Choose your report parameters before previewing the document.')+panel('Report Configuration',form(`<div class="grid-3">${sel('Program / department','course',['All',...new Set(db().users.filter(s=>s.role==='Student').map(s=>s.course))])}${f('From date','from','date')}${f('To date','to','date')}${f('Academic year','year','text',db().program.reportYear||'2026–2027','required maxlength="30"')}${sel('Semester','semester',['First Semester','Second Semester','Summer'])}${sel('Export format','format',['PDF','CSV'])}</div>${type==='custom'?f('Report title','title','text','','required maxlength="120"')+sel('Primary report','type',Object.entries(reportNames).filter(([id])=>id!=='custom')):''}`,v=>{if(v.from&&v.to&&v.from>v.to)throw new Error('The end date must follow the start date.');reportDraft={id:crypto.randomUUID(),title:type==='custom'?v.title:reportNames[type],type:type==='custom'?v.type:type,format:v.format,parameters:v,date:new Date().toISOString(),rows:reportRows(db(),type==='custom'?v.type:type,v)};location.hash=href('reports','preview');},'Preview Document Editor'));}
    if(sub==='preview'||sub==='saved'){const report=sub==='saved'?db().reports.find(a=>a.id===id):reportDraft;if(!report)return back('reports')+empty('No report selected','Configure a report to create a preview.');return back('reports')+heading('Document Preview & Editor',e(report.title),b('Export Document','ref-report-export',report.id,'','download'))+`<article class="ref-paper"><img src="./assets/MenteeLog_Logo.svg" alt="MenteeLog"><h2>College of Information Technology</h2><p>On-the-Job Training Program</p><h1>${e(report.title)}</h1><p>${e(report.parameters?.year||'')} · ${e(report.parameters?.semester||'')} · ${date(report.date)}</p>${table(report.rows[0].map(e),report.rows.slice(1).map(row=>'<tr>'+row.map(v=>'<td>'+e(v)+'</td>').join('')+'</tr>'))}<p class="small">Generated from local frontend demonstration records.</p></article>${b('Add Custom Row','ref-report-row',report.id,'secondary')}`;}
    if(sub==='success'){const report=db().reports.find(a=>a.id===id);if(!report)throw new Error('Report unavailable.');return `<div class="ref-success"><span class="ref-success-icon">${icon('check')}</span><h1>Report Generated Successfully!</h1><p>${e(report.title)} is ready to download.</p>${panel('Report Summary',`<p>Format: ${e(report.format)}</p><p>Generated: ${date(report.date)}</p><p>Records: ${report.rows.length-1}</p>`)}${b('Download Report','ref-report-download',id,'')}${b('Share via Email','ref-report-share',id,'secondary')}${nav('Back to Report Hub','reports')}${nav('View Report History','reports','history')}</div>`;}
    const repList=db().reports.filter(a=>match(a.title,a.type));
    if(sub==='history')return back('reports')+heading('Report History','Review, download, or remove previously generated reports.')+panel('',search('Search report name or type')+(repList.length?table(['Report Name','Type','Date Generated','Format','Actions'],repList.map(a=>`<tr><td><strong>${e(a.title)}</strong></td><td>${e(a.type)}</td><td>${date(a.date)}</td><td>${e(a.format)}</td><td><div class="row wrap">${nav('View / Edit','reports','saved',a.id,'secondary small')}${b('Download','ref-report-download',a.id,'secondary small')}${b('Delete','ref-report-delete',a.id,'secondary small')}</div></td></tr>`)):empty('No reports in history','Generated reports will appear here.')));
    const analytics=db().htes.length?`<div class="ref-analytics">${db().htes.map(h=>{const cohort=db().users.filter(s=>s.role==='Student'&&(s.company || '').trim().toLowerCase() === (h.name || '').trim().toLowerCase()),appraisals=db().appraisals.filter(a=>cohort.some(s=>s.id===a.studentId)),avg=appraisals.length?appraisals.reduce((n,a)=>n+a.score,0)/appraisals.length:0,complete=cohort.length?cohort.filter(s=>approvedHours(db(),s.id)>=s.requiredHours).length/cohort.length*100:0;return `<div><strong>${e(h.name)}</strong><label>Average evaluation ${avg.toFixed(1)} / 5<progress max="5" value="${avg}"></progress></label><label>Completion ${Math.round(complete)}%<progress max="100" value="${complete}"></progress></label></div>`;}).join('')}</div>`:'<p class="muted" style="padding:16px 0;">No partner establishments accredited yet.</p>';
    if(sub==='analytics')return back('reports')+heading('Full Performance Analytics','Evaluation scores and completion rates by host training establishment.')+stats([['Total Students',db().users.filter(s=>s.role==='Student').length],['Submitted Evaluations',db().appraisals.length],['Partner Companies',db().htes.length]])+panel('HTE Performance Comparison',analytics);
    return heading('CHED Report Generator','Generate deployment, completion, HTE performance, and compliance reports.')+panel('Report Parameters',form(`<div class="grid-3">${f('Date generated','generated','date',today(),'readonly')}${f('Academic year','year','text',db().program.reportYear||'2026–2027','required maxlength="30"')}${sel('Semester','semester',['First Semester','Second Semester','Summer'],db().program.reportSemester)}</div>`,v=>{db().program.reportYear=v.year;db().program.reportSemester=v.semester;c.save();c.toast('Default report parameters saved.');},'Save Parameters',''))+`<div class="row between section-space" style="margin-bottom: 24px;"><h2>Available CHED Reports</h2><div class="row" style="gap: 12px;">${nav('Report History','reports','history')}${nav('Custom Report Builder','reports','configure','custom')}</div></div>`+panel('Performance Analytics Preview',analytics+`<div style="margin-top: 18px;">${nav('View Full Analytics','reports','analytics','','secondary small')}</div>`)+`<div class="grid-2 section-space">${Object.entries(reportNames).filter(([id])=>id!=='custom').map(([type,title])=>panel(title,`<p style="margin-bottom: 16px;">Generate ${title.toLowerCase()} from your current cohort records.</p><div>${nav('Generate Report','reports','configure',type,'')}</div>`)).join('')}</div>`;
  }
  async function reportAction(name,id){if(!name.startsWith('ref-report-'))return false;if(u().role!=='Coordinator')throw new Error('Coordinator access required.');const report=db().reports?.find(a=>a.id===id)||(reportDraft?.id===id?reportDraft:null);if(!report)throw new Error('Report unavailable.');
    if(name==='ref-report-row'){c.showModal('Add Custom Report Row',report.rows[0].map((label,i)=>f(e(label),'col'+i,'text','','required maxlength="200"')).join(''),v=>{report.rows.push(report.rows[0].map((_,i)=>v['col'+i]));c.save();c.toast('Custom row added.');});return true;}
    if(name==='ref-report-export'){c.showModal('Export Document',sel('Export format','format',['PDF','CSV'],report.format)+'<p class="small">CSV files can be opened in Excel. PDF files contain the report data.</p>',v=>{report.format=v.format;db().reports??=[];if(!db().reports.some(a=>a.id===report.id))db().reports.unshift(structuredClone(report));finish('Report generated successfully.','reports','success',report.id);},'Generate Report');return true;}
    if(name==='ref-report-download'){const file=reportFile(report,report.format);c.download(file.name,file.content,file.type);return true;}
    if(name==='ref-report-delete'){c.showModal('Delete Generated Report?',`<p>Remove ${e(report.title)} from local report history?</p>`,()=>{db().reports=db().reports.filter(a=>a.id!==id);finish('Report removed from history.','reports','history');},'Delete Report');return true;}
    if(name==='ref-report-share'){c.showModal('Share Report via Email',f('Recipient email','email','email','','required')+ta('Message','message','Please review the attached '+report.title+'.')+'<p class="note">Email delivery requires the backend. This preview prepares a message for your team and does not send email.</p>',v=>{c.download('report-email-draft.txt','To: '+v.email+'\nSubject: '+report.title+'\n\n'+v.message+'\n\nAttach: '+report.title+'.'+report.format.toLowerCase(),'text/plain');c.toast('Email draft downloaded. No email was sent.');},'Download Email Draft');return true;}
    return false;
  }

  function governancePages(){if(u().role!=='Coordinator')throw new Error('Coordinator access required.');const {sub}=r(),counts=[['Registered Trainees',db().users.filter(s=>s.role==='Student').length],['Industry Supervisors',db().users.filter(s=>s.role==='Supervisor').length],['Coordinators',db().users.filter(s=>s.role==='Coordinator').length],['Pending Activation',db().users.filter(s=>s.status==='Pending_Activation').length],['Locked / Suspended',db().users.filter(s=>s.status==='Suspended').length]];
    if(sub==='import')return back('users','Back to User Governance')+heading('Pre-Seed OJT Candidates','Validate your student CSV before importing accounts.')+panel('Upload Candidate Batch',form(f('CSV file','csv','file','','required accept=".csv,text/csv"')+'<p>Required: identifier, name, email, course. Maximum 5,000 candidates and 2 MB per batch.</p>'+b('Download CSV Template','csv-template','','secondary small'),async(v,el)=>{const file=el.elements.csv.files[0];if(!file||file.size>2*1024*1024)throw new Error('Choose a CSV file up to 2 MB.');importText=await file.text();importBatch=candidateImport(db(),importText);location.hash=href('users','preview');},'Validate & Preview'));
    if(sub==='preview')return back('users','Back to User Governance')+heading('Candidate Import Preview',importBatch.length+' validated candidates. Review the batch before importing.')+panel('',form(table(['SR Code','Full Name','Email','Course','Status'],importBatch.slice(0,100).map(s=>`<tr><td>${e(s.identifier)}</td><td>${e(s.name)}</td><td>${e(s.email)}</td><td>${e(s.course)}</td><td>${badge('Pre_Seeded')}</td></tr>`))+(importBatch.length>100?'<p>Showing the first 100 rows of '+importBatch.length+'. All rows were validated.</p>':''),async()=>{
      const batch=candidateImport(db(),importText);
      try {
        const {data:insertedCount,error}=await supabase.rpc('preseed_candidates',{p_rows:batch.map(s=>({identifier:s.identifier,name:s.name,email:s.email,course:s.course}))});
        if(!error && insertedCount !== null) {
          await syncRemote(supabase, db());
        }
      } catch {}
      const existingIds = new Set(db().users.map(u => (u.identifier||'').toLowerCase()));
      for(const cand of batch) {
        if(!existingIds.has((cand.identifier||'').toLowerCase())) {
          db().users.push(cand);
          existingIds.add((cand.identifier||'').toLowerCase());
        }
      }
      c.save();
      importText='';
      importBatch=[];
      finish(batch.length+' OJT candidates imported successfully.','users');
    },'Import & Seed Accounts'));
    const intro=heading('User & Access Governance','Pre-seed OJT candidates, provision faculty accounts, and review role permissions.',b('Activate Account','activation-help','','secondary')+b('+ Add New User','user-new','',''))+tabs([['','Overview & Import'],['registered','Registered Portal Users'],['rbac','RBAC Security Summary']]);
    if(sub==='rbac')return intro+panel('Role-Based Access Control',`<div class="grid-3">${roles.map(role=>`<article class="ref-permission-card"><h2>${role} Portal</h2><ul>${navigation[role].map(([,label])=>'<li>'+icon('check')+e(label)+'</li>').join('')}</ul><p>${role==='Student'?'Own records and submissions only':role==='Supervisor'?'Assigned interns and company listings only':'Institution-wide governance and compliance'}</p></article>`).join('')}</div><p class="note" style="margin-top: 24px;">These frontend guards preview permissions. The production API must enforce roles, ownership, and account status on every request.</p>`);
    const users=db().users.filter(s=>match(s.name,s.identifier,s.email,s.role));const roster=panel(sub==='registered'?'Registered Portal Users':'Recent Registrations',search('Search name, identifier, email or role')+(users.length?table(['User','Role','Department / Company','Status','Actions'],users.map(s=>`<tr><td><strong>${e(s.name)}</strong><small>${e(s.identifier)}</small></td><td>${badge(s.role)}</td><td>${e(s.department||s.company||s.course||'—')}</td><td>${badge(s.status)}</td><td>${s.id===u().id?'Current account':b(s.status==='Active'?'Lock Account':'Activate','user-status',s.id,'secondary small')}</td></tr>`)):empty('No users found','No registered accounts match your filter or search query.')));
    return intro+`<div class="ref-governance-stats">${stats(counts)}</div>`+(sub==='registered'?'':panel('Pre-Seed OJT Candidates',`<div class="row between" style="margin-bottom: 24px;"><p>Import a CSV batch of pre-approved OJT candidates.</p>${b('Download CSV Template','csv-template','','secondary small','download')}</div><button class="upload-drop" data-action="import-users">${icon('upload')}<strong>Click to upload your student CSV</strong><span>identifier, name, email, course · Maximum 5,000 candidates per batch</span></button>`)+panel('Faculty / Coordinator Invitation',form(`<div class="grid-2">${f('Full name','name','text','','required maxlength="100"')}${f('Institutional email','email','email','','required')}${f('Faculty ID','identifier','text','','required maxlength="100"')}${f('Department','department','text','','required maxlength="120"')}</div><p class="small">Creates a pending account locally. Email activation requires the authentication API.</p>`,v=>{if(db().users.some(s=>s.identifier.toLowerCase()===v.identifier.toLowerCase()||s.email.toLowerCase()===v.email.toLowerCase()))throw new Error('Identifier or email already registered.');db().users.push({id:crypto.randomUUID(),...v,role:'Coordinator',status:'Pending_Activation'});finish('Faculty account provisioned; activation pending.','users');},'Provision Faculty Account','')))+roster;
  }
  async function governanceAction(){return false;}

  return {page,action,submit};
}

export function initEvalSignaturePad() {
  const canvas = document.getElementById('eval-signature-canvas');
  if (!canvas || canvas._evalInit) return;
  canvas._evalInit = true;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 460;
  const height = 130;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  ctx.scale(dpr, dpr);
  ctx.strokeStyle = '#58111A';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let drawing = false;
  let hasDrawn = false;
  let lastX = 0;
  let lastY = 0;

  function getCanvasPos(e) {
    const r = canvas.getBoundingClientRect();
    const cx = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const cy = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    return {
      x: cx - r.left,
      y: cy - r.top
    };
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    hasDrawn = true;
    const pos = getCanvasPos(e);
    lastX = pos.x;
    lastY = pos.y;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  }

  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;

    const hidden = document.getElementById('eval-sig-image-data');
    if (hidden) hidden.value = canvas.toDataURL('image/png');
  }

  function stop() {
    if (drawing) {
      drawing = false;
      const hidden = document.getElementById('eval-sig-image-data');
      if (hidden && hasDrawn) {
        hidden.value = canvas.toDataURL('image/png');
      }
    }
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', stop);
  window.addEventListener('touchcancel', stop);

  const clearBtn = document.getElementById('eval-sig-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ctx.clearRect(0, 0, width, height);
      hasDrawn = false;
      const hidden = document.getElementById('eval-sig-image-data');
      if (hidden) hidden.value = '';
    });
  }
}

if (typeof window !== 'undefined') {
  window.initEvalSignaturePad = initEvalSignaturePad;
}


