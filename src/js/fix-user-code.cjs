const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// 1. Fix the jumping button size by keeping classes consistent
const oldPills = "${['All','BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu'].map((s)=>b(s,'ref-course',s,c.view.course===s||c.view.mode===s?'ojt-filter active':'outline ojt-filter small')).join('')}\n        ${b('+ More Filters','ref-more-filters','',c.view.more?'ojt-filter active':'outline ojt-filter small')}";

const newPills = "${['All','BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu'].map((s)=>b(s,'ref-course',s,c.view.course===s||c.view.mode===s?'ojt-filter active small':'outline ojt-filter small')).join('')}\n        ${b('+ More Filters','ref-more-filters','',c.view.more?'ojt-filter active small':'outline ojt-filter small')}";

if (jsContent.includes(oldPills)) {
  jsContent = jsContent.replace(oldPills, newPills);
}

// 2. Fix the "View Details" button at the bottom when Application is Submitted
// The user has this block:
const oldBanner = "${applied? `<div style=\"padding:16px 24px; background:#FAF4E8; border-top:1px solid rgba(0,0,0,0.05);\"><div class=\"badge primary text-center\" style=\"display:block; padding:12px; border-radius:8px;\">Application Submitted</div></div>` : \n        b('Apply to this Position','ref-apply',j.id,'primary full', '', 'style=\"border-radius:0; height:56px; font-size:16px;\"')}";

const newBanner = "${applied? nav('Application Submitted — View Details','jobs','detail',j.id,'btn primary full', 'style=\"border-radius:0; height:56px; font-size:16px; background:#58111A; color:#fff; border:none;\"') : \n        b('Apply to this Position','ref-apply',j.id,'primary full', '', 'style=\"border-radius:0; height:56px; font-size:16px;\"')}";

if (jsContent.includes(oldBanner)) {
  jsContent = jsContent.replace(oldBanner, newBanner);
} else {
  console.log("Could not find the old banner block exactly, trying regex...");
  // Fallback regex for the applied banner
  jsContent = jsContent.replace(/\$\{applied\? `<div style="padding:16px 24px;[^`]+` :\s+b\('Apply to this Position','ref-apply',j\.id,'primary full', '', 'style="border-radius:0; height:56px; font-size:16px;"'\)\}/g, newBanner);
}

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Fixed jumping buttons and added View Details to the bottom block');
