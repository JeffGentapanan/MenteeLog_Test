const fs = require('fs');

const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// 1. Fix "View Details" button showing up even when applied
const oldFooter = `<div class="row between ojt-job-footer">
             <small class="muted">Posted 2 days ago</small>
             \${!applied?nav('View Details','jobs','detail',j.id,'btn secondary small'):''}
          </div>`;

const newFooter = `<div class="row between ojt-job-footer">
             <small class="muted">Posted 2 days ago</small>
             \${nav('View Details','jobs','detail',j.id,'btn secondary small')}
          </div>`;

if (jsContent.includes(oldFooter)) {
  jsContent = jsContent.replace(oldFooter, newFooter);
}

// 2. Fix the "+ More Filters" functionality missing UI panel
const oldFiltersHtml = "`<div class=\"ojt-placement-dir\">\n        <div class=\"row wrap gap-8 filter-pills mb32\">\n          ${['All','BS Computer Science','BS Information Technology','BS Computer Engineering'].map((s,i)=>b(['All Programs','BSCS','BSIT','BSCpE'][i],'ref-course',s,c.view.course===s?'ojt-filter active':'outline ojt-filter')).join('')}${b('+ More Filters','ref-more-filters','','secondary ojt-filter')}\n        </div>\n      </div>`";

// Note: escaping `${` inside string literals where necessary
const newFiltersHtml = "`<div class=\"ojt-placement-dir\">\n        <div class=\"row wrap gap-8 filter-pills ${c.view.more?'mb16':'mb32'}\">\n          ${['All','BS Computer Science','BS Information Technology','BS Computer Engineering'].map((s,i)=>b(['All Programs','BSCS','BSIT','BSCpE'][i],'ref-course',s,c.view.course===s?'ojt-filter active':'outline ojt-filter')).join('')}${b('+ More Filters','ref-more-filters','',c.view.more?'ojt-filter active':'outline ojt-filter')}\n        </div>\n        ${c.view.more?panel('Filter Opportunities',form(`<div class=\"grid-2\">${sel('Program','course',['All','BS Computer Science','BS Information Technology','BS Computer Engineering'],c.view.course)}${sel('Location','mode',['All',...new Set(db().jobs.map(j=>j.location))],c.view.mode)}</div>`,v=>{c.view.course=v.course;c.view.mode=v.mode;c.render();},'Apply Filters'), 'mb32'):''}\n      </div>`";

if (jsContent.includes(oldFiltersHtml)) {
  jsContent = jsContent.replace(oldFiltersHtml, newFiltersHtml);
} else {
  // If exact match fails, use regex
  jsContent = jsContent.replace(/`<div class="ojt-placement-dir">[\s\S]*?<\/div>`/g, newFiltersHtml);
}

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Fixed View Details and More Filters functionality');
