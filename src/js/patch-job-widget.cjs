const fs = require('fs');
const jsPath = 'c:/Users/User/OneDrive/Desktop/Team_MenteeLog/frontend/dist/js/portal-views.js';
let content = fs.readFileSync(jsPath, 'utf8');

const targetHtml = `<section class="card premium-card ojt-side-card">
             <h3>Interested in this position?</h3>
             \${isStudent?(applied?nav('View Application','applications','','','btn primary full'):b('Apply to this Position','ref-apply',id,'btn primary full')):nav('Edit Details','jobs','edit',id,'secondary full')+b(j.status==='Closed'?'Restore Position':'Deactivate Slot','ref-job-status',id,'full')}
             <p class="small muted mt16 text-center">Applying automatically forwards your verified MenteeLog profile and academic endorsement.</p>
          </section>`;

const newHtml = `\${isStudent ? \`<section class="card premium-card ojt-side-card">
             <h3>Interested in this position?</h3>
             \${applied?nav('View Application','applications','','','btn primary full'):b('Apply to this Position','ref-apply',id,'btn primary full')}
             <p class="small muted mt16 text-center">Applying automatically forwards your verified MenteeLog profile and academic endorsement.</p>
          </section>\` : \`<section class="card premium-card ojt-side-card">
             <h3>Slot Actions</h3>
             <div style="display: flex; flex-direction: column; gap: 12px;">
                \${nav('Edit Details','jobs','edit',id,'secondary full')}
                \${b(j.status==='Closed'?'Restore Position':'Deactivate Slot','ref-job-status',id,'full')}
             </div>
             <p class="small muted mt16 text-center">Update your slot details or change its visibility to students.</p>
          </section>\`}`;

// Use string replacement
if (content.includes(targetHtml)) {
    content = content.replace(targetHtml, newHtml);
    fs.writeFileSync(jsPath, content, 'utf8');
    console.log('Successfully updated job action widget!');
} else {
    console.log("Could not find the target HTML snippet. Attempting regex...");
    
    // Fallback: Regex to catch slight indentation differences
    const fallbackRegex = /<section class="card premium-card ojt-side-card">\s*<h3>Interested in this position\?<\/h3>\s*\$\{isStudent\?\(applied\?nav\('View Application','applications','','','btn primary full'\):b\('Apply to this Position','ref-apply',id,'btn primary full'\)\):nav\('Edit Details','jobs','edit',id,'secondary full'\)\+b\(j\.status==='Closed'\?'Restore Position':'Deactivate Slot','ref-job-status',id,'full'\)\}\s*<p class="small muted mt16 text-center">Applying automatically forwards your verified MenteeLog profile and academic endorsement\.<\/p>\s*<\/section>/;
    
    if (content.match(fallbackRegex)) {
        content = content.replace(fallbackRegex, newHtml);
        fs.writeFileSync(jsPath, content, 'utf8');
        console.log('Successfully updated job action widget via fallback regex!');
    } else {
        console.log('Failed to locate widget block.');
        process.exit(1);
    }
}
