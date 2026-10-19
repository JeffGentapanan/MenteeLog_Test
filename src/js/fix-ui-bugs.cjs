const fs = require('fs');

// 1. Fix the CSS corners and add filter styles
const cssPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/styles.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace border-radius: 0; with border-radius: 0 0 16px 16px;
cssContent = cssContent.replace(
  '.ojt-job-apply-btn { width: 100%; border-radius: 0; height: 56px;',
  '.ojt-job-apply-btn { width: 100%; border-radius: 0 0 16px 16px; height: 56px;'
);
cssContent = cssContent.replace(
  '.ojt-job-applied { background: #58111A; color: #fff; padding: 16px; text-align: center; font-weight: 700; }',
  '.ojt-job-applied { background: #58111A; color: #fff; padding: 16px; text-align: center; font-weight: 700; border-radius: 0 0 16px 16px; }'
);

// Add active state for pills if not present
if(!cssContent.includes('.ojt-filter')) {
  cssContent += `
.ojt-filter { border-radius: 20px; font-size: 13px; font-weight: 600; padding: 6px 16px; }
.ojt-filter.active { background: #4A1521; color: #fff; border-color: #4A1521; }
`;
}

fs.writeFileSync(cssPath, cssContent, 'utf8');


// 2. Fix the JavaScript logic in portal-views.js to use functional buttons & add margin
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// The faulty static HTML:
const oldFiltersHtml = "`<div class=\"ojt-placement-dir\">\n        <div class=\"row wrap gap-8 mb24 filter-pills\">\n          ${['BSCS','BSIT','BSSA','Metro Manila','Davao','Cebu','+ More Filters'].map(s=>`<button class=\"btn ${s.includes('+')?'secondary':'outline'}\">${s}</button>`).join('')}\n        </div>\n      </div>`";

// The corrected functional HTML:
const newFiltersHtml = "`<div class=\"ojt-placement-dir\">\n        <div class=\"row wrap gap-8 filter-pills\" style=\"margin-bottom:32px;\">\n          ${['All','BS Computer Science','BS Information Technology','BS Computer Engineering'].map((s,i)=>b(['All Programs','BSCS','BSIT','BSCpE'][i],'ref-course',s,c.view.course===s?'ojt-filter active':'outline ojt-filter')).join('')}${b('+ More Filters','ref-more-filters','','secondary ojt-filter')}\n        </div>\n      </div>`";

if (jsContent.includes(oldFiltersHtml)) {
  jsContent = jsContent.replace(oldFiltersHtml, newFiltersHtml);
} else {
  // Fallback regex if spacing differs
  jsContent = jsContent.replace(/`<div class="ojt-placement-dir">[\s\S]*?<\/div>`/, newFiltersHtml);
}

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Fixed buttons, spacing, and border radius.');
